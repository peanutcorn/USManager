package com.univm.controller;

import com.univm.dto.LoginRequest;
import com.univm.service.AuthService;
import com.univm.repository.EnrollmentRepository;
import com.univm.dto.ScoresRequest;
import com.univm.dto.ScoreDto;
import com.univm.model.Enrollment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/grades")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowedHeaders = "*",
        allowCredentials = "true",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
public class GradeController {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @PostMapping("/fix")
    public Map<String, Object> fixGrades(@RequestBody ScoresRequest request) {
        for (ScoreDto s : request.getScores()) {
            Enrollment e = enrollmentRepository.findById(s.getEnrollment_id()).orElseThrow();
            enrollmentRepository.save(e);
        }
        return Map.of("result", "success");
    }
}