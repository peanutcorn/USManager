import com.usm.university.models.*;
import com.usm.university.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private ProfessorRepository professorRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private AdminRepository adminRepository;

    @PostMapping("/login")
    public String login(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String userType
    ) {
        switch (userType) {
            case "professor":
                if (professorRepository.findByNameAndPasswords(username, password).isPresent())
                    return "professor";
                break;
            case "student":
                if (studentRepository.findByNameAndPasswords(username, password).isPresent())
                    return "student";
                break;
            case "admin":
                if (adminRepository.findByNameAndPasswords(username, password).isPresent())
                    return "admin";
                break;
        }
        return "fail";
    }
}