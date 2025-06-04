@echo off
echo Checking MySQL service status...

REM MySQL 서비스 상태 확인
sc query MySQL80

REM 서비스가 중지되어 있다면 시작
net start MySQL80

echo MySQL service check completed!