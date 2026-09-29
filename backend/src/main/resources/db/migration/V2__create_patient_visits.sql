CREATE TABLE visits (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id),
    visit_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_visits_patient_date ON visits (patient_id, visit_date DESC);

INSERT INTO visits (id, patient_id, visit_date, notes, created_at)
SELECT gen_random_uuid(), id, last_visit, NULL, CURRENT_TIMESTAMP
FROM patients
WHERE last_visit IS NOT NULL;
