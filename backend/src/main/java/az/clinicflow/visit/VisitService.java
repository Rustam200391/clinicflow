package az.clinicflow.visit;

import az.clinicflow.patient.Patient;
import az.clinicflow.patient.PatientRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class VisitService {
    private final VisitRepository visits;
    private final PatientRepository patients;
    private final UUID clinicId;

    public VisitService(VisitRepository visits, PatientRepository patients,
                        @Value("${clinicflow.development-clinic-id}") UUID clinicId) {
        this.visits = visits;
        this.patients = patients;
        this.clinicId = clinicId;
    }

    public List<VisitResponse> history(UUID patientId) {
        requirePatient(patientId);
        return visits.findHistory(patientId, clinicId).stream().map(VisitResponse::from).toList();
    }

    @Transactional
    public VisitResponse create(UUID patientId, CreateVisitRequest request) {
        Patient patient = requirePatient(patientId);
        Visit visit = new Visit(UUID.randomUUID(), patient, request.visitDate(), normalize(request.notes()));
        Visit saved = visits.save(visit);
        patient.updateLastVisitIfLater(request.visitDate());
        patients.save(patient);
        return VisitResponse.from(saved);
    }

    private Patient requirePatient(UUID patientId) {
        return patients.findByIdAndClinic_Id(patientId, clinicId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
    }

    private String normalize(String notes) {
        return notes == null || notes.isBlank() ? null : notes.trim();
    }
}
