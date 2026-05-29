@echo off
cd /d "%~dp0"
echo Iniciando o site financeiro local...
echo.
if not exist node_modules (
  echo Instalando dependencias. Isso pode demorar na primeira vez.
  npm install
)
echo.
echo Quando o servidor iniciar, abra http://localhost:3000 no navegador.
echo Preparando banco...
npm run db:push
npm run dev
