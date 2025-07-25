-- 기본
CREATE DATABASE IF NOT EXISTS test_db;

USE test_db;

-- 테이블
CREATE TABLE IF NOT EXISTS students (
                                        student_id INT(8) ZEROFILL PRIMARY KEY,
                                        name VARCHAR(50) NOT NULL,
                                        major VARCHAR(100),
                                        passwords VARCHAR(100) NOT NULL,
                                        score FLOAT DEFAULT 0.0
);

CREATE TABLE IF NOT EXISTS professors (
                                          professor_id INT(10) ZEROFILL PRIMARY KEY,
                                          name VARCHAR(50) NOT NULL,
                                          major VARCHAR(100),
                                          passwords VARCHAR(100) NOT NULL
);

CREATE TABLE admins (
                        admin_id VARCHAR(7) PRIMARY KEY,  -- A + 6자리 정수
                        name VARCHAR(50) NOT NULL,
                        passwords VARCHAR(100) NOT NULL,
                        CONSTRAINT check_admin_id CHECK (admin_id REGEXP '^A[0-9]{6}$')
);

CREATE TABLE IF NOT EXISTS subjects (
                                        subject_id INT AUTO_INCREMENT PRIMARY KEY,
                                        subject_name VARCHAR(100) NOT NULL,
                                        professor_id INT(10) ZEROFILL,
                                        major VARCHAR(50),
                                        max_count INT, -- 최대 수강 인원 추가
                                        FOREIGN KEY (professor_id) REFERENCES professors(professor_id)
);

CREATE TABLE IF NOT EXISTS enrollments (
                                           enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
                                           student_id INT(8) ZEROFILL,
                                           subject_id INT,
                                           FOREIGN KEY (student_id) REFERENCES students(student_id),
                                           FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
                                           enroll_status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS scholarships (
                                            scholarship_id INT AUTO_INCREMENT PRIMARY KEY,
                                            scholarship_name VARCHAR(100) NOT NULL,
                                            amount INT NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
                                      score_id INT AUTO_INCREMENT PRIMARY KEY,
                                      student_id INT(8) ZEROFILL,
                                      subject_id INT,
                                      major_id INT,
                                      scores FLOAT,
                                      ranks CHAR(2),
                                      done_grade BOOLEAN DEFAULT FALSE,
                                      FOREIGN KEY (student_id) REFERENCES students(student_id),
                                      FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

-- 밑엔 테스팅 데이터임

-- 학생
INSERT INTO students (student_id, name, major, passwords, score) VALUES
                                                                     (12345678, '도준식', 'Computer Science', '123', 3.8),
                                                                     (12312312, '이준식', 'Mathematics', '456', 4.0),
                                                                     (13131313, '엄준식', 'Physics', '789', 3.5);

-- 교수
INSERT INTO professors (professor_id, name, major, passwords) VALUES
                                                                  (1234567890, '김제명', 'Computer Science', '123'),
                                                                  (1234121200, '이제명', 'Physics', '456'),
                                                                  (1313131313, '폰제명', 'Mathematics', '789');


-- 과목
INSERT INTO subjects (subject_name, professor_id, major, max_count) VALUES
                                                             ('기초 프로그래밍', 1234567890, 'Computer Science', 30),
                                                             ('기초 물리학', 1234121200, 'Physics', 30),
                                                             ('선형대수학', 1313131313, 'Mathematics', 30);

-- 수강
INSERT INTO enrollments (student_id, subject_id, enroll_status) VALUES
                                                     (12345678, 1, 'NOT'),
                                                     (12345678, 2, 'CONFIRMED'),
                                                     (12312312, 3, 'NOT'),
                                                     (13131313, 2, 'NOT');

-- 장학금(안쓸거)
INSERT INTO scholarships (scholarship_name, amount) VALUES
                                                        ('성적 우수 장학금', 5),
                                                        ('연구 우수 장학금', 3),
                                                        ('국가 장학금', 2);

-- 점수
INSERT INTO scores (student_id, subject_id, major_id, scores, ranks, done_grade) VALUES
                                                                             (12345678, 1, 1, 0,'A', TRUE),
                                                                             (12345678, 2, 1, 0,'B', TRUE),
                                                                             (12312312, 3, 2, 0,'A', TRUE),
                                                                             (13131313, 2, 3, 0,'B', TRUE);

-- 권한 부여
GRANT ALL PRIVILEGES ON test_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;