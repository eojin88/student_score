# 1. Node.js 
FROM node:24

# 2. 작업 폴더 지정
WORKDIR /app

# 3. 패키지 파일 복사 및 라이브러리 설치 + PM2 전역 설치 
COPY package*.json ./
RUN npm install && npm install -g pm2

# 4. 소스코드 복사
COPY . .

# 5. 8080 포트 개방 및 PM2로 서버 실행 
EXPOSE 8080
CMD ["pm2-runtime", "start", "server.js"]