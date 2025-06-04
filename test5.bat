@echo off
echo Testing univm System API
echo Current time: %date% %time%

echo.
echo 1. Testing database connection...
curl -X GET http://localhost:8080/auth/test

echo.
echo 2. Testing student login...
curl -X POST -H "Content-Type: application/json" -d "{\"id\":\"12345678\",\"password\":\"password123\"}" http://localhost:8080/auth/login

echo.
echo 3. Running full test suite...
powershell -ExecutionPolicy Bypass -File .\Test-API.ps1

echo.
echo All tests completed
pause