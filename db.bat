@echo off
echo.

if "%npm_package_config_db_port%"=="" (
    set npm_package_config_db_port=27017
)
if "%npm_package_config_db_path%"=="" (
    if exist C:\mongodb\bin\mongod.exe (
        set npm_package_config_db_path=C:\mongodb\bin\mongod.exe
    ) else (
        echo Mongo is not found in "C:\mongodb", check config.db.path in package.json
        echo.
        exit /b 1
    )
)

tasklist | find /i "mongod.exe" >nul

if "%ERRORLEVEL%"=="0" (

    echo Mongo is running already
    echo.
    exit /b 0

) else (
    
    if not exist data (
        mkdir data
    )

    echo Starting Mongo...
    start "mongod" "%npm_package_config_db_path%" "--config" "config\mongod.cfg" "--port" "%npm_package_config_db_port%"

    ping -n 5 127.0.0.1 >nul 
    tasklist | find /i "mongod.exe" >nul
    
    if ERRORLEVEL 1 (
        echo ...failed
        echo.
        exit /b 1
    )
    
    echo ...done

    rem more options on http://docs.mongodb.org/manual/reference/configuration-options/
    rem to start a service, add next to the launching command line:
    rem  " --install" --serviceName {NAME=MongoDB} --serviceDisplayName {DISPNAME=MongoDB} 
    rem then uncomment the next line:
    rem net start mongod
    rem
    rem to remove the service, uncomment the next 2 lines:
    rem net stop MongoDB
    rem "C:\mongodb\bin\mongod.exe" --remove
    rem
    rem More here: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/
)

echo.
exit /b 0
