package az.clinicflow.config;

import az.clinicflow.clinic.Clinic;
import az.clinicflow.clinic.ClinicRepository;
import az.clinicflow.patient.Patient;
import az.clinicflow.patient.PatientRepository;
import az.clinicflow.patient.PatientStatus;
import az.clinicflow.user.User;
import az.clinicflow.user.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Configuration
@Profile("dev")
public class DevelopmentSeed {
    private static final UUID CLINIC_ID = UUID.fromString("00000000-0000-4000-8000-000000000001");

    @Bean
    ApplicationRunner seedDevelopmentData(ClinicRepository clinics, UserRepository users, PatientRepository patients) {
        return args -> {
            Clinic clinic = clinics.findById(CLINIC_ID).orElseGet(() -> clinics.save(new Clinic(CLINIC_ID, "Baku Medical Clinic")));
            if (users.count() == 0) {
                users.save(new User(UUID.fromString("00000000-0000-4000-8000-000000000002"), clinic,
                        "ClinicFlow Admin", "admin@clinicflow.az", "ADMIN"));
            }
            seedDoctor(users, clinic, "00000000-0000-4000-8000-000000000003", "Dr. Leyla Hasanli", "leyla.hasanli@clinicflow.az");
            seedDoctor(users, clinic, "00000000-0000-4000-8000-000000000004", "Dr. Kamran Aliyev", "kamran.aliyev@clinicflow.az");
            seedDoctor(users, clinic, "00000000-0000-4000-8000-000000000005", "Dr. Nigar Mammadova", "nigar.mammadova@clinicflow.az");
            if (patients.count() == 0) {
                patients.saveAll(List.of(
                        patient(clinic, "Aylin Mammadova", "aylin.m@example.com", "+994 50 234 18 62", "2026-09-24", PatientStatus.ACTIVE),
                        patient(clinic, "Rashad Aliyev", "rashad.a@example.com", "+994 55 416 72 09", "2026-09-22", PatientStatus.FOLLOW_UP),
                        patient(clinic, "Leyla Hasanli", "leyla.h@example.com", "+994 70 325 44 81", "2026-09-19", PatientStatus.ACTIVE),
                        patient(clinic, "Murad Karimov", "murad.k@example.com", "+994 50 891 06 33", "2026-09-16", PatientStatus.ACTIVE),
                        patient(clinic, "Nigar Safarova", "nigar.s@example.com", "+994 51 773 29 14", "2026-09-12", PatientStatus.FOLLOW_UP),
                        patient(clinic, "Tural Huseynov", "tural.h@example.com", "+994 55 602 11 47", "2026-09-08", PatientStatus.ACTIVE)
                ));
            }
        };
    }

    private void seedDoctor(UserRepository users, Clinic clinic, String id, String fullName, String email) {
        UUID doctorId = UUID.fromString(id);
        if (!users.existsById(doctorId)) {
            users.save(new User(doctorId, clinic, fullName, email, "DOCTOR"));
        }
    }

    private Patient patient(Clinic clinic, String name, String email, String phone, String lastVisit, PatientStatus status) {
        return new Patient(UUID.randomUUID(), clinic, name, email, phone, LocalDate.parse(lastVisit), status);
    }
}
