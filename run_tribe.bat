@echo off
setlocal EnableDelayedExpansion
title Tribe App - Full Stack Launcher
color 0A

echo ==========================================
echo        TRIBE APP - FULL STACK LAUNCHER
echo ==========================================
echo.

:: Configurar variables de entorno
set "ANDROID_HOME=C:\Users\juani\AppData\Local\Android\Sdk"
set "ADB=%ANDROID_HOME%\platform-tools\adb.exe"
set "PATH=%PATH%;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator"

:: Directorios del proyecto
set "BACKEND_DIR=E:\Otro\portfolio\tribe-app\TribeBackend"
set "FRONTEND_DIR=E:\Otro\portfolio\tribe-app\TribeFrontend"
set "DEV_FRONTEND_DIR=C:\dev\TribeFrontend"

:: Verificar que ADB existe
if not exist "%ADB%" (
    echo [ERROR] ADB no encontrado en: %ADB%
    echo         Verifica que Android SDK este instalado correctamente.
    pause
    exit /b 1
)

:: ==========================================
:: PASO 1: Verificar dispositivo Android
:: ==========================================
echo [1/6] Verificando dispositivo Android...
"%ADB%" devices > temp_devices.txt 2>&1
findstr /C:"device" temp_devices.txt | findstr /V /C:"List" > temp_connected.txt
set DEVICE_COUNT=0
for /f %%a in (temp_connected.txt) do set /a DEVICE_COUNT+=1

if %DEVICE_COUNT% EQU 0 (
    echo      [ERROR] No hay dispositivos conectados.
    echo      Conecta un dispositivo Android o inicia un emulador.
    del temp_devices.txt temp_connected.txt 2>nul
    pause
    exit /b 1
)

:: Obtener ID del dispositivo
for /f "tokens=1" %%d in (temp_connected.txt) do set "DEVICE_ID=%%d"
echo      Dispositivo encontrado: %DEVICE_ID%
del temp_devices.txt temp_connected.txt 2>nul
echo.

:: ==========================================
:: PASO 2: Matar procesos Node existentes
:: ==========================================
echo [2/6] Limpiando procesos anteriores...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo      Procesos Node terminados.
) else (
    echo      No habia procesos Node activos.
)
timeout /t 2 /nobreak >nul
echo.

:: ==========================================
:: PASO 3: Configurar ADB Reverse
:: ==========================================
echo [3/6] Configurando ADB reverse para puertos...

:: Limpiar configuraciones anteriores
"%ADB%" -s %DEVICE_ID% reverse --remove-all >nul 2>&1

:: Configurar puerto 8080 (Backend)
"%ADB%" -s %DEVICE_ID% reverse tcp:8080 tcp:8080 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo      Puerto 8080 [Backend]  - OK
) else (
    echo      Puerto 8080 [Backend]  - ERROR
)

:: Configurar puerto 8081 (Metro)
"%ADB%" -s %DEVICE_ID% reverse tcp:8081 tcp:8081 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo      Puerto 8081 [Metro]    - OK
) else (
    echo      Puerto 8081 [Metro]    - ERROR
)

:: Verificar configuracion
echo      Puertos configurados:
"%ADB%" -s %DEVICE_ID% reverse --list
echo.

:: ==========================================
:: PASO 4: Sincronizar Frontend
:: ==========================================
echo [4/6] Sincronizando frontend a directorio de desarrollo...

:: Verificar que existe el directorio fuente
if not exist "%FRONTEND_DIR%\app" (
    echo      [ERROR] Directorio fuente no encontrado: %FRONTEND_DIR%\app
    pause
    exit /b 1
)

:: Crear directorio destino si no existe
if not exist "%DEV_FRONTEND_DIR%" mkdir "%DEV_FRONTEND_DIR%"

:: Sincronizar archivos
xcopy "%FRONTEND_DIR%\app" "%DEV_FRONTEND_DIR%\app" /E /Y /Q >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo      Archivos sincronizados correctamente.
) else (
    echo      [WARN] Algunos archivos no se pudieron sincronizar.
)
echo.

:: ==========================================
:: PASO 5: Iniciar Backend
:: ==========================================
echo [5/6] Iniciando Backend (MongoDB + Express)...

:: Verificar que package.json existe
if not exist "%BACKEND_DIR%\package.json" (
    echo      [ERROR] package.json no encontrado en: %BACKEND_DIR%
    pause
    exit /b 1
)

:: Iniciar backend en nueva ventana
start "Tribe Backend" cmd /k "cd /d %BACKEND_DIR% && echo Iniciando servidor backend... && npm start"
echo      Backend iniciando en http://localhost:8080

:: Esperar a que el backend inicie
echo      Esperando a que el backend este listo...
timeout /t 4 /nobreak >nul
echo.

:: ==========================================
:: PASO 6: Iniciar Metro y App
:: ==========================================
echo [6/6] Iniciando Frontend (React Native + Metro)...

:: Verificar que package.json existe en dev
if not exist "%DEV_FRONTEND_DIR%\package.json" (
    echo      [ERROR] package.json no encontrado en: %DEV_FRONTEND_DIR%
    echo      Ejecuta 'npm install' en ese directorio primero.
    pause
    exit /b 1
)

:: Iniciar Metro en nueva ventana
start "Tribe Metro" cmd /k "cd /d %DEV_FRONTEND_DIR% && echo Iniciando Metro Bundler... && npx react-native start --reset-cache"
echo      Metro Bundler iniciando en http://localhost:8081

:: Esperar a que Metro este listo
echo      Esperando a que Metro este listo...
timeout /t 8 /nobreak >nul
echo.

:: ==========================================
:: Instalar y lanzar la app
:: ==========================================
echo ==========================================
echo      Instalando aplicacion en dispositivo...
echo ==========================================

cd /d %DEV_FRONTEND_DIR%

:: Verificar si existe APK precompilada
set "APK_PATH=%DEV_FRONTEND_DIR%\android\app\build\outputs\apk\debug\app-debug.apk"

if exist "%APK_PATH%" (
    echo      APK encontrada, instalando directamente...
    "%ADB%" -s %DEVICE_ID% install -r "%APK_PATH%" >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo      APK instalada correctamente.
        goto :launch_app
    ) else (
        echo      [WARN] Fallo instalacion directa, compilando...
    )
)

:: Compilar si no hay APK o fallo la instalacion
echo      Compilando APK (esto puede tardar)...
call npx react-native run-android --no-packager 2>nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo      [WARN] Gradle fallo. Intentando instalacion manual...
    
    :: Intentar instalar con adb directamente (evita error de Gradle)
    if exist "%APK_PATH%" (
        "%ADB%" -s %DEVICE_ID% install -r "%APK_PATH%"
        if %ERRORLEVEL% EQU 0 (
            echo      APK instalada manualmente.
            goto :launch_app
        )
    )
    
    echo      [ERROR] No se pudo instalar la APK.
    echo      Abre la app manualmente desde el dispositivo.
    goto :show_status
)

:launch_app
echo      Lanzando aplicacion...
timeout /t 2 /nobreak >nul

:: Forzar detener la app si esta corriendo
"%ADB%" -s %DEVICE_ID% shell am force-stop com.tribeapp >nul 2>&1

:: Lanzar la app
"%ADB%" -s %DEVICE_ID% shell am start -n com.tribeapp/.MainActivity >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo      App lanzada correctamente!
) else (
    echo      [INFO] Abre la app manualmente desde el dispositivo.
)

:show_status
echo.
echo ==========================================
echo          TRIBE APP INICIADA
echo ==========================================
echo.
echo   Backend:    http://localhost:8080
echo   Metro:      http://localhost:8081
echo   Dispositivo: %DEVICE_ID%
echo.
echo   NOTA: Si la app muestra pantalla roja,
echo   agita el dispositivo y selecciona
echo   "Reload" para recargar el bundle.
echo.
echo   Para detener todos los servicios:
echo   Ejecuta stop_tribe.bat
echo ==========================================
echo.
pause
