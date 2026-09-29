# ClinicFlow

Clinic management system for small and medium-sized clinics.

ClinicFlow is a full-stack web application designed to simplify everyday clinic operations: patient management, doctors, appointments, scheduling, staff access and communication with patients.

The project is being developed with a focus on practical clinic workflows and real-world testing.

> 🚧 ClinicFlow is currently under active development.

---

## Overview

ClinicFlow is intended to provide a single workspace for clinic administrators, doctors and reception staff.

The main goal is to make common clinic operations simple:

- manage patients
- manage doctors and employees
- organize appointments
- manage doctor schedules
- keep patient visit history
- provide different access levels for clinic staff
- send appointment confirmations and reminders
- generate operational reports

The system is being developed incrementally, with working features tested before adding new functionality.

---

## Current Features

### Patients

- Patient list
- Patient search
- Create patient
- Patient details
- Visit history
- Add visit records

### Doctors

- Doctors list
- Doctor details
- Doctor information linked to the system user
- Current clinic scope
- Doctor role (`DOCTOR`)

### Backend API

Current API includes:

```text
GET    /api/patients
GET    /api/patients?search=...
POST   /api/patients
GET    /api/patients/{patientId}
GET    /api/patients/{patientId}/visits
POST   /api/patients/{patientId}/visits

GET    /api/doctors
GET    /api/doctors/{doctorId}
