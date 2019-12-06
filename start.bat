@echo off

IF "%1" == "--update" (set UPDATE_TOOLS=false) else (set UPDATE_TOOLS=true)

choco -v
IF %ERRORLEVEL% NEQ 0 (
    echo errorlevel %ERRORLEVEL%
    @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
)

call npm -v
IF %ERRORLEVEL% NEQ 0 (
    echo errorlevel %ERRORLEVEL%
    choco install nodejs
)

if "%UPDATE_TOOLS%" == "true" (
    call npm i -g npm
)

npx http-server ./browser -c-1 -p 8889
cd..
pause