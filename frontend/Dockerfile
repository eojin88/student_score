# 1. Node.js 환경 사용
FROM node:24

# 2. 작업 폴더 지정
WORKDIR /app

# 3. 정적 파일 서버(serve)만 깔끔하게 설치
RUN npm install -g serve

# 4. 내 PC의 index.html과 app.js 파일을 도커 안으로 복사
COPY . .

# 5. 3000번 포트 개방 및 serve 실행
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]