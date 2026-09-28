package az.clinicflow.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    @Query("""
            select p from Patient p
            where p.clinic.id = :clinicId
              and (:search is null
                   or lower(p.name) like lower(concat('%', :search, '%'))
                   or lower(coalesce(p.email, '')) like lower(concat('%', :search, '%'))
                   or lower(coalesce(p.phone, '')) like lower(concat('%', :search, '%')))
            order by p.name asc
            """)
    List<Patient> searchByClinic(@Param("clinicId") UUID clinicId, @Param("search") String search);
}
