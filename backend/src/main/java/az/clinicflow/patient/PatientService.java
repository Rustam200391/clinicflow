package az.clinicflow.patient;

import az.clinicflow.clinic.Clinic;
import az.clinicflow.clinic.ClinicRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class PatientService {
    private final PatientRepository patients;
    private final ClinicRepository clinics;
    private final UUID clinicId;

    public PatientService(PatientRepository patients, ClinicRepository clinics,
                          @Value("${clinicflow.development-clinic-id}") UUID clinicId) {
        this.patients = patients;
        this.clinics = clinics;
        this.clinicId = clinicId;
    }

    public List<PatientResponse> search(String query) {
        String search = query == null || query.isBlank() ? null : query.trim();
        List<Patient> results = search == null
                ? patients.findByClinic_IdOrderByNameAsc(clinicId)
                : patients.searchByClinic(clinicId, search);
        return results.stream().map(PatientResponse::from).toList();
    }

    public PatientResponse getById(UUID patientId) {
        return patients.findByIdAndClinic_Id(patientId, clinicId)
                .map(PatientResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
    }

    @Transactional
    public PatientResponse create(CreatePatientRequest request) {
        Clinic clinic = clinics.findById(clinicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Development clinic is not initialized"));
        Patient patient = new Patient(UUID.randomUUID(), clinic, request.name().trim(), normalize(request.email()),
                normalize(request.phone()), null, PatientStatus.ACTIVE);
        return PatientResponse.from(patients.save(patient));
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
