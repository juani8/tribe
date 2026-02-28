@echo off
title Tribe App - Stop All Services
color 0C

echo ==========================================
echo       TRIBE APP - DETENER SERVICIOS
echo ==========================================
echo.

:: Configurar ADB
set "ANDROID_HOME=C:\Users\juani\AppData\Local\Android\Sdk"
set "ADB=%ANDROID_HOME%\platform-tools\adb.exe"

echo [1/4] Deteniendo procesos de Node.js...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo       Procesos Node.js detenidos.
) else (
    echo       No habia procesos Node.js activos.
)
echo.

echo [2/4] Cerrando ventanas de Tribe...
taskkill /F /FI "WINDOWTITLE eq Tribe*" >nul 2>&1
echo       Ventanas cerradas.
echo.

echo [3/4] Deteniendo app en dispositivo...
if exist "%ADB%" (
    "%ADB%" shell am force-stop com.tribeapp >nul 2>&1
    echo       App detenida en dispositivo.
) else (
    echo       [SKIP] ADB no encontrado.
)
echo.

echo [4/4] Limpiando puertos ADB...
if exist "%ADB%" (
    "%ADB%" reverse --remove-all >nul 2>&1
    echo       Puertos ADB liberados.
) else (
    echo       [SKIP] ADB no encontrado.
)
echo.

echo ==========================================
echo      TODOS LOS SERVICIOS DETENIDOS
echo ==========================================
echo.
pause
