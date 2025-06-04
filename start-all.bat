@echo off
echo Starting Univm System...
echo Current time: %date% %time%

REM MySQL 서비스 확인 및 시작
call check-mysql.bat

REM 환경 변수 설정
call start-env.bat

REM 백엔드 빌드 및 실행
cd backend
call mvn clean install
start mvn spring-boot:run

REM 프론트엔드 실행
cd ..\frontend
start npm install
start npm start

echo All services are starting...
echo Please wait a moment for everything to initialize
echo.
echo Access the application at: http://localhost:3000