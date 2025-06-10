package com.univm.controller;

import com.univm.model.Enrollment;
import com.univm.repository.EnrollmentRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/courses/registered")
public class RegisteredCoursesController {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRegisteredCourses(HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        try {
            Object roleObj = session.getAttribute("role");
            Object studentIdObj = session.getAttribute("studentId");

            String role = (roleObj != null) ? roleObj.toString() : null;
            String studentIdStr = (studentIdObj != null) ? studentIdObj.toString() : null;

            if (!"student".equals(role) || studentIdStr == null || studentIdStr.isEmpty() || "null".equals(studentIdStr)) {
                result.put("error", "학생 정보가 없습니다. 다시 로그인 해주세요.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
            }

            int studentId = Integer.parseInt(studentIdStr);

            // *** 이 부분이 중요: 오직 int studentId만 넘길 것! ***
            List<Enrollment> enrollments = enrollmentRepository.findByStudentStudentId(studentId);

            List<Map<String, Object>> mappedCourses = new ArrayList<>();
            for (Enrollment e : enrollments) {
                Map<String, Object> c = new HashMap<>();
                c.put("enrollmentId", e.getEnrollmentId());
                c.put("subjectId", e.getSubject() != null ? e.getSubject().getSubjectId() : null);
                c.put("subjectName", e.getSubject() != null ? e.getSubject().getSubjectName() : "");
                String professorName = "";
                if (e.getSubject() != null && e.getSubject().getProfessor() != null) {
                    professorName = e.getSubject().getProfessor().getName() != null
                            ? e.getSubject().getProfessor().getName() : "";
                }
                c.put("professorName", professorName);
                c.put("status", e.getEnrollStatus());
                mappedCourses.add(c);
            }
            result.put("courses", mappedCourses);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            result.put("error", "서버 오류: " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }
}