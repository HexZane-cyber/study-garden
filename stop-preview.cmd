@echo off
setlocal
set PYTHONUTF8=1
chcp 65001 >nul
cd /d "%~dp0"
if exist ".venv\Scripts\python.exe" (
  ".venv\Scripts\python.exe" tools\preview.py --stop %*
  goto result
)
where py >nul 2>nul
if not errorlevel 1 (
  py -3 tools\preview.py --stop %*
) else (
  python tools\preview.py --stop %*
)
:result
if errorlevel 1 (
  echo.
  echo Could not stop this preview safely. See the message above.
  pause
)
endlocal
