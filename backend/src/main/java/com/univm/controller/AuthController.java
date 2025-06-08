package com.univm.controller;

import com.univm.model.Student;
import com.univm.model.Professor;
import com.univm.model.Admin;
import com.univm.repository.StudentRepository;
import com.univm.repository.ProfessorRepository;
import com.univm.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private ProfessorRepository professorRepo;

    @Autowired
    private AdminRepository adminRepo;

    // 임시 세션 저장소 (실제 환경에서는 Redis나 데이터베이스 사용 권장)
    private static final Map<String, Map<String, Object>> sessionStore = new HashMap<>();

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload) {

        Map<String, Object> response = new HashMap<>();

        try {
            // 필수 파라미터 체크
            String id = payload.get("id");
            String password = payload.get("password");

            if (id == null || id.trim().isEmpty() || password == null || password.trim().isEmpty()) {
                response.put("error", "ID와 비밀번호는 필수입니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // 학생 로그인 시도 (숫자 ID)
            if (tryStudentLogin(id, password, response)) {
                return ResponseEntity.ok(response);
            }

            // 교수 로그인 시도 (숫자 ID)
            if (tryProfessorLogin(id, password, response)) {
                return ResponseEntity.ok(response);
            }

            // 관리자 로그인 시도 (문자열 ID)
            if (tryAdminLogin(id, password, response)) {
                return ResponseEntity.ok(response);
            }

            // 모든 로그인 시도 실패
            response.put("error", "아이디 또는 비밀번호가 올바르지 않습니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

        } catch (Exception ex) {
            response.put("error", "서버 오류: " + ex.getClass().getSimpleName() +
                    (ex.getMessage() == null ? "" : " - " + ex.getMessage()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private boolean tryStudentLogin(String id, String password, Map<String, Object> response) {
        try {
            Integer studentId = Integer.parseInt(id);
            Optional<Student> stuOpt = studentRepo.findByStudentId(studentId);

            if (stuOpt.isPresent()) {
                Student student = stuOpt.get();
                if (password.equals(student.getPasswords())) {
                    // 세션 ID 생성
                    String sessionId = UUID.randomUUID().toString();

                    // 세션 정보 저장
                    Map<String, Object> sessionData = new HashMap<>();
                    sessionData.put("role", "student");
                    sessionData.put("studentId", studentId);
                    sessionData.put("name", student.getName());
                    sessionData.put("loginTime", System.currentTimeMillis());
                    sessionStore.put(sessionId, sessionData);

                    // 응답 데이터 설정
                    response.put("success", true);
                    response.put("role", "student");
                    response.put("studentId", studentId);
                    response.put("name", student.getName());
                    response.put("sessionId", sessionId);
                    return true;
                }
            }
        } catch (NumberFormatException e) {
            // 숫자가 아닌 경우 무시
        }
        return false;
    }

    private boolean tryProfessorLogin(String id, String password, Map<String, Object> response) {
        try {
            Integer professorId = Integer.parseInt(id);
            Optional<Professor> profOpt = professorRepo.findByProfessorId(professorId);

            if (profOpt.isPresent()) {
                Professor professor = profOpt.get();
                if (password.equals(professor.getPasswords())) {
                    // 세션 ID 생성
                    String sessionId = UUID.randomUUID().toString();

                    // 세션 정보 저장
                    Map<String, Object> sessionData = new HashMap<>();
                    sessionData.put("role", "professor");
                    sessionData.put("professorId", professorId);
                    sessionData.put("name", professor.getName());
                    sessionData.put("loginTime", System.currentTimeMillis());
                    sessionStore.put(sessionId, sessionData);

                    // 응답 데이터 설정
                    response.put("success", true);
                    response.put("role", "professor");
                    response.put("professorId", professorId);
                    response.put("name", professor.getName());
                    response.put("sessionId", sessionId);
                    return true;
                }
            }
        } catch (NumberFormatException e) {
            // 숫자가 아닌 경우 무시
        }
        return false;
    }

    private boolean tryAdminLogin(String id, String password, Map<String, Object> response) {
        Optional<Admin> adminOpt = adminRepo.findByAdminId(id);

        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (password.equals(admin.getPasswords())) {
                // 세션 ID 생성
                String sessionId = UUID.randomUUID().toString();

                // 세션 정보 저장
                Map<String, Object> sessionData = new HashMap<>();
                sessionData.put("role", "admin");
                sessionData.put("adminId", id);
                sessionData.put("name", admin.getName());
                sessionData.put("loginTime", System.currentTimeMillis());
                sessionStore.put(sessionId, sessionData);

                // 응답 데이터 설정
                response.put("success", true);
                response.put("role", "admin");
                response.put("adminId", id);
                response.put("name", admin.getName());
                response.put("sessionId", sessionId);
                return true;
            }
        }
        return false;
    }

    @GetMapping(value = "/check", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> check(@RequestHeader(value = "Authorization", required = false) String sessionId) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (sessionId == null || sessionId.trim().isEmpty()) {
                response.put("error", "세션 ID가 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // Bearer 토큰 형식에서 실제 세션 ID 추출
            if (sessionId.startsWith("Bearer ")) {
                sessionId = sessionId.substring(7);
            }

            Map<String, Object> sessionData = sessionStore.get(sessionId);

            if (sessionData == null) {
                response.put("error", "유효하지 않은 세션입니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 세션 만료 체크 (30분)
            long loginTime = (Long) sessionData.get("loginTime");
            if (System.currentTimeMillis() - loginTime > 30 * 60 * 1000) {
                sessionStore.remove(sessionId);
                response.put("error", "세션이 만료되었습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            String role = (String) sessionData.get("role");
            response.put("success", true);
            response.put("role", role);
            response.put("name", sessionData.get("name"));

            switch (role) {
                case "student":
                    response.put("studentId", sessionData.get("studentId"));
                    break;
                case "professor":
                    response.put("professorId", sessionData.get("professorId"));
                    break;
                case "admin":
                    response.put("adminId", sessionData.get("adminId"));
                    break;
            }

            return ResponseEntity.ok(response);

        } catch (Exception ex) {
            response.put("error", "서버 오류: " + ex.getClass().getSimpleName() +
                    (ex.getMessage() == null ? "" : " - " + ex.getMessage()));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping(value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader(value = "Authorization", required = false) String sessionId) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (sessionId != null) {
                if (sessionId.startsWith("Bearer ")) {
                    sessionId = sessionId.substring(7);
                }
                sessionStore.remove(sessionId);
            }

            response.put("success", true);
            response.put("message", "로그아웃되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            response.put("error", "로그아웃 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 세션 정리 (주기적으로 호출되어야 함)
    public void cleanExpiredSessions() {
        long currentTime = System.currentTimeMillis();
        sessionStore.entrySet().removeIf(entry -> {
            long loginTime = (Long) entry.getValue().get("loginTime");
            return currentTime - loginTime > 30 * 60 * 1000; // 30분 초과시 제거
        });
    }
}