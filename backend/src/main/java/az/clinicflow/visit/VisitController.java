package az.clinicflow.visit;

import az.clinicflow.patient.PatientResponse;
import az.clinicflow.patient.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/patients/{patientId}")
public class VisitController {
    private final PatientService patients;
    private final VisitService visits;

    public VisitController(PatientService patients, VisitService visits) {
        this.patients = patients;
        this.visits = visits;
    }

    @GetMapping
    public PatientResponse getPatient(@PathVariable UUID patientId) {
        return patients.getById(patientId);
    }

    @GetMapping("/visits")
    public List<VisitResponse> history(@PathVariable UUID patientId) {
        return visits.history(patientId);
    }

    @PostMapping("/visits")
    public ResponseEntity<VisitResponse> createVisit(@PathVariable UUID patientId,
                                                      @Valid @RequestBody CreateVisitRequest request) {
        VisitResponse created = visits.create(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
