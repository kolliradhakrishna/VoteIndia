# 🗳️ VoteIndia — Voter Registration Portal

A **React + Vite** frontend-only voter registration web app. All data is stored in the browser's **localStorage** — no backend or database required.

---

## ✨ Features

- **Age Verification**: Custom calendar picker with real-time age calculation
- **Eligibility Check**: Auto-routes to form (≥18) or not-eligible screen (<18)
- **Multi-step Registration**: 4-step form with per-step validation
- **Photo Upload**: Passport photo stored as base64 in localStorage
- **Voter ID Card**: Auto-generated unique voter ID, printable card
- **Admin Dashboard**: Search, filter, approve/reject/delete registrations
- **Dark Glassmorphism**: Premium patriotic design with tricolor accents
- **Fully Responsive**: Works on all screen sizes

---

## 🚀 Local Development

### Prerequisites
- Node.js v18+
- npm

### Setup & Run

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173

---

## 🌐 Deploy to Vercel (Free)

### Option 1 — Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to client folder
cd client

# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel

# For production deployment
vercel --prod
```

### Option 2 — Vercel Dashboard (No CLI)

1. Go to https://vercel.com and sign up / log in
2. Click **"Add New Project"**
3. Import your GitHub repository (push to GitHub first)
4. Set the **Root Directory** to `client`
5. Framework will be auto-detected as **Vite**
6. Click **Deploy** — done!

### Option 3 — Deploy from GitHub

```bash
# From the project root, push to GitHub first:
git add .
git commit -m "ready for deployment"
git push origin main
```

Then connect the repo on Vercel dashboard and set root directory to `client`.

---

## 🏗️ Project Structure

```
voter-form/
├── client/                     ← React + Vite frontend (deploy this)
│   ├── vercel.json             ← Vercel SPA routing config
│   ├── index.html
│   └── src/
│       ├── pages/
│       │   ├── AgeVerification.jsx   ← Step 1: DOB picker
│       │   ├── RegistrationForm.jsx  ← Multi-step form (4 steps)
│       │   ├── NotEligible.jsx       ← Age < 18 screen
│       │   ├── Success.jsx           ← Voter ID card
│       │   └── AdminDashboard.jsx    ← Admin panel
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── CalendarPicker.jsx
│       │   ├── StepIndicator.jsx
│       │   └── Confetti.jsx
│       └── store/
│           └── voterStore.js         ← localStorage data layer
└── server/                     ← (Not used — backend for future use)
```

---

## 🎨 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 8, React Router v7 |
| Styling | Vanilla CSS, Google Fonts (Outfit + Inter) |
| Storage | Browser localStorage |
| Deployment | Vercel |

---

## 🗺️ App Routes

| Route | Page |
|-------|------|
| `/` | Age Verification |
| `/register` | Multi-step Registration Form |
| `/not-eligible` | Under 18 info page |
| `/success` | Voter ID card |
| `/admin` | Admin Dashboard |

---

## 📋 Notes

- **Data is browser-local**: Each user's data is stored in their own browser. Admin dashboard shows registrations from the same browser session.
- **No backend required**: The `server/` folder is kept for future use if you want to add a database later.
- **Photo upload**: Photos are stored as base64 strings in localStorage (up to 5MB per photo).
