package az.clinicflow.doctor;

import az.clinicflow.clinic.Clinic;
import az.clinicflow.clinic.ClinicRepository;
import az.clinicflow.user.User;
import az.clinicflow.user.UserRepository;
import az.clinicflow.patient.PatientRepository;
import az.clinicflow.visit.VisitRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class DoctorApiIntegrationTest {
    private static final UUID CLINIC_ID = UUID.fromString("00000000-0000-4000-8000-000000000001");
    private final HttpClient client = HttpClient.newHttpClient();

    @LocalServerPort
    private int port;

    @Autowired
    private ClinicRepository clinics;

    @Autowired
    private UserRepository users;

    @Autowired
    private PatientRepository patients;

    @Autowired
    private VisitRepository visits;

    @BeforeEach
    void setUp() {
        visits.deleteAll();
        patients.deleteAll();
        users.deleteAll();
        clinics.deleteAll();

        Clinic clinic = clinics.save(new Clinic(CLINIC_ID, "Test Clinic"));
        Clinic otherClinic = clinics.save(new Clinic(UUID.randomUUID(), "Other Clinic"));
        users.save(new User(UUID.randomUUID(), clinic, "Clinic Admin", "admin@test.clinic", "ADMIN"));
        users.save(new User(UUID.randomUUID(), clinic, "Dr. Amina Aliyeva", "amina@test.clinic", "DOCTOR"));
        users.save(new User(UUID.randomUUID(), clinic, "Dr. Rashad Hasanov", "rashad@test.clinic", "DOCTOR"));
        users.save(new User(UUID.randomUUID(), otherClinic, "Dr. Outside Clinic", "outside@test.clinic", "DOCTOR"));
    }

    @Test
    void listsOnlyDoctorsFromTheCurrentClinic() throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/doctors"))
                .GET().build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        assertEquals(200, response.statusCode());
        assertTrue(response.body().startsWith("["));
        assertEquals(2, response.body().split("\\{", -1).length - 1);
        assertTrue(response.body().contains("\"name\":\"Dr. Amina Aliyeva\""));
        assertTrue(response.body().contains("\"email\":\"rashad@test.clinic\""));
        assertTrue(response.body().contains("\"role\":\"DOCTOR\""));
        assertFalse(response.body().contains("Clinic Admin"));
        assertFalse(response.body().contains("Dr. Outside Clinic"));
    }
}
