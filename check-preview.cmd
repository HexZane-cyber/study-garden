@echo off
setlocal
set PYTHONUTF8=1
chcp 65001 >nul
cd /d "%~dp0"
if exist ".venv\Scripts\python.exe" (
  ".venv\Scripts\python.exe" tools\preview.py --diagnose %*
  goto result
)
where py >nul 2>nul
if not errorlevel 1 (
  py -3 tools\preview.py --diagnose %*
) else (
  python tools\preview.py --diagnose %*
)
:result
set "previewExit=%errorlevel%"
echo.
pause
exit /b %previewExit%
