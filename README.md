# 🏋️ Fitness Tracker App

A full-stack fitness tracker application that allows users to log workouts, track fitness progress, and manage data securely.

![Fitness Tracker](https://img.shields.io/badge/Status-Live-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)

## 🌐 Live Demo

- **Frontend**: [https://fitness-tracker-app.vercel.app](https://fitness-tracker-app.vercel.app)
- **Backend API**: [https://fitness-tracker-api.onrender.com](https://fitness-tracker-api.onrender.com)

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT
- 🏋️ **Workout Logging** - Add, edit, delete workouts with detailed exercise info
- 📊 **Dashboard** - Visual analytics with interactive charts
- 📈 **Progress Tracking** - Track calories, duration, and workout streaks
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Dark theme with glassmorphism and smooth animations

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- React Router DOM
- Chart.js / React-Chartjs-2
- Axios
- React Icons

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## 📁 Project Structure

```
fitness-tracker/
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service
│   │   ├── App.jsx
│   │   └── index.css        # Design system
│   └── package.json
│
├── backend/                 # Node.js + Express backend
│   ├── middleware/          # Auth middleware
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── server.js
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fitness-tracker.git
cd fitness-tracker
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb+srv://...
# JWT_SECRET=your_secret_key

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (optional for local dev)
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:5000`.

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | Get all workouts |
| GET | `/api/workouts/:id` | Get single workout |
| POST | `/api/workouts` | Create workout |
| PUT | `/api/workouts/:id` | Update workout |
| DELETE | `/api/workouts/:id` | Delete workout |
| GET | `/api/workouts/stats` | Get statistics |

## 🎨 Screenshots

### Dashboard
- View total workouts, calories burned, and workout streak
- Interactive weekly activity chart
- Workout distribution by type

### Workout Management
- Add/Edit workouts with exercise details
- Filter by workout type
- Track sets, reps, weight for strength training

## 📝 License

MIT License - feel free to use this project for learning!

## 👨‍💻 Author

Built with ❤️ for Coding Ninjas 10x Task
