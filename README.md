# 🏥 ClinicFlow

### Modern clinic management system for everyday healthcare workflows

ClinicFlow is a full-stack clinic management system designed for small and medium-sized clinics.

The project focuses on practical workflows for **administrators, doctors and reception staff** — from patient registration and doctor management to appointments, scheduling and patient communication.

> 🚧 **ClinicFlow is currently under active development.**

---

## ✨ What is ClinicFlow?

ClinicFlow aims to bring the main daily clinic operations into one simple workspace.

### 👥 For clinic staff

- 👨‍⚕️ Manage doctors
- 👩‍💼 Manage employees and roles
- 🧑‍🤝‍🧑 Manage patients
- 📅 Create and manage appointments
- 🗓️ Organize doctor schedules
- 📝 Keep patient visit history
- 🔐 Control access based on user roles
- 💬 Communicate appointment information to patients
- 📊 View operational reports

The system is being developed incrementally, with each feature tested before moving to the next part of the product.

---

# 🚀 Current Features

## 🧑‍🤝‍🧑 Patients

- ✅ Patient list
- ✅ Patient search
- ✅ Create patient
- ✅ Patient details
- ✅ Visit history
- ✅ Add visit records

---

## 👨‍⚕️ Doctors

- ✅ Doctors list
- ✅ Doctor details
- ✅ Doctor profile linked to a system user
- ✅ Clinic-level scope
- ✅ `DOCTOR` system role

---

## 🔌 Backend API

Current API endpoints:

```text
GET    /api/patients
GET    /api/patients?search=...
POST   /api/patients

GET    /api/patients/{patientId}
GET    /api/patients/{patientId}/visits
POST   /api/patients/{patientId}/visits

GET    /api/doctors
GET    /api/doctors/{doctorId}

🛠️ Technology Stack
🎨 Frontend








React
TypeScript
Vite
React Router
pnpm
⚙️ Backend






Java 21
Spring Boot
Spring Data JPA
Flyway
Maven
🗄️ Database & Infrastructure




PostgreSQL 17
Docker
Docker Compose
🔧 Development




Git
GitHub
VS Code
Automated backend tests
Real PostgreSQL integration testing
🧩 Architecture

ClinicFlow is currently being developed as a modular monolith.

The goal is to keep the architecture simple while the product and real-world workflows are still being validated.

┌─────────────────────────────┐
│          Frontend           │
│       React + TypeScript    │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│           Backend           │
│       Spring Boot / Java    │
└──────────────┬──────────────┘
               │
               │ JPA / Flyway
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
│             17              │
└─────────────────────────────┘
🗂️ Project Structure
clinicflow/
│
├── 📁 backend/
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   └── 📁 test/
│   ├── 📄 pom.xml
│   ├── 📄 mvnw
│   ├── 📄 mvnw.cmd
│   └── 📄 docker-compose.yml
│
├── 📁 src/
│   ├── 📁 app/
│   ├── 📁 components/
│   └── ...
│
├── 📄 package.json
├── 📄 pnpm-lock.yaml
└── 📄 README.md
💻 Local Development
📋 Requirements

Make sure you have:

🟢 Node.js
🟠 pnpm
☕ Java 21
🐳 Docker Desktop
🔧 Git
1️⃣ Clone the repository
git clone https://github.com/Rustam200391/clinicflow.git
cd clinicflow
2️⃣ Start PostgreSQL
cd backend
docker compose up -d

PostgreSQL:

localhost:5432
3️⃣ Start the backend
Windows
cd backend
.\mvnw.cmd spring-boot:run
Linux / macOS
cd backend
./mvnw spring-boot:run

Backend:

http://localhost:8080
4️⃣ Start the frontend

Open another terminal:

cd clinicflow
pnpm install
pnpm dev

Frontend:

http://localhost:5173

The Vite development server proxies /api requests to the Spring Boot backend.

🧪 Testing
Backend tests
cd backend
.\mvnw.cmd test
Frontend production build
pnpm build

The project is tested incrementally as new functionality is implemented.

🛣️ Roadmap
✅ Completed
 🧑‍🤝‍🧑 Patient management
 🔎 Patient search
 👤 Patient details
 📝 Visit history
 👨‍⚕️ Doctors list
 📋 Doctor details
 🐘 PostgreSQL integration
 🧪 Backend integration tests
🚧 In Development
 ➕ Add Doctor
 🔐 Authentication
 👥 Role-based access control
 🧑‍💼 Employees
 📞 Reception workflow
 📅 Appointments
 🗓️ Calendar
 ⏰ Doctor schedules
 💬 Doctor ↔ Admin requests
 📱 WhatsApp notifications
 ✈️ Telegram notifications
 📊 Reports
 ⚙️ Settings
🔮 Later
 🌐 Temporary public deployment
 🏥 Real-world clinic testing
 📤 Data export
 📈 Advanced reports
 🔔 Appointment reminders
 🌍 Multi-language interface
🔄 Development Workflow

ClinicFlow is developed through small vertical slices:

💾 Database
      ↓
⚙️ Backend API
      ↓
🎨 Frontend
      ↓
🧪 Automated tests
      ↓
🐘 PostgreSQL verification
      ↓
🖥️ Manual UI testing
      ↓
🚀 Feature complete

The priority is working functionality first.

Architecture and additional abstractions are introduced when they become necessary for the actual product.

🎯 Project Goal

The goal of ClinicFlow is not simply to build another CRUD application.

The project is intended to be tested against real clinic workflows and real user feedback.

The development process therefore focuses on questions such as:

How many clicks does a receptionist need to book a patient?
Can a doctor quickly find the information they need?
Is the appointment workflow intuitive?
Which information should be visible immediately?
Where do users encounter unnecessary steps?

Real-world feedback will guide the next stages of development.

📌 Project Status

ClinicFlow — Active Development

The core patient and doctor management functionality is already implemented.

The next major milestone is:

🔐 Authentication + Roles + Add Doctor + Employee Management

After that, the project will move toward the complete receptionist → appointment → doctor workflow.

👨‍💻 Author

Rustam Huseynov

GitHub: @Rustam200391
