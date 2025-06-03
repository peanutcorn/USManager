package com.univm.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Service
public class RegisteredCoursesService {

    // 데이터베이스 연결을 위한 DataSource 주입
    @Autowired
    private DataSource dataSource;

    public List<Map<String, Object>> Confirmed_Subject_view(String studentId) {
        List<Map<String, Object>> courses = new ArrayList<>();
        String query = """
            SELECT s.subject_id, s.subject_name, p.name as professor_name, 
                   s.major, COUNT(e.student_id) as current_students
            FROM subjects s
            JOIN enrollments e ON s.subject_id = e.subject_id
            JOIN professors p ON s.professor_id = p.professor_id
            WHERE e.student_id = ?
            GROUP BY s.subject_id
        """;

        // 데이터베이스 연결 및 쿼리 실행
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setString(1, studentId);

            // 쿼리 실행 및 결과 처리
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) { // 결과 집합에서 각 행을 읽어 Map에 저장
                    Map<String, Object> course = new HashMap<>();
                    course.put("subjectId", rs.getString("subject_id"));
                    course.put("subjectName", rs.getString("subject_name"));
                    course.put("professorName", rs.getString("professor_name"));
                    course.put("major", rs.getString("major"));
                    course.put("currentStudents", rs.getInt("current_students"));
                    courses.add(course);
                }
            }
        } catch (SQLException e) { // SQL 예외 처리
            throw new RuntimeException("수강신청 목록 패칭 에러", e);
        }
        return courses;
    }

    // 수강 취소 메서드
    public void drop_sub(String studentId, String subjectId) {
        String query = "DELETE FROM enrollments WHERE student_id = ? AND subject_id = ?";

        // 데이터베이스 연결 및 쿼리 실행
        try (Connection conn = dataSource.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setString(1, studentId);
            pstmt.setString(2, subjectId);

            // 쿼리 실행 및 결과 처리
            int affectedRows = pstmt.executeUpdate();
            if (affectedRows == 0) {
                throw new RuntimeException("수강 취소 실패");
            }
        } catch (SQLException e) { // SQL 예외 처리
            throw new RuntimeException("수강 취소 에러", e);
        }
    }
}