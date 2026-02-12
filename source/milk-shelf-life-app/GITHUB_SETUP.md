# 🚀 GitHub Setup Guide

Complete guide for connecting your Milk Shelf Life Monitoring System to GitHub.

## Quick Setup (Automated)

### Using the Setup Script (Easiest)

1. **Navigate to the project directory**
```bash
cd /workspace/milk-shelf-life-app
```

2. **Make the script executable**
```bash
chmod +x setup-github.sh
```

3. **Run the script**
```bash
./setup-github.sh
```

4. **Enter your GitHub repository URL when prompted**
```
Example: https://github.com/yourusername/milk-shelf-life-monitoring.git
```

The script will automatically:
- Initialize Git (if not already done)
- Stage all files
- Create initial commit
- Add GitHub remote
- Push to main branch

---

## Manual Setup (Step-by-Step)

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in repository details:
   - **Name**: `milk-shelf-life-monitoring`
   - **Description**: "IoT-powered milk shelf life prediction system with ML and quality control charts"
   - **Visibility**: Choose Public or Private
   - **DON'T** check "Initialize with README" (we already have one)
3. Click **"Create repository"**

### Step 2: Initialize Git Locally

```bash
cd /workspace/milk-shelf-life-app

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: Milk Shelf Life Monitoring System"
```

### Step 3: Connect to GitHub

```bash
# Add your GitHub repository as remote
# Replace <USERNAME> and <REPO_NAME> with your actual values
git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Example**:
```bash
git remote add origin https://github.com/johndoe/milk-shelf-life-monitoring.git
git branch -M main
git push -u origin main
```

### Step 4: Verify Upload

Visit your GitHub repository URL to confirm all files are uploaded.

---

## Using SSH Instead of HTTPS

If you prefer SSH authentication:

### Setup SSH Key (First Time)

1. **Generate SSH key** (skip if you already have one)
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. **Add SSH key to ssh-agent**
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

3. **Copy public key**
```bash
cat ~/.ssh/id_ed25519.pub
```

4. **Add to GitHub**
   - Go to GitHub Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste your public key

### Connect Using SSH

```bash
# Add remote using SSH URL
git remote add origin git@github.com:<USERNAME>/<REPO_NAME>.git

# Push to GitHub
git push -u origin main
```

---

## Important: Environment Variables

⚠️ **NEVER commit `.env` files to GitHub!**

The `.gitignore` file is configured to exclude:
- `.env`
- `.env.local`
- `.env.production`
- All `*.env` files

### For Team Members

After cloning the repository, create a `.env` file:

```bash
# Copy example environment file
cp .env.example .env

# Edit with your Supabase credentials
nano .env  # or use your preferred editor
```

Add these variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Repository Structure on GitHub

After pushing, your GitHub repository will have:

```
milk-shelf-life-monitoring/
├── README.md                # Project documentation
├── package.json            # Dependencies
├── vite.config.ts          # Build configuration
├── tailwind.config.js      # Styling configuration
├── tsconfig.json           # TypeScript config
├── .gitignore             # Git ignore rules
├── public/                # Static assets
├── src/                   # Application source code
│   ├── components/        # Reusable components
│   ├── pages/            # Application pages
│   ├── lib/              # Utilities
│   └── App.tsx           # Main app component
└── dist/                  # Build output (ignored by git)
```

---

## Workflow Commands

### After Making Changes

```bash
# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "Add new feature: real-time alerts"

# Push to GitHub
git push
```

### Pull Latest Changes

```bash
# Pull changes from GitHub
git pull origin main
```

### Create Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/new-sensor-support

# Work on feature...

# Push feature branch
git push -u origin feature/new-sensor-support
```

---

## Collaboration Best Practices

### 1. Branch Strategy

```bash
main           # Production-ready code
├── develop    # Integration branch
├── feature/*  # New features
├── bugfix/*   # Bug fixes
└── hotfix/*   # Urgent fixes
```

### 2. Commit Message Convention

```
<type>: <subject>

<body>

Types: feat, fix, docs, style, refactor, test, chore
```

**Examples**:
```bash
git commit -m "feat: add bacterial sensor calibration"
git commit -m "fix: resolve chart rendering issue on mobile"
git commit -m "docs: update API documentation"
```

### 3. Pull Request Process

1. Create feature branch
2. Make changes and commit
3. Push to GitHub
4. Create Pull Request on GitHub
5. Request code review
6. Merge after approval

---

## GitHub Actions (Optional CI/CD)

Create `.github/workflows/deploy.yml` for automated deployment:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test  # if you have tests
```

---

## Troubleshooting

### Error: "remote origin already exists"

```bash
git remote remove origin
git remote add origin <YOUR_REPO_URL>
```

### Error: "failed to push some refs"

```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### Error: "Permission denied (publickey)"

Your SSH key is not configured. Use HTTPS instead or setup SSH key.

### Large Files Issue

If you have files >100MB:
```bash
# Use Git LFS
git lfs install
git lfs track "*.large-file-extension"
```

---

## Additional Resources

- **GitHub Docs**: https://docs.github.com
- **Git Basics**: https://git-scm.com/book/en/v2
- **GitHub Flow**: https://guides.github.com/introduction/flow/

---

## Need Help?

If you encounter issues:
1. Check GitHub's status page: https://www.githubstatus.com
2. Review error messages carefully
3. Search GitHub Community: https://github.community
4. Ask your team members

---

**Happy Coding!** 🚀

Your Milk Shelf Life Monitoring System is ready to be shared with the world!
