@echo off
echo.
echo ========================================
echo  Receptionist Frontend - Quick Start
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo Dependencies installed successfully!
    echo.
)

REM Start the development server
echo Starting Angular development server...
echo.
echo Frontend will be available at: http://localhost:4200
echo Backend should be running at: http://localhost:8080
echo.
call npm start
