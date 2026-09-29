package az.clinicflow.doctor;

import az.clinicflow.user.User;

import java.util.UUID;

public record DoctorResponse(UUID id, String name, String email, String role) {
    public static DoctorResponse from(User user) {
        return new DoctorResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }
}
