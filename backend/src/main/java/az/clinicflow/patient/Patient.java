package az.clinicflow.patient;

import az.clinicflow.clinic.Clinic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "patients")
public class Patient {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "clinic_id", nullable = false, foreignKey = @ForeignKey(name = "fk_patients_clinic"))
    private Clinic clinic;

    @Column(name = "full_name", nullable = false, length = 160)
    private String name;

    @Column(length = 254)
    private String email;

    @Column(length = 40)
    private String phone;

    @Column(name = "last_visit")
    private LocalDate lastVisit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private PatientStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Patient() {}

    public Patient(UUID id, Clinic clinic, String name, String email, String phone, LocalDate lastVisit, PatientStatus status) {
        this.id = id;
        this.clinic = clinic;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.lastVisit = lastVisit;
        this.status = status;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public Clinic getClinic() { return clinic; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public LocalDate getLastVisit() { return lastVisit; }
    public PatientStatus getStatus() { return status; }
}
