CREATE TABLE clinics (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    clinic_id UUID NOT NULL REFERENCES clinics(id),
    full_name VARCHAR(160) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    role VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE patients (
    id UUID PRIMARY KEY,
    clinic_id UUID NOT NULL,
    full_name VARCHAR(160) NOT NULL,
    email VARCHAR(254),
    phone VARCHAR(40),
    last_visit DATE,
    status VARCHAR(24) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_patients_clinic FOREIGN KEY (clinic_id) REFERENCES clinics(id)
);

CREATE INDEX idx_patients_clinic_name ON patients (clinic_id, full_name);
