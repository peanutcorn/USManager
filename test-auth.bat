@echo off
echo Testing Authentication API...
echo Current time: %date% %time%

REM Run PowerShell test script
powershell -ExecutionPolicy Bypass -File .\Test-API.ps1

pause