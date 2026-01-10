# ⚡ TaskLogger

**Master your workflow with precision.**

TaskLogger is a premium, full-stack task management application designed with a modern glassmorphism aesthetic. It is a high-performance Progressive Web App (PWA) that provides a seamless, app-like experience on both desktop and mobile devices.

![TaskLogger Logo](frontend/public/logo.svg)

## ✨ Key Features

-   **Premium UI/UX**: Stunning high-contrast dark mode with glassmorphism effects and smooth micro-animations.
-   **Full-Stack Auth**: Secure User Registration and Login using JWT and Bcrypt.
-   **Smart Task Management**: Create, edit, delete, and categorize tasks with ease.
-   **Real-time Stats**: Dynamic dashboard showing total, pending, and completed tasks at a glance.
-   **PWA Ready**: Installable on iOS, Android, and Desktop. Works smoothly with an app-like interface.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop screens.

## 🚀 Tech Stack

-   **Frontend**: React.js, Vite, Vanilla CSS (Modern Design System).
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB (via Mongoose).
-   **Authentication**: JSON Web Tokens (JWT).
-   **Icons**: Lucide React.
-   **PWA**: `vite-plugin-pwa`.

## 🛠️ Local Setup

### Prerequisites
-   Node.js (v16 or higher)
-   MongoDB (Local installation or MongoDB Atlas account)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Tasklogger
```

### 2. Install Dependencies
```bash
# Install everything from the root
npm run install-all
```

### 3. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tasklogger
JWT_SECRET=your_secret_key
```

### 4. Run Locally
```bash
# Start Backend (Port 5000)
cd backend && npm start

# Start Frontend (Port 3000)
cd frontend && npm run dev
```

## 🌐 Deployment (Render)

This project is configured for **Unified Deployment**.

1.  Connect your GitHub repo to **Render**.
2.  Select the `render-deployment` branch.
3.  Set **Build Command**: `npm run install-all && npm run build:frontend`
4.  Set **Start Command**: `npm start`
5.  Configure Environment Variables on Render:
    -   `NODE_ENV`: `production`
    -   `MONGODB_URI`: *Your Atlas connection string*
    -   `JWT_SECRET`: *Your secret*
    -   `PORT`: `5000`

## 📱 PWA Installation

Once hosted on HTTPS:
-   **iOS**: Tap 'Share' in Safari > 'Add to Home Screen'.
-   **Android**: Tap the menu (three dots) > 'Install App'.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
