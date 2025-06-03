package com.univm.controller;

import com.univm.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController // API 엔드포인트를 정의하는 컨트롤러 클래스
@CrossOrigin(origins = "http://localhost:3000") // CORS 설정: 프론트엔드와 백엔드 간의 요청을 허용
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService; // AuthService를 주입받아 사용자 인증 로직을 처리

    // 사용자 로그인 요청을 처리하는 메서드
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String id = loginRequest.get("id");
            String password = loginRequest.get("password");

            // 입력값 검증: ID와 비밀번호가 비어있거나 null인 경우
            if (id == null || password == null || id.trim().isEmpty() || password.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "status", "error",
                        "message", "ID와 비밀번호를 입력해주세요."
                ));
            }

            // 사용자 유형 결정
            logger.info("로그인 시도 ID: {}", id);

            Map<String, Object> user = authService.authenticate(id, password);

            // 인증 결과에 따라 응답 처리
            if (user != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("status", "success");
                response.put("user", user);

                logger.info("로그인 성공 ID: {}", id);
                return ResponseEntity.ok(response);
            } else {
                logger.warn("로그인 시도 실패 ID: {}", id);
                return ResponseEntity.badRequest().body(Map.of(
                        "status", "error",
                        "message", "유효하지 않은 값"
                ));
            }
        } catch (IllegalArgumentException e) { // 사용자 ID 형식이 잘못된 경우 예외 처리
            logger.error("Login error: ", e);
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        } catch (RuntimeException e) { // 데이터베이스 연결 실패 등 런타임 예외 처리
            logger.error("로그인 중 서버 에러: ", e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", "내부 서버 오류가 발생했습니다. 나중에 다시 시도해주세요."
            ));
        }
    }
}