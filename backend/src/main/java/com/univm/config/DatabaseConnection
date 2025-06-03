package com.univm.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DatabaseConnection {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseConnection.class);

    // 백엔드용 MySQL 데이터베이스 연결 정보
    private static final String URL = "jdbc:mysql://localhost:3306/test_db";
    private static final String USER = "root";
    private static final String PASSWORD = "1645";

    public static Connection getConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            logger.info("연결 성공");
            return conn;
        } catch (ClassNotFoundException | SQLException e) {
            logger.error("연결 에러: ", e);
            throw new RuntimeException("연결 안됨", e);
        }
    }
}