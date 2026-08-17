# ShopSphere — Social-Commerce Marketplace

> Discover products through short-form video Reels. Shop instantly in-stream.

## 📌 Product Vision

ShopSphere is a next-generation social-commerce marketplace combining large-scale e-commerce with Instagram/TikTok-style video discovery, creator economy monetization, in-stream product drawers, and personalized AI shopping assistance.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide React, TanStack Query, Zustand, React Hook Form, Zod
- **Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, dotenv, cors, helmet, morgan, zod
- **Development:** ESLint, Prettier, Concurrently, Git

---

## 🏗️ Architecture Overview

ShopSphere uses a clean, modular monolith architecture designed to scale seamlessly:

```
shopsphere/
├── client/           # Frontend React + TypeScript + Vite application
├── server/           # Backend Express + TypeScript + Mongoose API server
├── shared/           # Shared TypeScript types, constants & validation schemas
└── docs/             # Architecture, API & Database documentation
```

---

## ⚡ Quick Start & Development

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/rithesh2130-raja/palamner_palace.git
cd shopsphere
npm run setup
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Run Application Concurrently

Start both frontend (`http://localhost:5173`) and backend (`http://localhost:5000`) with a single command:

```bash
npm run dev
```

---

## 📊 Current Status — Day 1 Foundation Complete

- ✅ Client & Server TypeScript environment initialized
- ✅ MongoDB Mongoose database connection configured
- ✅ Express application initialized with Helmet, CORS, Morgan, & Error middleware
- ✅ Health check endpoint operational: `GET /api/v1/health`
- ✅ React Customer & Admin layout shells & Router configured
- ✅ Frontend → Backend health indicator connection verified

---

## 🗓️ 20-Day Development Roadmap

- **Day 1:** Project Foundation, Architecture & Environment
- **Day 2:** Authentication & User Management
- **Day 3:** Design System & Component Library
- **Day 4:** Product Catalog & Inventory System
- **Day 5:** Social Commerce Home Engine
- **Day 6:** Search & Filter Infrastructure
- **Day 7:** Product Details & 3D/Action Media
- **Day 8:** Cart & Persistence Engine
- **Day 9:** Checkout & Address Engine
- **Day 10:** Order Processing & Fulfillment
- **Day 11:** Short-Form Video Reels Infrastructure
- **Day 12:** Scroll-Snap Reel Feed Engine
- **Day 13:** In-Stream Product Tagging & Drawers
- **Day 14:** Social Interactions & Comments
- **Day 15:** Creator Economy & Studio Portal
- **Day 16:** Affiliate Commission & Attribution Engine
- **Day 17:** Advanced Admin Dashboard & Moderation
- **Day 18:** Personalization & Recommendation Engine
- **Day 19:** Automated Testing & Quality Assurance
- **Day 20:** Production Build & Deployment Pipeline
