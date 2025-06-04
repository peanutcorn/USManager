@echo off
echo Starting Univm System...
echo Current time: %date% %time%

REM 백엔드 서버 시작
cd backend
start mvn spring-boot:run

REM 프론트엔드 서버 시작
cd ..\frontend
start npm start

echo Servers are starting...
echo Please wait a moment for the services to fully start