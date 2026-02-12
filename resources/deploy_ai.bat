@echo off
echo ===================================================
echo   Dairy Guard AI Deployment Helper
echo ===================================================
echo.
echo 1. Logging into Supabase...
cd source/milk-shelf-life-app
call npx supabase login

echo.
echo 2. Setting OpenAI Key from .env.local...
call npx supabase secrets set --env-file supabase/functions/.env.local

echo.
echo 3. Deploying Dairy Doctor Function...
call npx supabase functions deploy dairy-doctor --no-verify-jwt

echo.
echo ===================================================
echo   Deployment Complete!
echo ===================================================
pause
