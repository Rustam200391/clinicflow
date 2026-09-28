package az.clinicflow.patient;

import az.clinicflow.clinic.Clinic;
import az.clinicflow.clinic.ClinicRepository;
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
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class PatientApiIntegrationTest {
    private static final UUID CLINIC_ID = UUID.fromString("00000000-0000-4000-8000-000000000001");
    private final HttpClient client = HttpClient.newHttpClient();

    @LocalServerPort
    private int port;

    @Autowired
    private PatientRepository patients;

    @Autowired
    private ClinicRepository clinics;

    @BeforeEach
    void setUp() {
        patients.deleteAll();
        clinics.deleteAll();
        clinics.save(new Clinic(CLINIC_ID, "Test Clinic"));
    }

    @Test
    void listsCreatesSearchesAndValidatesPatients() throws Exception {
        HttpResponse<String> initialList = get("/api/patients");
        assertEquals(200, initialList.statusCode());
        assertEquals("[]", initialList.body());

        HttpResponse<String> created = post("{\"name\":\"Test Patient\",\"email\":\"test@example.com\",\"phone\":\"+994 50 123 45 67\"}");
        assertEquals(201, created.statusCode());
        assertTrue(created.body().contains("\"name\":\"Test Patient\""));
        assertTrue(created.body().contains("\"status\":\"Active\""));
        assertTrue(created.body().contains("\"lastVisit\":null"));

        HttpResponse<String> found = get("/api/patients?search=example.com");
        assertEquals(200, found.statusCode());
        assertTrue(found.body().contains("Test Patient"));

        HttpResponse<String> invalid = post("{\"name\":\" \",\"email\":\"not-an-email\"}");
        assertEquals(400, invalid.statusCode());
        assertTrue(invalid.body().contains("Validation failed"));
        assertTrue(invalid.body().contains("name"));
    }

    private HttpResponse<String> get(String path) throws Exception {
        return client.send(HttpRequest.newBuilder(URI.create("http://localhost:" + port + path)).GET().build(), HttpResponse.BodyHandlers.ofString());
    }

    private HttpResponse<String> post(String body) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/patients"))
                .header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(body)).build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }
}
