package az.clinicflow.visit;

import az.clinicflow.patient.Patient;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "visits")
public class Visit {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false, foreignKey = @ForeignKey(name = "visits_patient_id_fkey"))
    private Patient patient;

    @Column(name = "visit_date", nullable = false)
    private LocalDate visitDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Visit() {}

    public Visit(UUID id, Patient patient, LocalDate visitDate, String notes) {
        this.id = id;
        this.patient = patient;
        this.visitDate = visitDate;
        this.notes = notes;
        this.createdAt = Instant.now();
    }

    public UUID getId() { return id; }
    public Patient getPatient() { return patient; }
    public LocalDate getVisitDate() { return visitDate; }
    public String getNotes() { return notes; }
    public Instant getCreatedAt() { return createdAt; }
}
