# SMIX 💞

**SMIX** is a dating platform built for the Sourashtra community — connecting people through shared culture, traditions, and values.

---

## 🗂️ Project Structure

```
smix/
├── backend/          # FastAPI + Python backend
├── frontend/         # React + Vite + TypeScript frontend
└── docker-compose.yml  # MongoDB via Docker
```

---

## ⚙️ Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend    | FastAPI, Python, Motor (async MongoDB)      |
| Database   | MongoDB (via Docker Compose)                |
| Auth       | JWT (JSON Web Tokens)                       |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.10+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for MongoDB)

---

## 🗄️ Step 1 — Start the Database

MongoDB runs inside Docker. From the **root** of the project:

```bash
docker compose up -d
```

This starts a MongoDB instance at `mongodb://localhost:27017/` with:
- **Username:** `admin`
- **Password:** `password`
- **Database:** `smix_db`

To stop it later:

```bash
docker compose down
```

---

## 🐍 Step 2 — Run the Backend

Navigate to the `backend/` directory:

```bash
cd backend
```

### Create & activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate      # macOS / Linux
# or
venv\Scripts\activate         # Windows
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Configure environment (optional)

By default, the backend connects to `mongodb://localhost:27017/`. To use a custom MongoDB URI, set the environment variable:

```bash
export SMIX_MONGO_URI="mongodb://admin:password@localhost:27017/"
```

### Start the backend server

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at:
- **Base URL:** `http://localhost:8000`
- **Interactive Docs (Swagger):** `http://localhost:8000/docs`
- **Health Check:** `http://localhost:8000/health`

---

## 🌐 Step 3 — Run the Frontend

Open a **new terminal** and navigate to the `frontend/` directory:

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The frontend will be available at: **`http://localhost:5173`**

---

## 🌱 Seed the Database (Optional)

To populate the database with sample user profiles for development:

```bash
cd backend
source venv/bin/activate
python seed_db.py
```

To wipe all data and start fresh:

```bash
python cleanup_db.py
```

---

## 📁 Environment Variables

| Variable        | Default                          | Description               |
|-----------------|----------------------------------|---------------------------|
| `SMIX_MONGO_URI`| `mongodb://localhost:27017/`     | MongoDB connection string |

---

## 📜 Available Scripts

### Frontend (`frontend/`)

| Command           | Description                        |
|-------------------|------------------------------------|
| `npm run dev`     | Start Vite dev server              |
| `npm run build`   | Build for production               |
| `npm run preview` | Preview production build locally   |
| `npm run lint`    | Run ESLint                         |

### Backend (`backend/`)

| Command                              | Description                   |
|--------------------------------------|-------------------------------|
| `uvicorn main:app --reload`          | Start dev server with hot reload |
| `python seed_db.py`                  | Seed the database             |
| `python cleanup_db.py`               | Clear all database records    |

---

## 🔑 API Overview

| Method | Endpoint               | Description                  |
|--------|------------------------|------------------------------|
| POST   | `/auth/register`       | Register a new user          |
| POST   | `/auth/login`          | Login and get JWT token      |
| GET    | `/users/me`            | Get current user profile     |
| PUT    | `/users/me/profile`    | Update user profile          |
| GET    | `/users/discover`      | Get profiles to swipe        |
| POST   | `/users/like/{id}`     | Like a user                  |
| POST   | `/users/pass/{id}`     | Pass on a user               |
| GET    | `/users/matches`       | Get all matches              |

Full interactive API documentation is available at `http://localhost:8000/docs` when the backend is running.

---

## 🐛 Troubleshooting

**MongoDB connection error**
> Make sure Docker is running and you've started the database with `docker compose up -d`.

**Port already in use**
> Change the backend port: `uvicorn main:app --reload --port 8001`
> Change the frontend port in `vite.config.ts` or use: `npm run dev -- --port 3000`

**`ModuleNotFoundError` in Python**
> Make sure your virtual environment is activated: `source venv/bin/activate`

---

## 📄 License

MIT License — feel free to use and modify.
