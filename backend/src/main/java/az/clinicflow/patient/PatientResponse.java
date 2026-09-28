package az.clinicflow.patient;

import java.time.LocalDate;
import java.util.UUID;

public record PatientResponse(
        UUID id,
        String name,
        String initials,
        String email,
        String phone,
        LocalDate lastVisit,
        String status
) {
    public static PatientResponse from(Patient patient) {
        String initials = java.util.Arrays.stream(patient.getName().trim().split("\\s+"))
                .limit(2)
                .map(part -> part.substring(0, 1).toUpperCase())
                .reduce("", String::concat);
        return new PatientResponse(patient.getId(), patient.getName(), initials,
                patient.getEmail(), patient.getPhone(), patient.getLastVisit(), patient.getStatus().getLabel());
    }
}
