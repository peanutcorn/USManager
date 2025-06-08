package com.univm.controller;

import com.univm.dto.LoginRequest;
import com.univm.service.AuthService;
import com.univm.repository.EnrollmentRepository;
import com.univm.dto.EnrollmentDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/enrollments")
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
public class EnrollmentController {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    // 과목명으로 검색
    @GetMapping("/by-subject-name")
    public List<EnrollmentDto> getBySubjectName(@RequestParam String subject_name) {
        return enrollmentRepository
                .findBySubjectNameContaining(subject_name)
                .stream()
                .map(EnrollmentDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 학생명으로 검색
    @GetMapping("/by-student-name")
    public List<EnrollmentDto> getByStudentName(@RequestParam String student_name) {
        return enrollmentRepository
                .findByStudentNameContaining(student_name)
                .stream()
                .map(EnrollmentDto::fromEntity)
                .collect(Collectors.toList());
    }
}