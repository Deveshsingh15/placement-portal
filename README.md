# 🎓 PlacePro — Placement Preparation Portal

A full-stack **MERN** web application to help college students prepare for campus placements. Track DSA progress, practice interview questions, manage your resume, and monitor overall placement readiness — all in one place.

---

## 🚀 Features

### Student Side
- **JWT Authentication** — Secure signup, login, logout with bcrypt password hashing
- **Personalized Dashboard** — Placement readiness score, DSA stats, resume status
- **DSA Sheet Tracker** — Striver A2Z sheet with 75+ questions, topic-wise progress, mark Completed / Revision / Pending, filter by topic & difficulty
- **Interview Questions** — 25+ seeded questions across HR, Technical, DBMS, OS, CN, OOPs, Aptitude, Company-wise; save & mark practiced
- **Resume Manager** — PDF upload with drag-and-drop, resume scoring, AI-style improvement suggestions
- **Profile Settings** — Update college, branch, skills, target companies

### Admin Side
- **Admin Dashboard** — Platform-wide analytics: total students, question counts, DSA stats, resume coverage
- **Student Management** — View all students, search, view individual progress, delete accounts
- **Question Management** — Full CRUD for interview questions with category/difficulty filters

### UI/UX
- Dark-first professional design with custom CSS variables
- Syne + DM Sans fonts for a modern look
- Animated progress bars, shimmer loading states, smooth transitions
- Fully responsive layout with fixed sidebar

---

## 🗂️ Project Structure

```
placement-portal/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Main layout with sidebar
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   └── ProtectedRoute.jsx  # Auth route guards
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   ├── data/
│   │   │   └── dsaSheet.js         # Striver A2Z DSA questions data
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DSATracker.jsx
│   │   │   ├── InterviewQuestions.jsx
│   │   │   ├── Resume.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminStudents.jsx
│   │   │       └── AdminQuestions.jsx
│   │   ├── utils/
│   │   │   └── api.js              # Axios instance with interceptors
│   │   ├── App.jsx                 # Route definitions
│   │   ├── main.jsx
│   │   └── index.css              # Global styles + CSS variables
│   ├── vite.config.js
│   └── package.json
│
└── server/                     # Node.js + Express backend
    ├── config/
    │   └── db.js                   # MongoDB connection
    ├── controllers/
    │   ├── authController.js
    │   ├── dsaController.js
    │   ├── questionController.js
    │   ├── resumeController.js
    │   └── adminController.js
    ├── middleware/
    │   ├── auth.js                 # JWT protect + adminOnly
    │   └── upload.js               # Multer PDF config
    ├── models/
    │   ├── User.js
    │   ├── DSAProgress.js
    │   ├── InterviewQuestion.js
    │   └── UserQuestion.js
    ├── routes/
    │   ├── auth.js
    │   ├── dsa.js
    │   ├── questions.js
    │   ├── resume.js
    │   └── admin.js
    ├── uploads/resumes/            # Uploaded resume PDFs (gitignored)
    ├── utils/
    │   └── seed.js                 # Database seeder
    ├── index.js                    # Express entry point
    ├── .env.example
    └── package.json
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### 1. Clone and Install

```bash
# Clone the repo
git clone <your-repo-url>
cd placement-portal

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 2. Configure Environment Variables

For local backend development, copy the server sample env file into the server folder:

```bash
cd server
cp .env.example .env
```

For Docker Compose or production deployment, copy the root sample env file into the project root:

```bash
cp .env.example .env
```

Edit the env file and set production-ready values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/placement_portal
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
ADMIN_SECRET=my_admin_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

- `MONGO_URI` should point to your production MongoDB instance in deployment.
- `JWT_SECRET` must be a strong, unguessable secret.
- `ADMIN_SECRET` must be changed from the default value before using admin create/login.
- `CLIENT_URL` should match the frontend origin in production.
- For local development, `NODE_ENV=development` is fine; for production, set `NODE_ENV=production`.

> For **MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/placement_portal`

---

### 3. Seed the Database

```bash
cd server
node utils/seed.js
```

This inserts 25+ sample interview questions across all categories.

---

### 4. Create an Admin Account

Use this one-time API call (via curl or Postman):

```bash
curl -X POST http://localhost:5000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@placepro.com",
    "password": "admin123",
    "adminSecret": "my_admin_secret_key"
  }'
```

> The `adminSecret` must match `ADMIN_SECRET` in your `.env`

---

### 5. Run the Application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev    # uses nodemon for auto-reload
# OR
npm start
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login` | Student login |
| POST | `/api/auth/admin/login` | Admin login |
| GET | `/api/auth/me` | Get current user (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |

### DSA Tracker
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dsa/progress` | Get all progress entries |
| POST | `/api/dsa/progress` | Update question status |
| GET | `/api/dsa/stats` | Get summary stats |

### Interview Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | Get questions (with filters) |
| GET | `/api/questions/saved` | Get user's saved questions |
| POST | `/api/questions/:id/toggle` | Toggle saved/practiced |
| POST | `/api/questions` | Add question (admin only) |
| PUT | `/api/questions/:id` | Edit question (admin only) |
| DELETE | `/api/questions/:id` | Delete question (admin only) |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume` | Get resume info + suggestions |
| POST | `/api/resume/upload` | Upload PDF resume |
| DELETE | `/api/resume` | Delete resume |
| GET | `/api/resume/file/:filename` | Serve resume file |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/analytics` | Platform analytics |
| GET | `/api/admin/students` | List all students |
| GET | `/api/admin/students/:id/progress` | Student detail |
| DELETE | `/api/admin/students/:id` | Delete student |

---

## 🗄️ Database Collections

| Collection | Purpose |
|-----------|---------|
| `users` | Student & admin accounts, resume info, skills, target companies |
| `dsaprogresses` | Per-user per-question DSA status (pending/completed/revision) |
| `interviewquestions` | Question bank with category, difficulty, answer, tags |
| `userquestions` | Per-user saved/practiced status for interview questions |

---

## 🌐 Deployment

### Docker Compose (recommended for local/pre-production)
1. Create a root `.env` file from `.env.example` and set your production env values.
2. Install Docker Desktop.
3. Run from the project root:

```bash
docker compose up --build
```

This starts the `mongo` service and the app service together. The backend uses the built `client/dist` files, and the frontend is served from the Node server.

### Frontend (Vercel / Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder to Vercel or Netlify
```

Set environment: if deploying separate frontend, set `VITE_API_URL` to the backend URL in production and update `client/src/utils/api.js` if needed.

### Backend (Railway / Render / Heroku)
1. Push the repository to GitHub
2. Configure environment variables in your host dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `ADMIN_SECRET`
   - `CLIENT_URL`
   - `NODE_ENV=production`
3. Set start command: `node index.js`
4. Use MongoDB Atlas or another cloud MongoDB provider for production storage.

### Production environment checklist
- `MONGO_URI` points to your production database
- `JWT_SECRET` is a secure strong secret
- `ADMIN_SECRET` is changed from defaults
- `CLIENT_URL` is set to the deployed frontend origin
- `NODE_ENV=production`
- Do not commit `.env` or secrets into Git

---

## 🔑 Default Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@placepro.com | admin123 |
| Student | Register yourself at `/register` | — |

---

## 🧑‍💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router DOM v6, Axios |
| Styling | Tailwind CSS v4, Custom CSS Variables |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Auth | JWT (jsonwebtoken), bcryptjs |
| File Upload | Multer |
| Dev Tools | Nodemon, Morgan |

---

## 💡 How to Explain in Interviews

**Architecture:** "MERN stack with JWT-based authentication and protected routes on both frontend and backend. The frontend uses Context API for global auth state and Axios interceptors for automatic token injection."

**DSA Tracker:** "DSA progress is stored per-user per-question in MongoDB. The frontend loads all 75+ questions from a static JS file for speed, then fetches only progress entries from the API, merging them client-side."

**Resume Scoring:** "The scoring system uses file metadata — size, presence — to estimate a base score, then applies rule-based heuristics to generate actionable suggestions. Production could extend this with NLP parsing."

**Admin Panel:** "Uses the same JWT auth system but with a `role: 'admin'` check via `adminOnly` middleware. Analytics are computed with MongoDB aggregation pipelines."

---

## 📁 .gitignore Recommendation

```
node_modules/
.env
server/uploads/resumes/
client/dist/
```

---

*Built with ❤️ for placement season. Good luck! 🚀*
