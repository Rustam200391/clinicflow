# ClinicFlow API

The API uses Spring Boot 4.x, Java 21, Spring Data JPA, Flyway, and PostgreSQL.

## Run locally

1. Start PostgreSQL with Docker Compose: `docker compose up -d` (run from this directory).
2. Start the API with Maven: `mvn spring-boot:run` (run from this directory).
3. Start React from the repository root with `pnpm dev`.

The API listens on `http://localhost:8080`; Vite proxies `/api` to it. Set `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` to override the local database defaults.

The default `dev` profile seeds Baku Medical Clinic, an administrator record (`admin@clinicflow.az`), and the six sample patients. This is local development data only; authentication is not implemented.

## Endpoints

- `GET /api/patients?search=...` lists patients for the development clinic and searches name, email, or phone.
- `POST /api/patients` creates a patient. Send JSON with `name` and optional `email` and `phone`. Successful creation returns `201 Created`.

Validation failures return `400 Bad Request` with a Problem Details response and an `errors` object keyed by field.

## Test

Run `mvn test`. The API integration test uses in-memory H2; local application runs use PostgreSQL.
