package com.univm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/db")
    public ResponseEntity<String> checkDatabase() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return ResponseEntity.ok("Database connection successful");
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Database connection failed: " + e.getMessage());
        }
    }
}