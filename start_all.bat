@echo off
echo ========================================================
echo   Starting AapnoKhet B2B Pure Food E-Commerce Platform
echo ========================================================
echo.

echo 1. Starting Python FastAPI Backend on http://localhost:8000 ...
start "AapnoKhet Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo 2. Starting Next.js Frontend on http://localhost:3000 ...
start "AapnoKhet Frontend (Next.js)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo Both services are launching:
echo   - Backend API Docs:   http://localhost:8000/docs
echo   - Frontend Portal:    http://localhost:3000
echo ========================================================
pause
