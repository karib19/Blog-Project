# 📝 Blog Project

A modern full-stack Blog Application built with **Django REST Framework** and **React.js**. Users can register, verify their email via OTP, log in securely using JWT authentication, create and manage blog posts, upload featured images, browse posts by category and tags, and search articles through a clean, responsive interface.

---

# 🌐 Live Demo

### Frontend (Vercel)

**https://blog-project-mu-one.vercel.app/**

### Backend API (Render)

**https://blog-project-l5o3.onrender.com/**

### API Documentation (Swagger)

**https://blog-project-l5o3.onrender.com/api/docs/**

---

# 🚀 Project Overview

This project demonstrates a complete full-stack blog platform using Django REST Framework for the backend and React.js for the frontend. It includes secure authentication with email verification, REST APIs, responsive UI, PostgreSQL database integration, Cloudinary image storage, and production deployment.

---

# ✨ Features

## Authentication

* User Registration
* Email Verification (OTP via Brevo)
* Resend OTP
* Password Reset
* Secure Login (JWT Authentication)
* Logout
* Protected Routes
* User Profile
* User Avatar Upload

---

## Blog Features

* Create Blog Posts
* Edit Posts
* Delete Posts
* View All Posts
* Post Details
* Featured Image Upload
* Categories
* Tags
* Search Posts
* Filter by Category
* Filter by Tags
* Ordering
* Pagination
* Rich Text Editor
* Social Sharing
* Notifications
* Reading Time Estimation
* Related Posts

---

## UI Features

* Responsive Design
* Tailwind CSS
* React Router
* Loading Spinner
* Custom 404 Page
* Dashboard Layout
* Dark Mode

---

# 🛠 Tech Stack

## Frontend

* React.js
* Vite
* React Router
* Axios
* Tailwind CSS

## Backend

* Django
* Django REST Framework
* Simple JWT
* Django Filter
* DRF Spectacular (Swagger)

## Database

* PostgreSQL (Production)
* SQLite (Development)

## Media Storage

* Cloudinary

## Email Service

* Brevo (Transactional Email API — used for OTP-based email verification)

## Deployment

* Vercel (Frontend)
* Render (Backend)
* Render PostgreSQL Database

---

# 📂 Project Structure

```text
Blog Project Assignment/

├── blog_project/
│   ├── blog/
│   ├── blog_project/
│   ├── manage.py
│   ├── requirements.txt
│
├── blog_frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── screenshots/
│
└── README.md
```

---

# 📸 Screenshots


```text
screenshots/

Dashboard.png
Home.png
Login.png
Profile.png
Register.png
PostDetails.png
Swagger.png
```


```md
## Home

![Home](screenshots/Home.png)

## Dashboard

![Dashboard](screenshots/Dashboard.png)

## Post Details

![Post Details](screenshots/PostDetails.png)

## Swagger API

![Swagger](screenshots/Swagger.png)
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/karib19/Blog-Project.git
```

---

## Backend Setup

```bash
cd blog_project

python -m venv venv


venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

---

## Frontend Setup

```bash
cd blog_frontend

npm install

npm run dev
```

---

# 🔐 Environment Variables


Backend

SECRET_KEY

DEBUG

DATABASE_URL

CLOUDINARY_CLOUD_NAME

CLOUDINARY_API_KEY

CLOUDINARY_API_SECRET

BREVO_API_KEY

DEFAULT_FROM_EMAIL


---

# 🔑 Authentication

This project uses **JWT Authentication**.

Protected endpoints require an access token.

## Email Verification Flow

* On registration, the user account is created with `is_active=False` and a 6-digit OTP is generated.
* The OTP is sent to the user's email via **Brevo's Transactional Email API** (HTTPS-based, not SMTP).
* The user submits the OTP to `/api/verify-otp/` to activate their account.
* If the OTP expires or is lost, a new one can be requested via `/api/resend-otp/`.

---

# 📌 Main API Endpoints

| Method | Endpoint                    | Description             |
| ------ | ---------------------------- | ------------------------ |
| POST   | `/api/register/`             | Register User             |
| POST   | `/api/verify-otp/`           | Verify Email OTP          |
| POST   | `/api/resend-otp/`           | Resend Email OTP          |
| POST   | `/api/token/`                | Login                     |
| GET    | `/api/posts/`                | All Posts                 |
| GET    | `/api/posts/<slug>/`         | Post Details              |
| POST   | `/api/posts/create/`         | Create Post               |
| PUT    | `/api/posts/<slug>/update/`  | Update Post               |
| DELETE | `/api/posts/<slug>/delete/`  | Delete Post               |
| GET    | `/api/profile/`              | User Profile              |

---

# 🚀 Deployment

## Frontend

* Vercel

## Backend

* Render

## Database

* Render PostgreSQL

## Media Storage

* Cloudinary

## Email

* Brevo (used via REST API to avoid SMTP port restrictions on hosting providers like Render's free tier)

---

# 📚 Future Improvements


---

# 👨‍💻 Author

**Sharfuddin Karib**

GitHub:

https://github.com/karib19

---

# 📄 License

This project was built for learning purposes and to demonstrate full-stack web development using Django REST Framework and React.js.