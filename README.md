# 📚 Book Management System
## คู่มือการติดตั้งด่วน (ภาษาไทย)

<img width="1674" height="823" alt="image" src="https://github.com/user-attachments/assets/c0a2252a-8688-4aef-9394-7947750cada1" />
<img width="1679" height="963" alt="image" src="https://github.com/user-attachments/assets/ea6d1e58-d268-43f6-be16-f5dac500c1d2" />

ขั้นตอนที่ 1 — Backend

- ไปที่โฟลเดอร์ `backend` และติดตั้งแพ็กเกจ:

```bash
cd backend
npm install
```

- สร้าง migration แรกของฐานข้อมูล (รันคำสั่งนี้เพื่อสร้างไฟล์ migration และปรับฐานข้อมูลในการพัฒนา):

```bash
npx prisma migrate dev --name init
```

ขั้นตอนที่ 2 — Frontend

- ไปที่โฟลเดอร์ `frontend` และติดตั้งแพ็กเกจ:

```bash
cd frontend
npm install
```

ขั้นตอนที่ 3 — รันด้วย Docker Compose (จากโฟลเดอร์โปรเจกต์หลัก)

```bash
docker compose up -d --build
```

ผลลัพธ์ (URLs):

- Frontend: http://localhost:3003/
- Backend API (books): http://localhost:4001/books

ข้อมูลฐานข้อมูล (สำหรับการเชื่อมต่อ / JDBC):

- URL: `jdbc:postgresql://localhost:5435/book-management`
- User: `postgres`
- Password: `1234`
