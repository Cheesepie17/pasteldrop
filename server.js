const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Room state: roomId -> Set of ws clients
const rooms = new Map();
// Client state: ws -> { peerId, roomId, deviceName, deviceType }
const clients = new Map();

function generatePeerId() {
  return Math.random().toString(36).substring(2, 9);
}

// Get primary local IPv4 address
function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254')) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

app.get('/api/info', (req, res) => {
  res.json({
    localIp: getLocalIP(),
    port: PORT
  });
});

wss.on('connection', (ws) => {
  const peerId = generatePeerId();

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const { type, roomId } = data;

      if (type === 'join') {
        const cleanRoom = (roomId || 'default').toUpperCase().trim();
        
        // Remove from old room if any
        const existing = clients.get(ws);
        if (existing && existing.roomId && rooms.has(existing.roomId)) {
          rooms.get(existing.roomId).delete(ws);
        }

        if (!rooms.has(cleanRoom)) {
          rooms.set(cleanRoom, new Set());
        }

        const roomSet = rooms.get(cleanRoom);
        roomSet.add(ws);

        clients.set(ws, {
          peerId,
          roomId: cleanRoom,
          deviceName: data.deviceName || 'Unknown Device',
          deviceType: data.deviceType || 'desktop'
        });

        // Collect existing peers in the room
        const peerList = [];
        roomSet.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            const info = clients.get(client);
            if (info) {
              peerList.push({
                peerId: info.peerId,
                deviceName: info.deviceName,
                deviceType: info.deviceType
              });
            }
          }
        });

        // Send welcome to this client
        ws.send(JSON.stringify({
          type: 'joined',
          peerId,
          roomId: cleanRoom,
          peers: peerList
        }));

        // Notify other peers in room about new peer
        const newPeerInfo = clients.get(ws);
        roomSet.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(JSON.stringify({
              type: 'peer-joined',
              peer: {
                peerId: newPeerInfo.peerId,
                deviceName: newPeerInfo.deviceName,
                deviceType: newPeerInfo.deviceType
              }
            }));
          }
        });
      } else if (['signal-offer', 'signal-answer', 'signal-candidate'].includes(type)) {
        // Relay WebRTC signaling directly to target peer
        const { targetPeerId, payload } = data;
        const senderInfo = clients.get(ws);
        if (!senderInfo || !senderInfo.roomId) return;

        const roomSet = rooms.get(senderInfo.roomId);
        if (!roomSet) return;

        roomSet.forEach((client) => {
          const info = clients.get(client);
          if (info && info.peerId === targetPeerId && client.readyState === 1) {
            client.send(JSON.stringify({
              type,
              senderPeerId: senderInfo.peerId,
              payload
            }));
          }
        });
      }
    } catch (err) {
      console.error('WS Error:', err);
    }
  });

  ws.on('close', () => {
    const info = clients.get(ws);
    if (info && info.roomId && rooms.has(info.roomId)) {
      const roomSet = rooms.get(info.roomId);
      roomSet.delete(ws);
      if (roomSet.size === 0) {
        rooms.delete(info.roomId);
      } else {
        // Broadcast peer left
        roomSet.forEach((client) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({
              type: 'peer-left',
              peerId: info.peerId
            }));
          }
        });
      }
    }
    clients.delete(ws);
  });
});

// WebSocket Keep-Alive Heartbeat (every 20s to prevent Render/iOS timeout)
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.readyState === 1) {
      try {
        ws.ping();
      } catch (e) {}
    }
  });
}, 20000);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`PastelDrop running at http://localhost:${PORT}`);
  console.log(`On local network: http://${getLocalIP()}:${PORT}`);
});
