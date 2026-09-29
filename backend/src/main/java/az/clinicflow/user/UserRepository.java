package az.clinicflow.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    List<User> findByClinic_IdAndRoleOrderByFullNameAsc(UUID clinicId, String role);
}
