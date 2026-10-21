@echo off
chcp 65001 >nul
node scripts/git-save.js %*
