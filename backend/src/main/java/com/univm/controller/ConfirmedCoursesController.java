package com.univm.controller;

import com.univm.model.Enrollment;
import com.univm.repository.EnrollmentRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/confirmed-courses")
public class ConfirmedCoursesController {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getConfirmedCourses(HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        try {
            Object roleObj = session.getAttribute("role");
            Object studentIdObj = session.getAttribute("studentId");
            String role = (roleObj != null && !"null".equals(roleObj)) ? roleObj.toString() : null;
            String studentIdStr = (studentIdObj != null && !"null".equals(studentIdObj)) ? studentIdObj.toString() : null;
            if (!"student".equals(role) || studentIdStr == null || studentIdStr.isEmpty()) {
                result.put("error", "학생만 접근 가능합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
            }
            Integer studentId = Integer.parseInt(studentIdStr);

            List<Enrollment> enrollments = enrollmentRepository.findByStudent_StudentIdAndEnrollStatus(
                    studentId, "CONFIRMED"
            );

            List<Map<String, Object>> mappedCourses = new ArrayList<>();
            for (Enrollment e : enrollments) {
                Map<String, Object> cc = new HashMap<>();
                cc.put("enrollmentId", e.getEnrollmentId());
                cc.put("subjectId", e.getSubject() != null ? e.getSubjectId() : null);
                cc.put("subjectName", e.getSubject() != null ? e.getSubject().getSubjectName() : "");
                String professorName = "";
                if (e.getSubject() != null && e.getSubject().getProfessor() != null) {
                    professorName = e.getSubject().getProfessor().getName() != null
                            ? e.getSubject().getProfessor().getName() : "";
                }
                cc.put("professorName", professorName);
                mappedCourses.add(cc);
            }
            result.put("courses", mappedCourses);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            // 상세 예외 메시지 제공
            StringBuilder sb = new StringBuilder();
            sb.append("서버 오류: ").append(ex.getClass().getSimpleName());
            if (ex.getMessage() != null) sb.append(" - ").append(ex.getMessage());
            // stack trace 일부도 프론트로 넘겨서 디버깅 편의 제공
            if (ex.getStackTrace() != null && ex.getStackTrace().length > 0) {
                sb.append("\n[STACK] ").append(ex.getStackTrace()[0].toString());
            }
            result.put("error", sb.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    @DeleteMapping(value="/{enrollmentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> cancelConfirmedCourse(
            @PathVariable Integer enrollmentId,
            HttpSession session
    ) {
        Map<String, Object> result = new HashMap<>();
        try {
            Object roleObj = session.getAttribute("role");
            Object studentIdObj = session.getAttribute("studentId");
            String role = (roleObj != null && !"null".equals(roleObj)) ? roleObj.toString() : null;
            String studentIdStr = (studentIdObj != null && !"null".equals(studentIdObj)) ? studentIdObj.toString() : null;
            if (!"student".equals(role) || studentIdStr == null || studentIdStr.isEmpty()) {
                result.put("error", "학생만 접근 가능합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
            }
            Integer studentId = Integer.parseInt(studentIdStr);

            Optional<Enrollment> opt = enrollmentRepository.findById(enrollmentId);
            if (opt.isEmpty() || opt.get().getStudent() == null || !studentId.equals(opt.get().getStudent().getStudentId())) {
                result.put("error", "본인 과목만 취소할 수 있습니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
            }
            Enrollment enrollment = opt.get();
            if (!"CONFIRMED".equals(enrollment.getEnrollStatus())) {
                result.put("error", "이미 취소된 과목입니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
            }
            enrollment.setEnrollStatus("CANCELLED");
            enrollmentRepository.save(enrollment);
            result.put("success", true);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            StringBuilder sb = new StringBuilder();
            sb.append("서버 오류: ").append(ex.getClass().getSimpleName());
            if (ex.getMessage() != null) sb.append(" - ").append(ex.getMessage());
            if (ex.getStackTrace() != null && ex.getStackTrace().length > 0) {
                sb.append("\n[STACK] ").append(ex.getStackTrace()[0].toString());
            }
            result.put("error", sb.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }
}