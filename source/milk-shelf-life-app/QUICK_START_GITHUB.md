# Quick GitHub Setup Commands

## 1️⃣ Create GitHub Repository First
Go to: https://github.com/new
- Name: milk-shelf-life-monitoring
- Don't initialize with README
- Click "Create repository"

## 2️⃣ Run These Commands

```bash
# Navigate to project directory
cd /workspace/milk-shelf-life-app

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Milk Shelf Life Monitoring System with IoT, ML, and 7 QC charts"

# Add your GitHub repository (REPLACE WITH YOUR URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## 3️⃣ Example (Replace with Your Info)

```bash
cd /workspace/milk-shelf-life-app
git init
git add .
git commit -m "Initial commit: Milk Shelf Life Monitoring System"
git remote add origin https://github.com/johndoe/milk-shelf-life-monitoring.git
git branch -M main
git push -u origin main
```

## ✅ Done!

Your code is now on GitHub. Share the repository URL with your team!

---

## 🔒 Security Reminder

The .gitignore file is already configured to exclude:
- ✅ .env files (credentials are safe)
- ✅ node_modules
- ✅ build files
- ✅ sensitive config files

Your Supabase credentials will NOT be uploaded to GitHub.

---

## 📝 Daily Workflow

After making changes:
```bash
git add .
git commit -m "Description of changes"
git push
```

For more detailed instructions, see GITHUB_SETUP.md
