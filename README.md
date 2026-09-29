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
