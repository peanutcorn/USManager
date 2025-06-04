package com.univm.service;

import com.univm.config.DatabaseConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import javax.sql.DataSource;
import java.sql.*;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.dao.DataAccessException;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Map<String, Object> authenticate(String id, String password) {
        try {
            String userType = determineUserType(id);
            String query = buildQuery(userType);

            return jdbcTemplate.queryForObject(query,
                    (rs, rowNum) -> {
                        Map<String, Object> result = new HashMap<>();
                        result.put("id", id);
                        result.put("name", rs.getString("name"));
                        result.put("userType", userType);

                        // 사용자 유형별 추가 정보
                        switch (userType) {
                            case "student":
                                result.put("major", rs.getString("major"));
                                result.put("score", rs.getFloat("score"));
                                break;
                            case "professor":
                                result.put("major", rs.getString("major"));
                                break;
                            case "admin":
                                // 관리자는 기본 정보만
                                break;
                        }

                        return result;
                    },
                    id, password
            );
        } catch (Exception e) {
            logger.error("Authentication failed for ID: {}", id, e);
            return null;
        }
    }

    private String determineUserType(String id) {
        if (id == null || id.trim().isEmpty()) {
            logger.error("Empty ID provided");
            throw new IllegalArgumentException("ID cannot be empty");
        }

        String userType;
        if (id.startsWith("A") && id.length() == 7) {
            userType = "admin";
        } else if (id.length() == 8) {
            userType = "student";
        } else if (id.length() == 10) {
            userType = "professor";
        } else {
            logger.error("Invalid ID format: {}", id);
            throw new IllegalArgumentException("Invalid ID format");
        }

        logger.debug("Determined user type: {} for ID: {}", userType, id);
        return userType;
    }

    private String buildQuery(String userType) {
        String query = switch (userType) {
            case "student" ->
                    "SELECT student_id, name, major, score FROM students " +
                            "WHERE student_id = ? AND passwords = ?";
            case "professor" ->
                    "SELECT professor_id, name, major FROM professors " +
                            "WHERE professor_id = ? AND passwords = ?";
            case "admin" ->
                    "SELECT admin_id, name FROM admins " +
                            "WHERE admin_id = ? AND passwords = ?";
            default -> {
                logger.error("Invalid user type provided: {}", userType);
                throw new IllegalArgumentException("Invalid user type: " + userType);
            }
        };

        logger.debug("Built query for user type {}: {}", userType, query);
        return query;
    }

    public boolean testDatabaseConnection() {
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return true;
        } catch (DataAccessException e) {
            logger.error("Database connection test failed", e);
            return false;
        }
    }
}