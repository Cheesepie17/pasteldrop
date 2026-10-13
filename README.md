# ✈️ PastelDrop &bull; Minimalist P2P AirDrop

> **Local & Remote Cross-Device AirDrop for Windows, macOS, iPadOS, iOS, Android**  
> ส่งไฟล์และข้อความระหว่างคอม PC, MacBook และ iPad ได้แบบเรียลไทม์ ไร้รอยต่อ ไม่จำกัดค่าย ไม่ต้องใช้ Apple ID เดียวกัน

---

## ✨ จุดเด่น (Features)

- **ข้าม OS 100%:** ส่งหากันได้ระหว่าง Windows PC, MacBook, iPad, iPhone, Android
- **ต่าง Apple ID / ต่างอีเมลก็ใช้ได้:** ไม่ต้องล็อกอิน ไม่ต้องผูกบัญชีใดๆ
- **ใช้ได้ทั้งในบ้านและนอกบ้าน:**
  - **ในบ้าน (Local LAN/Wi-Fi):** ความเร็วระดับกิกะบิตเต็มสปีดเราเตอร์
  - **นอกบ้าน (Remote Internet):** ใช้รหัสห้อง 6 หลัก หรือสแกน QR Code เพื่อจับคู่แบบ End-to-End Encrypted (WebRTC P2P) ส่งหากันได้แม้ต่อคนละเน็ต หรือใช้ 4G/5G
- **ไม่จำกัดขนาดไฟล์:** ส่งไฟล์ขนาดใหญ่ วิดีโอ 4K รูปภาพต้นฉบับ ไม่ลดความละเอียด
- **Shared Clipboard:** แชร์ข้อความ ลิงก์ รหัส โน้ต พร้อมปุ่มกดคัดลอก 1-คลิก
- **ดีไซน์มินิมอลพาสเทล (Aesthetic Pastel UI):** โทนสีสะอาดตา สบายตา ใช้งานง่าย

---

## 🚀 วิธีติดตั้งและเปิดใช้งาน (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันโปรแกรม
```bash
npm start
```
- เปิดเบราว์เซอร์เข้าที่: `http://localhost:4000`
- อุปกรณ์ในวงเน็ตเดียวกันเข้าผ่าน IP เครื่อง เช่น: `http://192.168.1.33:4000`

---

## 🌐 การนำขึ้น GitHub & Deploy ออนไลน์ (Free Hosting)
โปรเจกต์นี้เขียนด้วย Node.js + Express + WebSockets สามารถนำโค้ดขึ้น **GitHub** แล้วกดเชื่อมต่อ Deploy ฟรีได้ง่ายๆ บน:
- [Render.com](https://render.com) (เลือก Web Service &rarr; Node)
- [Railway.app](https://railway.app)
- [Vercel / Fly.io]

เมื่อ Deploy ขึ้น Cloud แล้ว จะได้ลิงก์โดเมนส่วนตัว เช่น `https://your-pasteldrop.onrender.com` เพื่อเปิดส่งไฟล์จากทุกที่ทั่วโลกได้ตลอด 24 ชั่วโมง!
