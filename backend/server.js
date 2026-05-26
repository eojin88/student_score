const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

//  CORS 에러 방지 및 JSON 데이터 파싱 설정
app.use(cors());
app.use(express.json());

// 도커 컴포즈 야말 파일에 적어둔 환경변수를 기반으로 데이터베이스 연결 정보 세팅
const dbConfig = {
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'kopouser',
    password: process.env.DB_PASSWORD || 'kopouser',
    database: process.env.DB_NAME || 'kopo',
    charset: 'utf8mb4' // 한글 깨져서 강제설정 
};

app.get('/api/students', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        //  두 테이블 JOIN 쿼리문
        const [rows] = await connection.query(`
            SELECT s.id, s.name, sc.korean, sc.english, sc.math 
            FROM students s
            JOIN scores sc ON s.id = sc.student_id
        `);
        await connection.end();

        // 구현: 등급 계산 알고리즘 
        let processed = rows.map(student => {
            const total = student.korean + student.english + student.math;
            const avg = (total / 3).toFixed(2);
            
            // 평균 점수 기반 등급(A~F) 계산 
            let grade = 'F';
            if (avg >= 90) grade = 'A';
            else if (avg >= 80) grade = 'B';
            else if (avg >= 70) grade = 'C';
            else if (avg >= 60) grade = 'D';

            return {
                id: student.id,
                name: student.name,
                korean: student.korean,
                english: student.english,
                math: student.math,
                total,
                avg,
                grade // 등급 추가
            };
        });

        // 총점 기준 내림차순 정렬 후 등수 매기기
        processed.sort((a, b) => b.total - a.total);
        processed.forEach((student, index) => {
            student.rank = index + 1;
        });

        res.json(processed);
    } catch (error) {
        console.error('조회 에러:', error);
        res.status(500).json({ error: '데이터베이스 조회에 실패했습니다.' });
    }
});

app.post('/api/students', async (req, res) => {
    const { name, korean, english, math } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    try {
        // 하나라도 실패하면 롤백하기 위해 트랜잭션 시작
        await connection.beginTransaction();

        // students 테이블에 이름 먼저 저장
        const [studentResult] = await connection.query(
            'INSERT INTO students (name) VALUES (?)', [name]
        );
        const studentId = studentResult.insertId; // 방금 생성된 학생의 고유번호 추출

        //  추출한 고유번호를 scores 테이블에 저장
        await connection.query(
            'INSERT INTO scores (student_id, korean, english, math) VALUES (?, ?, ?, ?)',
            [studentId, korean, english, math]
        );

        // 둘 다 성공하면 최종 반영
        await connection.commit();
        res.status(201).json({ message: '학생 성적 등록 성공!' });
    } catch (error) {
        // 에러 발생 시 진행했던 내역 취소
        await connection.rollback();
        console.error('등록 에러:', error);
        res.status(500).json({ error: '학생 성적 등록에 실패했습니다.' });
    } finally {
        await connection.end();
    }
});

app.put('/api/students/:id', async (req, res) => {
    const studentId = req.params.id;
    const { name, korean, english, math } = req.body;
    const connection = await mysql.createConnection(dbConfig);

    try {
        await connection.beginTransaction();

        // students 테이블 이름 수정
        await connection.query('UPDATE students SET name = ? WHERE id = ?', [name, studentId]);
        
        // scores 테이블 점수 수정
        await connection.query(
            'UPDATE scores SET korean = ?, english = ?, math = ? WHERE student_id = ?',
            [korean, english, math, studentId]
        );

        await connection.commit();
        res.json({ message: '성적 수정 성공' });
    } catch (error) {
        await connection.rollback();
        console.error('수정 에러:', error);
        res.status(500).json({ error: '성적 수정에 실패했습니다.' });
    } finally {
        await connection.end();
    }
});

app.delete('/api/students/:id', async (req, res) => {
    const studentId = req.params.id;
    try {
        const connection = await mysql.createConnection(dbConfig);

        await connection.query('DELETE FROM students WHERE id = ?', [studentId]);
        
        await connection.end();
        res.json({ message: '학생 데이터 삭제 성공' });
    } catch (error) {
        console.error('삭제 에러:', error);
        res.status(500).json({ error: '데이터 삭제에 실패했습니다.' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`백엔드 서버 가동 중: http://localhost:${PORT}`);
});