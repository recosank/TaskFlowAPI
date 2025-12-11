# Full-Stack Assignment — Node.js, PostgreSQL, Prisma, React, TypeScript

I built this full-stack assignment using **Node.js, Express, PostgreSQL, Prisma ORM**, and a **React + TypeScript frontend**. The project features **secure JWT authentication**, **HTTP-only refresh tokens**, **automatic access-token renewal**, **TanStack React Query for real-time UI**, **Zod validation**, **Error Boundaries** with Fallback UI, and a clean reusable architecture using **custom hooks**, **protected routes**, and **Axios interceptors**. It also includes an optimized debounced search functionality, reducing unnecessary API calls and providing a smooth search experience. TailwindCSS and Radix UI ensure a modern interface, while Prisma provides an efficient, type-safe database layer.

---

# 🛠️ Tech Stack

### **Frontend**

- React 19 + TypeScript
- Vite
- TanStack React Query
- React Router DOM
- React Hook Form + Zod
- Axios (with token-refresh interceptors)
- TailwindCSS
- Error Boundaries + Fallback UI
- Radix UI
- Lucide Icons
- react-loading-skeleton
- Framer Motion

### **Backend**

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT (Access + Refresh Tokens)
- bcrypt
- cookie-parser
- express-async-errors
- Zod validation

---

# 🔐 Authentication Flow

- User logs in → server sets **secure HTTP-only refresh token** + returns access token
- Access token is stored **in memory only** (safe)
- On page refresh → `/auth/refresh` automatically issues a new access token
- Axios interceptors retry failed (401) requests
- Protected backend routes require a valid JWT
- Protected frontend pages use custom hooks (`useAuth`, `useProtectedRoute`)

---

# Main UI Screens

## 🗂️ Project View Page

- React Query caching
- Placeholder data to avoid white screen
- Skeleton loaders
- Error Boundary fallback
- Smooth transitions

**Screenshot:**

<img width="1455" height="834" alt="Screenshot 2025-12-11 at 5 57 44 AM" src="https://github.com/user-attachments/assets/16b26d3e-30e8-4296-b3e8-f5b88b903454" />

<img width="1456" height="835" alt="Screenshot 2025-12-11 at 5 58 39 AM" src="https://github.com/user-attachments/assets/45a785a1-188d-43ba-b38e-0ba2e88efbd6" />

---

## 📊 Dashboard

✔ User-specific data
✔ Protected route
✔ Real-time updates via React Query
✔ Animations via Framer Motion

**Screenshot:**

<img width="1470" height="835" alt="Screenshot 2025-12-11 at 6 00 16 AM" src="https://github.com/user-attachments/assets/6d80210d-a268-4775-a911-3b0d8c7c6c83" />

---

# ▶️ How to Run the Project

## 🎨 Backend

### 1. Install Dependencies

```bash
npm install
```

### 2. Create `.env`

```
# PostgreSQL connection
DATABASE_URL="postgresql://admin3:password@localhost:5432/getwork_db?schema=public"

# JWT Secrets
ACCESS_TOKEN_SECRET="aslkdfkjlkj28374982739r879sd8f7nas9df8n7as9df7as9df79asdnf7s"
REFRESH_TOKEN_SECRET="ajskdhfl94379827uhajhkhkhaksdfKJHKHUHUguhfsakdhf"

# Token Expiry
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN_DAYS="7"

# App Config
PORT=4000
NODE_ENV=development

# CORS
FRONT_END_URL="https://task-flow-lyart-mu.vercel.app"

```

🧩 Understanding DATABASE_URL

Format:

postgresql://<DB_USER>:<DB_PASSWORD>@<HOST>:<PORT>/<DB_NAME>?schema=<SCHEMA>

Your example:

postgresql://admin3:password@localhost:5432/getwork_db?schema=public

# 🛠 Prisma Commands

Generate Prisma Client

```bash
npm run prisma:generate
```

Run migrations

```bash
npm run prisma:migrate
```

Push schema without migration (dev only)

```bash
npx prisma db push
```

### 3. Start Dev Server

```bash
npm run dev
```
