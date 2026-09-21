# 🎂 L'Étoile Pâtisserie & Cake E-Commerce Platform

> Production-ready, full-stack artisanal bakery e-commerce platform built with **FastAPI**, **PostgreSQL**, **SQLAlchemy 2.x Async**, **Alembic**, **React 19**, **TypeScript**, **Tailwind CSS**, and **Docker**.

---

## 🌟 Key Features

### 🍰 Storefront & Bakery Experience
- **Artisanal Design System**: Bespoke warm cream, chocolate, and champagne gold palette with rich typography and micro-interactions.
- **Dynamic Cake Customization**: Real-time selection of flavours, custom weights (0.5 KG to 2.0+ KG), 100% eggless toggle, and custom piped message fields.
- **Bespoke Cake Studio**: Customer reference image upload for custom Pinterest/Instagram-inspired celebration cakes.
- **Same-Day Express Logistics**: Real-time delivery date and 3-hour time slot scheduler with bakery-specific preparation rules.
- **Shopping Bag & Persistence**: Cart drawer with server-side price protection, instant GST/delivery calculations, and wishlist.
- **Interactive Checkout Flow**: Multi-step checkout with address validation and Razorpay payment gateway integration.

### 🛡️ Architecture & Security
- **FastAPI Async Backend**: Clean layered architecture (`core`, `api`, `services`, `repositories`, `models`, `schemas`).
- **PostgreSQL & Alembic**: Normalized database schema with async connection pooling and migrations.
- **Standardized API Contract**: Predictable JSON response envelopes, detailed HTTP status codes, and global error handlers.
- **SEO & Performance Ready**: OpenGraph metadata, JSON-LD structured schema, Gzip compression, and sub-second asset bundling.

---

## 🏗️ Project Structure

```
Cake_bakery_project/
├── docker-compose.yml          # Local multi-service orchestration (Postgres, Redis, API, UI)
├── .env.example                # Root environment template
├── backend/
│   ├── Dockerfile              # Python 3.11 container configuration
│   ├── requirements.txt        # Production python dependencies
│   ├── alembic.ini             # Database migration configuration
│   ├── alembic/                # Async database migrations
│   ├── tests/                  # Pytest test suite (health, auth, orders)
│   └── app/
│       ├── main.py             # FastAPI entrypoint, CORS, and middleware
│       ├── core/               # App config, async database, security, and exception handlers
│       ├── api/                # API router and dependencies
│       ├── models/             # SQLAlchemy 2.0 async models
│       ├── schemas/            # Pydantic v2 validation models
│       ├── repositories/       # Data access and transactions
│       ├── services/           # Business logic
│       └── utils/              # Invoices, email templates, and helpers
└── frontend/
    ├── Dockerfile              # Multi-stage Vite + Nginx build
    ├── nginx.conf              # Production Nginx reverse proxy configuration
    ├── package.json
    ├── tailwind.config.js      # Bespoke bakery color tokens and typography
    └── src/
        ├── App.tsx             # Route management and query providers
        ├── index.css           # Base styles, scrollbars, and animations
        ├── types/              # TypeScript domain types
        ├── services/           # Centralized Axios API client
        ├── store/              # Zustand persistent stores (Cart, Wishlist)
        ├── components/         # Modular UI atoms and layout sections
        └── pages/              # Route pages (Home, Catalog, Detail, Custom, Checkout, Admin)
```

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env

# Run unit and API tests
pytest

# Start development server
uvicorn app.main:app --reload --port 8000
```
- API Root: `http://localhost:8000`
- Interactive API Docs (Swagger): `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/v1/health`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

### 3. Docker Compose (Full-Stack)
```bash
docker-compose up --build
```
This automatically boots PostgreSQL 16, Redis 7, the FastAPI backend, and the React frontend.
