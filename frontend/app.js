const API_URL = 'http://localhost:8080/api/students';

// 결과 조회: 백엔드에서 데이터를 가져와서 표에 그리기
async function loadStudents() {
    try {
        const response = await fetch(API_URL);
        const students = await response.json();

        const tbody = document.getElementById('student-table-body');
        tbody.innerHTML = ''; // 기존 표 내용 싹 비우기

        students.forEach(student => {
            const row = `<tr>
                <td><strong>${student.rank}등</strong></td>
                <td>${student.name}</td>
                <td>${student.korean}</td>
                <td>${student.english}</td>
                <td>${student.math}</td>
                <td>${student.total}</td>
                <td>${student.avg}</td>
                <td style="color: ${student.grade === 'F' ? 'red' : 'blue'}; font-weight: bold;">${student.grade}</td>
                <td>
                    <button class="btn-edit" onclick="updateStudent(${student.id}, '${student.name}')">수정</button>
                    <button class="btn-delete" onclick="deleteStudent(${student.id}, '${student.name}')">삭제</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('조회 에러:', error);
    }
}

// 신규 등록: 입력창의 데이터를 모아서 백엔드로 보내기
async function addStudent() {
    const name = document.getElementById('newName').value;
    const korean = document.getElementById('newKor').value;
    const english = document.getElementById('newEng').value;
    const math = document.getElementById('newMath').value;

    if (!name || !korean || !english || !math) {
        return alert('모든 칸을 입력해 주세요!');
    }

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                korean: parseInt(korean),
                english: parseInt(english),
                math: parseInt(math)
            })
        });

        // 등록 성공 후 입력창 비우고 표 새로고침
        document.getElementById('newName').value = '';
        document.getElementById('newKor').value = '';
        document.getElementById('newEng').value = '';
        document.getElementById('newMath').value = '';
        loadStudents();
    } catch (error) {
        alert('등록 중 오류가 발생했습니다.');
    }
}

// 정보 수정: 팝업창을 띄워 새로운 점수 입력받기
async function updateStudent(id, name) {
    const kor = prompt(`${name} 학생의 새로운 [국어] 점수를 입력하세요:`);
    const eng = prompt(`${name} 학생의 새로운 [영어] 점수를 입력하세요:`);
    const math = prompt(`${name} 학생의 새로운 [수학] 점수를 입력하세요:`);

    if (kor && eng && math) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name, // 이름은 그대로 유지
                    korean: parseInt(kor),
                    english: parseInt(eng),
                    math: parseInt(math)
                })
            });
            loadStudents(); // 수정 후 표 새로고침
        } catch (error) {
            alert('수정 중 오류가 발생했습니다.');
        }
    }
}

// 정보 삭제: 백엔드에 삭제 요청 보내기
async function deleteStudent(id, name) {
    if (confirm(`정말 ${name} 학생의 성적을 삭제하시겠습니까?`)) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            loadStudents(); // 삭제 후 표 새로고침
        } catch (error) {
            alert('삭제 중 오류가 발생했습니다.');
        }
    }
}

// 브라우저가 켜지자마자 자동으로 한 번 실행
window.onload = loadStudents;