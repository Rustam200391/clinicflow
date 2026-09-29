package az.clinicflow.visit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface VisitRepository extends JpaRepository<Visit, UUID> {
    @Query("""
            select v from Visit v
            where v.patient.id = :patientId and v.patient.clinic.id = :clinicId
            order by v.visitDate desc, v.createdAt desc
            """)
    List<Visit> findHistory(@Param("patientId") UUID patientId, @Param("clinicId") UUID clinicId);
}
