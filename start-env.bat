@echo off
echo Setting up environment variables...

REM 데이터베이스 설정
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=test_db
set DB_USER=root
set DB_PASSWORD=1645

REM 서버 포트 설정
set SERVER_PORT=8080
set CLIENT_PORT=3000

echo Environment variables have been set!