package com.univm.service;

import com.univm.config.DatabaseConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    // 사용자 ID에 따라 사용자 유형을 결정하는 메서드
    public String determineUserType(String id) {
        if (id.startsWith("A") && id.length() == 7) {
            return "admin";
        } else if (id.length() == 8) {
            return "student";
        } else if (id.length() == 10) {
            return "professor";
        }
        throw new IllegalArgumentException("Invalid ID format");
    }

    // 사용자 로그인을 수행하는 메서드
    public Map<String, Object> authenticate(String id, String password) {
        String userType = determineUserType(id);
        String query = buildAuthQuery(userType);

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            setQueryParameters(pstmt, id, password, userType);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return buildUserResponse(rs, userType);
                }
            }
        } catch (SQLException e) { // 데이터베이스 연결 실패 시 예외 처리
            logger.error("로그인 중 데이터베이스 연결 실패: ", e);
            throw new RuntimeException("인증 실패", e);
        }
        return null;
    }

    // 사용자 유형에 따라 적절한 SQL 쿼리를 빌드하는 메서드
    private String buildAuthQuery(String userType) {
        return switch (userType) {
            case "student" -> "SELECT student_id, name, major, score FROM students WHERE student_id = ? AND passwords = ?";
            case "professor" -> "SELECT professor_id, name, major FROM professors WHERE professor_id = ? AND passwords = ?";
            case "admin" -> "SELECT admin_id, name FROM admins WHERE admin_id = ? AND passwords = ?";
            default -> throw new IllegalArgumentException("Invalid user type");
        };
    }

    // PreparedStatement에 사용자 ID와 비밀번호를 설정하는 메서드
    private void setQueryParameters(PreparedStatement pstmt, String id, String password, String userType) throws SQLException {
        if (userType.equals("admin")) {
            pstmt.setString(1, id);
        } else {
            pstmt.setInt(1, Integer.parseInt(id));
        }
        pstmt.setString(2, password);
    }

    // ResultSet에서 사용자 정보를 추출하여 Map으로 반환하는 메서드
    private Map<String, Object> buildUserResponse(ResultSet rs, String userType) throws SQLException {
        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("userType", userType);

        // 사용자 유형에 따라 필요한 정보를 Map에 추가
        switch (userType) {
            case "student" -> {
                userDetails.put("id", rs.getInt("student_id"));
                userDetails.put("name", rs.getString("name"));
                userDetails.put("major", rs.getString("major"));
                userDetails.put("score", rs.getFloat("score"));
            }
            case "professor" -> {
                userDetails.put("id", rs.getInt("professor_id"));
                userDetails.put("name", rs.getString("name"));
                userDetails.put("major", rs.getString("major"));
            }
            case "admin" -> {
                userDetails.put("id", rs.getString("admin_id"));
                userDetails.put("name", rs.getString("name"));
            }
        }

        return userDetails;
    }
}