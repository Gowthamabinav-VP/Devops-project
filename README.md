# Document Verification & Approval System

A full-stack web application designed for processing student document requests with approval workflows using the MERN stack (MongoDB, Express, React, Node.js). 

## Features
- **Student Portal**: Register, authenticate, submit document requests, and upload files.
- **Admin Dashboard**: Review pending requests, add remarks, and approve or reject submissions.
- **Role-Based Access Control**: Secure routes based on user roles (`student`, `admin`) using JWT authentication.
- **CI/CD Integration**: Jenkins pipeline ready for continuous integration and delivery.
- **Clean API**: RESTful architecture.

## Tech Stack
- **Frontend**: React.js, React Router, Vite, Tailwind CSS, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Multer (File uploads), JWT (Auth), bcryptjs (Password Hashing).
- **DevOps**: Jenkins (`Jenkinsfile` provided).

## Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a MongoDB Atlas connection URI
- Jenkins (for CI/CD)

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (or modify the existing one):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/document-approval
JWT_SECRET=supersecretjwtkey_change_in_production
```

Start the backend development server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

## Running the Application
1. Ensure the Node backend is running on `http://localhost:5000`.
2. Ensure the Vite React app is running (usually on `http://localhost:5173`).
3. Open your browser and navigate to the frontend URL.
4. **Student**: Register a new account, login, and submit a document request (e.g., Bonafide Certificate).
5. **Admin**: You can register an admin by selecting the "Admin" role during registration, then login and review the submitted request.

## Jenkins CI/CD
A `Jenkinsfile` is provided at the root of the project. It defines a declarative pipeline to:
1. Clone the repository.
2. Install dependencies for backend and frontend.
3. Build the frontend React app.
4. Deploy the application (with placeholder for PM2 or similar deployment). Ensure `MONGO_URI` and `JWT_SECRET` are stored in Jenkins credentials.
