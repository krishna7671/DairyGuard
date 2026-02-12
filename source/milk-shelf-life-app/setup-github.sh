#!/bin/bash
# GitHub Repository Setup Script for Milk Shelf Life Monitoring System

echo "🥛 Milk Shelf Life Monitoring - GitHub Setup"
echo "==========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Ask for GitHub repository URL
echo ""
echo "Please enter your GitHub repository URL"
echo "Example: https://github.com/yourusername/milk-shelf-life-monitoring.git"
read -p "GitHub URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ Error: Repository URL is required"
    exit 1
fi

# Add all files
echo ""
echo "📝 Staging files..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Milk Shelf Life Monitoring System

Features:
- Real-time IoT sensor monitoring
- ML-powered shelf life predictions
- 7 Quality Control Charts
- Alert system and analytics
- Mobile-responsive design
- Supabase backend integration"

# Add remote origin
echo "🔗 Adding GitHub remote..."
git remote remove origin 2>/dev/null  # Remove if exists
git remote add origin "$REPO_URL"

# Rename branch to main (if needed)
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Renaming branch to 'main'..."
    git branch -M main
fi

# Push to GitHub
echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Success! Your code is now on GitHub"
echo "🔗 Repository: $REPO_URL"
echo ""
echo "Next steps:"
echo "1. Visit your GitHub repository"
echo "2. Add environment variables to .env (don't commit this file!)"
echo "3. Configure GitHub Actions for CI/CD (optional)"
echo "4. Share with your team!"
