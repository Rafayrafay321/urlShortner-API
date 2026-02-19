# 🔗 Lynx API  
### Developer-First Link Infrastructure

Lynx API is a high-performance, fully containerized backend service engineered for secure link management and developer integration.

Moving beyond a simple URL shortener, this project serves as a **production-ready blueprint for multi-tenant API infrastructure**, featuring robust authentication lifecycles, secret management, and scalable architecture design.

---

## 🚀 Engineering Highlights

### 🐳 Containerized Orchestration
Fully decoupled architecture using **Docker** & **Docker Compose**, ensuring a true **"one-command" infrastructure boot** for both:

- Node.js runtime  
- PostgreSQL persistence layer  

Zero local dependency conflicts. Fully reproducible environments.

---

### 🔐 Identity & Access Management (IAM)

Secure authentication flow built with:

- JWT-based access tokens  
- Refresh token rotation  
- Password reset & recovery workflow  
- Secure token invalidation logic  

Designed with real-world production patterns in mind.

---

### 🔑 Developer API Key System

Users can:

- Generate API keys  
- Securely hash & store secrets  
- Revoke compromised keys  
- Access protected endpoints programmatically  

This mimics real SaaS API infrastructure patterns (Stripe-style API keys).

---

### 🧩 Type-Safe Database Layer

Built with **Prisma ORM**:

- Type-safe queries
- Automatic schema migrations
- Strong TypeScript integration
- Reduced runtime errors
- Improved developer velocity

---

## 🛠 Tech Stack

| Layer        | Technology |
|-------------|------------|
| Language     | TypeScript (Strict Mode) |
| Runtime      | Node.js + Express.js |
| Database     | PostgreSQL |
| ORM          | Prisma |
| DevOps       | Docker, Docker Compose |
| Security     | Bcrypt, JWT, API-Key Hashing |

---

## 🏗 Architecture Overview


- Stateless RESTful API
- Token-based authentication
- Multi-tenant ready
- Environment-based configuration
- Container-first deployment strategy

---

## 🚦 Quick Start (1-Command Setup)

### ✅ Prerequisites

- Docker
- Docker Compose

---

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/lynx-api.git
cd lynx-api

docker-compose up --build

```

## 🎉 That's It!

Once the infrastructure is running:

- 🚀 **API will be live at:** `http://localhost:3000`
- 🐘 **PostgreSQL container** auto-starts
- 🧩 **Prisma migrations** run automatically
- 📘 **Swagger docs** available while the server is running

---

## 📖 API Documentation

Interactive API documentation powered by **Swagger / OpenAPI**:

http://localhost:3000/api-docs


> Available only when the server is running.

---

## 🔌 Core Endpoints

### 🧾 Authentication

POST /auth/register  
POST /auth/login  
POST /auth/refresh  
POST /auth/forgot-password  
POST /auth/reset-password  


---

### 🔑 API Keys

POST /keys/generate (Requires Auth)  
GET /keys (Requires Auth)  
DELETE /keys/:id (Requires Auth)  


---

### 🔗 Link Management

POST /shorten (Requires API Key)  
GET /:alias (Public Redirect)  



