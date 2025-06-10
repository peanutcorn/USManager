package com.univm.controller;

import com.univm.model.Enrollment;
import com.univm.repository.EnrollmentRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/courses")
public class ConfirmedCoursesController {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> getConfirmedCourses(HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 세션에서 값을 미리 추출
            Object roleObj = session.getAttribute("role");
            Object studentIdObj = session.getAttribute("studentId");

            System.out.println("Session role: " + roleObj);
            System.out.println("Session studentId: " + studentIdObj);

            String role = (roleObj != null) ? roleObj.toString() : null;
            String studentIdStr = (studentIdObj != null) ? studentIdObj.toString() : null;

            // 권한 검증
            if (!"student".equals(role) || studentIdStr == null || studentIdStr.isEmpty() || "null".equals(studentIdStr)) {
                result.put("error", "학생만 접근 가능합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
            }

            // studentId 파싱
            Integer studentId;
            try {
                studentId = Integer.parseInt(studentIdStr);
            } catch (NumberFormatException e) {
                result.put("error", "세션 정보(studentId)가 올바르지 않습니다.");
                return ResponseEntity.badRequest().body(result);
            }

            System.out.println("Looking for enrollments for studentId: " + studentId);

            // 수강 확정된 과목 조회
            List<Enrollment> enrollments;
            try {
                enrollments = enrollmentRepository.findByStudentStudentIdAndEnrollStatus(studentId, "CONFIRMED");
                System.out.println("Found " + enrollments.size() + " enrollments");
            } catch (Exception e) {
                System.err.println("Repository error: " + e.getMessage());
                e.printStackTrace();
                result.put("error", "데이터베이스 조회 중 오류가 발생했습니다: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
            }

            // 결과 매핑
            List<Map<String, Object>> mappedCourses = new ArrayList<>();
            for (Enrollment e : enrollments) {
                try {
                    Map<String, Object> courseInfo = new HashMap<>();
                    courseInfo.put("enrollmentId", e.getEnrollmentId());

                    // Subject 정보 안전하게 추출
                    if (e.getSubject() != null) {
                        courseInfo.put("subjectId", e.getSubject().getSubjectId());
                        courseInfo.put("subjectName", e.getSubject().getSubjectName() != null ? e.getSubject().getSubjectName() : "");

                        // Professor 정보 안전하게 추출
                        String professorName = "";
                        if (e.getSubject().getProfessor() != null) {
                            // Professor 엔티티의 name 필드 사용 (getName() 대신 직접 접근)
                            Object profNameObj = e.getSubject().getProfessor().getName();
                            if (profNameObj != null) {
                                professorName = profNameObj.toString();
                            }
                        }
                        courseInfo.put("professorName", professorName);
                    } else {
                        courseInfo.put("subjectId", null);
                        courseInfo.put("subjectName", "");
                        courseInfo.put("professorName", "");
                    }

                    mappedCourses.add(courseInfo);
                } catch (Exception ex) {
                    System.err.println("Error mapping enrollment " + e.getEnrollmentId() + ": " + ex.getMessage());
                    ex.printStackTrace();
                    // 개별 데이터 매핑 오류는 로그만 남기고 계속 진행
                }
            }

            result.put("courses", mappedCourses);
            result.put("success", true);
            return ResponseEntity.ok(result);

        } catch (Exception ex) {
            System.err.println("Controller error: " + ex.getMessage());
            ex.printStackTrace();

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

    @DeleteMapping("/{enrollmentId}")
    public ResponseEntity<Map<String, Object>> cancelEnrollment(
            @PathVariable Integer enrollmentId,
            HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 세션 검증
            Object roleObj = session.getAttribute("role");
            Object studentIdObj = session.getAttribute("studentId");
            String role = (roleObj != null) ? roleObj.toString() : null;
            String studentIdStr = (studentIdObj != null) ? studentIdObj.toString() : null;

            if (!"student".equals(role) || studentIdStr == null || studentIdStr.isEmpty() || "null".equals(studentIdStr)) {
                result.put("error", "학생만 접근 가능합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
            }

            Integer studentId;
            try {
                studentId = Integer.parseInt(studentIdStr);
            } catch (NumberFormatException e) {
                result.put("error", "세션 정보(studentId)가 올바르지 않습니다.");
                return ResponseEntity.badRequest().body(result);
            }

            // 해당 수강신청이 현재 학생의 것인지 확인
            Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
            if (!enrollmentOpt.isPresent()) {
                result.put("error", "해당 수강신청을 찾을 수 없습니다.");
                return ResponseEntity.badRequest().body(result);
            }

            Enrollment enrollment = enrollmentOpt.get();
            if (enrollment.getStudent() == null || !studentId.equals(enrollment.getStudent().getStudentId())) {
                result.put("error", "본인의 수강신청만 취소할 수 있습니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
            }

            // 수강신청 취소 (상태 변경)
            enrollment.setEnrollStatus("CANCELLED");
            enrollmentRepository.save(enrollment);

            result.put("success", true);
            result.put("message", "수강신청이 취소되었습니다.");
            return ResponseEntity.ok(result);

        } catch (Exception ex) {
            System.err.println("Cancel enrollment error: " + ex.getMessage());
            ex.printStackTrace();

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