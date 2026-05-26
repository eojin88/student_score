-- 한글(utf8mb4) 강제 설정
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS kopo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kopo;

-- 학생 테이블 (고유 ID와 이름만 저장)
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 성적 테이블 (누구의 성적인지 알기 위해 student_id를 외래키로 사용)
CREATE TABLE IF NOT EXISTS scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    korean INT NOT NULL,
    english INT NOT NULL,
    math INT NOT NULL,
    -- 점수의 주인이 students 테이블의 누구인지 연결해주는 고리 (외래키)
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테스트용 학생 초기 데이터 6명 추가 (id는 1번부터 6번까지 자동 부여됨)
INSERT INTO students (name) VALUES ('가'), ('나'), ('다'), ('라'), ('마'), ('바');

-- 위에서 만든 학생 1~6번의 성적 데이터 추가
INSERT INTO scores (student_id, korean, english, math) VALUES 
(1, 30, 40, 20),
(2, 10, 30, 30),
(3, 40, 20, 20),
(4, 40, 10, 30),
(5, 10, 20, 30),
(6, 20, 40, 40);