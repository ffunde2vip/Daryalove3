@echo off
cd /d "%~dp0"
echo Сайт для Дарьи: http://localhost:8080
start http://localhost:8080
python -m http.server 8080
