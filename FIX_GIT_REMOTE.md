# Fix Git Remote "Already Exists" Error

## The Error
```
fatal: remote origin already exists
```

## Solution

Run these commands one by one:

```bash
cd /workspace/milk-shelf-life-app

# 1. Remove existing remote (if any)
git remote remove origin

# 2. Add your GitHub repository (replace with YOUR URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 3. Push to GitHub
git push -u origin main
```

## Example with Your Repository
Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub details:

```bash
# Remove existing remote
git remote remove origin

# Add correct remote (example)
git remote add origin https://github.com/johndoe/milk-shelf-life-monitoring.git

# Push
git push -u origin main
```

## Verification Commands
Check if remote was added correctly:
```bash
git remote -v
```

Should show:
```
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (fetch)
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (push)
```
