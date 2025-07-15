---

# 📄 Tell.jp — Backend API

This is the backend for Tell.jp — an NGO web application where users can register/login, view counselors, book appointments, and donate.

---

## 🚀 Setup

```bash
git clone <repo-url>
cd backend
npm install
```

Create a `.env` file in the root with:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/telljp
SESSION_SECRET=your_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Run:

```bash
npm start
```

---

# 📝 API Endpoints

## Auth

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| `POST` | `/auth/register`        | Register a new user         |
| `POST` | `/auth/login`           | Login with email & password |
| `GET`  | `/auth/logout`          | Logout                      |
| `GET`  | `/auth/google`          | Login with Google           |
| `GET`  | `/auth/google/callback` | Google OAuth callback       |

---

## Counselors

| Method   | Endpoint                      | Description                                            |
| -------- | ----------------------------- | ------------------------------------------------------ |
| `POST`   | `/counselors/add`             | Add a counselor (admin only)                           |
| `PUT`    | `/counselors/:id`             | Update a counselor (admin only)                        |
| `DELETE` | `/counselors/:id`             | Delete a counselor (admin only)                        |
| `GET`    | `/counselors/`                | Get all counselors (authenticated users)               |
| `GET`    | `/counselors/my-appointments` | Counselor sees their own appointments (counselor only) |

---

## Appointments

| Method | Endpoint             | Description                                          |
| ------ | -------------------- | ---------------------------------------------------- |
| `POST` | `/appointments/book` | Book an appointment — sends email + PDF confirmation |
| `GET`  | `/appointments/my`   | Get my booked appointments                           |

---

## Donations

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| `POST` | `/donate`        | Create a Razorpay order |
| `POST` | `/donate/verify` | Verify Razorpay payment |

---

# 📂 Notes

✅ Make sure you have `invoices/` folder in root for saving PDFs.
✅ Emails use Gmail SMTP; if using 2FA, generate an App Password.
✅ Uses `express-session` & `passport` for authentication.
✅ Cookies (`connect.sid`) are used for maintaining session in Postman/Browser.

---

# 📄 Example `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/telljp
SESSION_SECRET=supersecret
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=yourapppassword
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
```

---

# 📌 Technologies

* Node.js + Express
* MongoDB + Mongoose
* Passport (local & Google OAuth)
* Nodemailer + PDFKit
* Razorpay

---

