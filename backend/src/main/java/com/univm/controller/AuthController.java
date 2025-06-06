package com.univm.controller;

import com.univm.dto.LoginRequest;
import com.univm.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
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
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String id = loginRequest.id;
        String password = loginRequest.password;

        logger.debug("LoginRequest: id={}, password={}", id, password);

        if (id == null || id.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "ID and password are required"
            ));
        }
        try {

            logger.debug("Received login request with ID: {}", id);

            // Validation
            if (id == null || password == null || id.trim().isEmpty() || password.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "ID and password are required");
                return ResponseEntity.ok(response);
            }

            // Authentication
            Map<String, Object> userData = authService.authenticate(id, password);

            Map<String, Object> response = new HashMap<>();

            if (userData != null) {
                String userType = (String) userData.get("userType");

                response.put("success", true);
                response.put("message", "Login successful");
                response.put("user", userData);
                response.put("role", userType);

                logger.info("Login successful for ID: {} with role: {}", id, userType);

                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Login failed. Please check your credentials and try again.");

                logger.warn("Login failed for ID: {}", id);

                return ResponseEntity.ok(response);
            }

        } catch (Exception e) {
            logger.error("Login error for ID: {}", loginRequest.id, e);

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "An error occurred during login. Please try again.");

            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/auth/test-connection")
    public ResponseEntity<?> testConnection() {
        boolean isConnected = authService.testDatabaseConnection();
        Map<String, Object> response = new HashMap<>();

        if (isConnected) {
            response.put("success", true);
            response.put("message", "Database connection successful");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Database connection failed");
            return ResponseEntity.ok(response);
        }
    }
}