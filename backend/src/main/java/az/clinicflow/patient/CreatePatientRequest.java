package az.clinicflow.patient;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreatePatientRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 160, message = "Full name must be 160 characters or fewer")
        String name,

        @Email(message = "Email must be a valid email address")
        @Size(max = 254, message = "Email must be 254 characters or fewer")
        String email,

        @Size(max = 40, message = "Phone must be 40 characters or fewer")
        @Pattern(regexp = "^[+()0-9 .-]*$", message = "Phone may contain digits, spaces, +, -, parentheses, and periods")
        String phone
) {}
