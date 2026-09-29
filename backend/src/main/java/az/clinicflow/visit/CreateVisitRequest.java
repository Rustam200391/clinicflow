package az.clinicflow.visit;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateVisitRequest(
        @NotNull(message = "Visit date is required")
        LocalDate visitDate,

        @Size(max = 5000, message = "Notes must be 5000 characters or fewer")
        String notes
) {}
