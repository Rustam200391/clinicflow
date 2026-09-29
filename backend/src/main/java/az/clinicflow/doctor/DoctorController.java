package az.clinicflow.doctor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    private final DoctorService service;

    public DoctorController(DoctorService service) {
        this.service = service;
    }

    @GetMapping
    public List<DoctorResponse> list() {
        return service.list();
    }

    @GetMapping("/{doctorId}")
    public DoctorResponse getById(@PathVariable UUID doctorId) {
        return service.getById(doctorId);
    }
}
