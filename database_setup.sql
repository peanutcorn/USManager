-- 기존 데이터베이스 삭제 후 새로 생성
DROP DATABASE IF EXISTS test_db;
CREATE DATABASE test_db;
USE test_db;

-- 학생 테이블
CREATE TABLE students (
                          student_id INT(8) PRIMARY KEY,
                          name VARCHAR(50) NOT NULL,
                          passwords VARCHAR(100) NOT NULL,
                          major VARCHAR(50),
                          score FLOAT
);

-- 교수 테이블
CREATE TABLE professors (
                            professor_id INT(10) PRIMARY KEY,
                            name VARCHAR(50) NOT NULL,
                            passwords VARCHAR(100) NOT NULL,
                            major VARCHAR(50)
);

-- 관리자 테이블
CREATE TABLE admins (
                        admin_id VARCHAR(7) PRIMARY KEY,
                        name VARCHAR(50) NOT NULL,
                        passwords VARCHAR(100) NOT NULL
);

-- 테스트 데이터 삽입
INSERT INTO students (student_id, name, passwords, major, score) VALUES
                                                                     ('12345678', 'J1', '123', '컴', 3.8),
                                                                     ('23456789', 'J2', '456', '공', 4.0);

INSERT INTO professors (professor_id, name, passwords, major) VALUES
                                                                  ('1234567890', 'D1', '123', '지'),
                                                                  ('1919191919', 'D2', '456', '생');
