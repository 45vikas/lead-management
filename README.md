# 🚀 Lead Management System (MERN Stack)

A full-stack **Lead Management System** built using the MERN stack (MongoDB, Express.js, React.js, Node.js).
This application allows admins to manage agents, upload leads, and distribute them efficiently.

---

## 📌 Features

### 🔐 Authentication

* Admin & Agent Registration
* Login with JWT Authentication
* Role-based access control (Admin / Agent)

### 👨‍💼 Admin Features

* Add / Delete Agents
* Upload CSV/XLSX files (Bulk Leads)
* Automatic lead distribution among agents
* View all leads

### 📞 Lead Management

* Edit Lead details
* Update Lead Status (New, Contacted, Converted)
* Delete Leads
* Search & Pagination

### 🖼️ Image Upload

* Upload images using Multer
* Preview before upload
* Stored on server

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Other Tools

* JWT Authentication
* Multer (File Upload)
* CSV & XLSX Parser

---

## 📂 Folder Structure

```
project-root/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── src/
│   └── App.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/lead-management-system.git
cd lead-management-system
```

---

### 2️⃣ Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```
npm start
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm start
```

---

## 🌐 API Endpoints

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Agents

* GET `/api/agents`
* POST `/api/agents`
* DELETE `/api/agents/:id`

### Leads

* PUT `/api/leads/:listId/:itemId`
* DELETE `/api/leads/:listId/:itemId`

### Upload

* POST `/api/upload` (CSV/XLSX)
* GET `/api/upload`

### Images

* POST `/api/images`
* GET `/uploads/images/:filename`

---

## 📸 Screenshots

* Login Page
* Dashboard
* Lead Table
* Image Upload UI

*(Add screenshots here)*

---

## 🚀 Future Improvements

* Role-based dashboards (Admin vs Agent)
* Real-time updates (Socket.IO)
* Cloud storage (AWS S3 / Cloudinary)
* Advanced analytics dashboard

---

## 🧠 Learning Outcomes

* Built a complete MERN stack application
* Implemented JWT authentication & role-based authorization
* Worked with file uploads (CSV, Excel, Images)
* Designed scalable backend APIs

---

## 👨‍💻 Author

**Vikas Yadav**

* MERN Stack Developer
* Passionate about building scalable web applications

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share it!

---
