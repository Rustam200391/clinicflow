package az.clinicflow.doctor;

import az.clinicflow.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class DoctorService {
    private final UserRepository users;
    private final UUID clinicId;

    public DoctorService(UserRepository users,
                         @Value("${clinicflow.development-clinic-id}") UUID clinicId) {
        this.users = users;
        this.clinicId = clinicId;
    }

    public List<DoctorResponse> list() {
        return users.findByClinic_IdAndRoleOrderByFullNameAsc(clinicId, "DOCTOR")
                .stream()
                .map(DoctorResponse::from)
                .toList();
    }
}
