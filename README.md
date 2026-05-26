cmd 열고 wsl 

-- 프로젝트 폴더로 이동 
cd midterm_project 

-- 도커 실행 
docker compose up -d

-- 도커 종료 
docker compose down 

-- 도커 데이터베이스 리셋 
docker compose down -v 

-- 데이터베이스 실행 
docker exec -it midterm_mysql mysql -u kopouser -p
docker exec -it midterm_mysql mysql --default-character-set=utf8mb4 -u root -p kopo

-- 1. 데이터베이스 선택
USE kopo;

-- 2. 테이블 목록 확인
SHOW TABLES;

-- 3. 데이터 확인 (학생 테이블)
SELECT * FROM students;

-- 4. 성적 테이블 확인
SELECT * FROM scores;

-- 5. JOIN 조회
SELECT s.name, sc.korean, sc.english, sc.math 
FROM students s 
JOIN scores sc ON s.id = sc.student_id;

select * from students as a join scores as b on a.id = b.id;

-- 도커 도는지 확인 명령어 
cmd 열고 docker logs midterm_frontend
또는 docker ps

-- 브라우저 = localhost:3000 
