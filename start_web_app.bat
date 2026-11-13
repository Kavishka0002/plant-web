@echo off
title Plantora Web App
echo Starting Plantora Web App Server...
start "" cmd /c "timeout /t 1 /nobreak >nul & start http://localhost:8080"
node server.js
pause
