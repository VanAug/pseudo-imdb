# 🎬 PseudoIMDb

PseudoIMDb is a full-stack web application that allows users to browse, rate, and review movies. It mimics the core functionality of IMDb, with a React frontend and Flask backend.

## 📁 Project Structure

pseudoimdb/
├── client/ # React frontend
├── server/ # Flask backend
└── README.md # Project overview


## 🚀 Live Demo

- Frontend: [https://pseudoimdb.vercel.app](https://pseudoimdb.vercel.app)  
- Backend: Render-hosted Flask API

---

## 🧑‍💻 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Python Flask, SQLAlchemy, PostgreSQL, JWT
- **Hosting**: Vercel (frontend) + Render (backend)

---

## 📦 Getting Started

### Clone the repository:

git clone https://github.com/VanAug/fullstack-backend
cd fullstack-backend

## Setup backend:

cd server
pipenv install
pipenv shell
flask db upgrade
flask run

## Setup frontend:

cd ../client
npm install
npm run dev