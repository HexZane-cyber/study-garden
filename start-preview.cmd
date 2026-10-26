@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if not errorlevel 1 (
  py -3 tools\preview.py
) else (
  python tools\preview.py
)
if errorlevel 1 (
  echo.
  echo Preview failed. Check Python installation and the message above.
  pause
)
endlocal
