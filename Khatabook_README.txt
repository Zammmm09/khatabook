# 📒 Khatabook – Secure Personal Ledger App

A full-stack note-taking and expense tracking app where users can create, protect, and manage their personal “hisaabs” (notes), with optional password protection and account-based authentication.

---

## 🧠 Features

- ✅ User Registration & Login (Session-based auth)
- 📝 Create, view, update, and delete personal notes
- 🔐 Password protection for sensitive notes
- 🚫 Prevent editing or sharing protected notes without removing the password
- 📤 Share notes via public links (only if not protected)
- 📦 MongoDB Atlas database

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB + Mongoose  
- **Frontend**: EJS templating, Tailwind CSS  
- **Auth**: express-session, bcrypt, connect-mongo

---

## 🚀 How to Run Locally

1. **Clone the repository**

```bash
git clone https://github.com/Zammmm09/khatabook.git
cd khatabook
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file**

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
```

4. **Run the app**

```bash
node app.js
# or if you have nodemon:
nodemon app.js
```

---

## 🙌 Author

**Zaeem Mohammed Salim Ansari**  
📧 zaeemansari6666@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/zaeem-ansari-655a1b28b)

---