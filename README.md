# 🏥 NexHealth - High-Performance Hospital Management System

NexHealth is a full-stack, enterprise-grade Hospital Management System (HMS) built entirely with **Next.js**. It is designed for maximum performance, offline reliability in LAN environments, and real-time medical data synchronization.

---

## ⚡ Engineering Highlights

- **Unified Architecture:** Built as a standalone Next.js application (Full-stack) to simplify deployment and reduce infrastructure overhead.
- **High Performance:** Optimized for low-latency interactions and efficient rendering of complex medical data.
- **Zero External Dependencies:** Designed to run fully on-premises or in isolated LAN environments without requiring external cloud services.
- **Advanced Real-time Synchronization:** Supports two protocols for live updates:
  - **Server-Sent Events (SSE):** Default for LAN environments to minimize configuration overhead and firewall issues.
  - **Socket.io:** Optional for bi-directional, low-latency communication.

---

## ✨ Key Modules

### 💊 Pharmacy & Inventory Management
- Real-time stock tracking and medicine expiration alerts.
- Integrated prescription fulfillment system connecting doctors directly to the pharmacy.

### 👤 Patient & Medical Records
- Digital Health Records (DHR) with instant retrieval.
- Comprehensive history of consultations, prescriptions, and lab results.

### 👨‍⚕️ Clinical Workflow
- **Doctor's Desk:** Real-time patient queue management.
- **Electronic Prescriptions:** Instant transmission of medical orders.

### 🔐 Access Control & Security
- **JWT Authentication:** Secure, stateless authentication.
- **Branch-based Security Models:**
  - `master` branch: Open access for rapid testing/development.
  - `roleAccess` branch: Implementation of strict **RBAC (Role-Based Access Control)** for production-ready security (Manager, Doctor, Medicine, Admision).

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** MUI
- **Database & ORM:** PostgreSQL + Drizzle
- **Real-time:** SSE (Server-Sent Events) & Socket.io
- **Auth:** JWT (JSON Web Tokens)
- **State Management:** SWR for server-state & Zustand for local-state.
- **Server actions**
---

## 🏗 Why SSE for LAN?
In hospital environments where the application often runs on a **Local Area Network (LAN)**, we prioritized **SSE** over WebSockets in the default configuration. 
- **Reasoning:** SSE is easier to route through corporate firewalls, requires no specialized proxy configuration (like Nginx `proxy_set_header`), and is inherently lighter for one-way server-to-client updates (like queue notifications).

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18.0.0+)
- PostgreSQL instance

### Installation

1. **Clone & Install:**
```bash
   git clone https://github.com/yourusername/nexhealth.git
   cd nexhealth
   npm install
   ```
2. **Required env:**
```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/dbName"
   JWT_SECRET="your_ultra_secure_secret"
   NEXT_PUBLIC_SUBSCRIBE_METHOD="sse" | "socketio"
   ```

# [published website](http://hospital.runflare.run/)

# [gitlab for full history](https://hamgit.ir/mohammadmehdidabestani/hospital)
