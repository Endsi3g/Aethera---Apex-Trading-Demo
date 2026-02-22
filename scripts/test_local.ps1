# Aethera Apex - Local Test Script
# This script verifies the local development environment and ensures the app builds correctly.

Write-Host "--- Aethera Apex Local Test Script ---" -ForegroundColor Cyan

# 1. Check Node.js and npm
Write-Host "[1/4] Checking environment..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
}
Write-Host "Node.js version: $(node -v)"
Write-Host "npm version: $(npm -v)"

# 2. Check dependencies
Write-Host "[2/4] Checking dependencies..." -ForegroundColor Yellow
if (!(Test-Path "node_modules")) {
    Write-Host "node_modules not found. Installing..."
    npm install
} else {
    Write-Host "node_modules found."
}

# 3. Linting/Type Checking
Write-Host "[3/4] Running Type Check (Linting)..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Error "Type check failed. Please fix the errors in the code."
    exit $LASTEXITCODE
}
Write-Host "Type check passed!" -ForegroundColor Green

# 4. Verifying Build
Write-Host "[4/4] Verifying Build Process..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Check the error logs."
    exit $LASTEXITCODE
}
Write-Host "Build successful!" -ForegroundColor Green

Write-Host "--------------------------------------"
Write-Host "All local tests passed! You are ready to deploy." -ForegroundColor Cyan
Write-Host "To start the development server, run: npm run dev"
