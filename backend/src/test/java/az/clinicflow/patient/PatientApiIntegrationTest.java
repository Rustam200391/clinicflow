package az.clinicflow.patient;

import az.clinicflow.clinic.Clinic;
import az.clinicflow.clinic.ClinicRepository;
import az.clinicflow.visit.VisitRepository;
import az.clinicflow.user.UserRepository;
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
import java.time.LocalDate;
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

    @Autowired
    private VisitRepository visits;

    @Autowired
    private UserRepository users;

    @BeforeEach
    void setUp() {
        visits.deleteAll();
        patients.deleteAll();
        users.deleteAll();
        clinics.deleteAll();
        clinics.save(new Clinic(CLINIC_ID, "Test Clinic"));
    }

    @Test
    void getsPatientAndEmptyVisitHistoryAndReturnsNotFoundForUnknownPatient() throws Exception {
        Patient patient = savePatient(CLINIC_ID, "Patient With No Visits", LocalDate.of(2026, 9, 18));

        HttpResponse<String> details = get("/api/patients/" + patient.getId());
        assertEquals(200, details.statusCode());
        assertTrue(details.body().contains("\"name\":\"Patient With No Visits\""));
        assertTrue(details.body().contains("\"lastVisit\":\"2026-09-18\""));

        HttpResponse<String> emptyHistory = get("/api/patients/" + patient.getId() + "/visits");
        assertEquals(200, emptyHistory.statusCode());
        assertEquals("[]", emptyHistory.body());

        HttpResponse<String> missing = get("/api/patients/" + UUID.randomUUID());
        assertEquals(404, missing.statusCode());
    }

    @Test
    void createsAndOrdersVisitsWithoutMovingLastVisitBackwards() throws Exception {
        Patient patient = savePatient(CLINIC_ID, "Visit History Patient", LocalDate.of(2026, 9, 18));

        HttpResponse<String> newest = postVisit(patient.getId(), "2026-09-29", "Most recent visit");
        assertEquals(201, newest.statusCode());
        assertTrue(newest.body().contains("\"visitDate\":\"2026-09-29\""));

        HttpResponse<String> older = postVisit(patient.getId(), "2026-09-20", null);
        assertEquals(201, older.statusCode());
        assertTrue(older.body().contains("\"notes\":null"));

        HttpResponse<String> middle = postVisit(patient.getId(), "2026-09-25", "Middle visit");
        assertEquals(201, middle.statusCode());

        HttpResponse<String> details = get("/api/patients/" + patient.getId());
        assertEquals(200, details.statusCode());
        assertTrue(details.body().contains("\"lastVisit\":\"2026-09-29\""));

        HttpResponse<String> history = get("/api/patients/" + patient.getId() + "/visits");
        assertEquals(200, history.statusCode());
        assertTrue(history.body().indexOf("2026-09-29") < history.body().indexOf("2026-09-25"));
        assertTrue(history.body().indexOf("2026-09-25") < history.body().indexOf("2026-09-20"));
        assertEquals(3, visits.count());
    }

    @Test
    void cannotReadOrCreateVisitsForPatientInAnotherClinic() throws Exception {
        Clinic otherClinic = clinics.save(new Clinic(UUID.randomUUID(), "Other Clinic"));
        Patient otherPatient = patients.save(new Patient(UUID.randomUUID(), otherClinic,
                "Other Clinic Patient", null, null, null, PatientStatus.ACTIVE));

        assertEquals(404, get("/api/patients/" + otherPatient.getId()).statusCode());
        assertEquals(404, get("/api/patients/" + otherPatient.getId() + "/visits").statusCode());
        assertEquals(404, postVisit(otherPatient.getId(), "2026-09-29", "Should not be saved").statusCode());
        assertEquals(0, visits.count());
    }

    private Patient savePatient(UUID clinicId, String name, LocalDate lastVisit) {
        Clinic clinic = clinics.findById(clinicId).orElseThrow();
        return patients.save(new Patient(UUID.randomUUID(), clinic, name, null, null, lastVisit, PatientStatus.ACTIVE));
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

    private HttpResponse<String> postVisit(UUID patientId, String date, String notes) throws Exception {
        String body = "{\"visitDate\":\"" + date + "\"" + (notes == null ? "" : ",\"notes\":\"" + notes + "\"") + "}";
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/patients/" + patientId + "/visits"))
                .header("Content-Type", "application/json").POST(HttpRequest.BodyPublishers.ofString(body)).build();
        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }
}
