package az.clinicflow.visit;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record VisitResponse(UUID id, LocalDate visitDate, String notes, Instant createdAt) {
    public static VisitResponse from(Visit visit) {
        return new VisitResponse(visit.getId(), visit.getVisitDate(), visit.getNotes(), visit.getCreatedAt());
    }
}
