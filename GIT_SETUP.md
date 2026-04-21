# Git Repository Setup Guide

## Step 1: Initialize Git Repository

```bash
# Initialize git in the project root
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: College Activity Portal with Django backend and Angular frontend"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `college-activity-portal`
3. **Do NOT** initialize with README, .gitignore, or license (we already have these)
4. Click "Create repository"

## Step 3: Connect Local Repository to GitHub

```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/college-activity-portal.git

# Verify remote
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Verify Upload

1. Go to your GitHub repository
2. Verify all files are uploaded
3. Check that `.env` is NOT uploaded (it should be in .gitignore)

## 📁 What Gets Uploaded

✅ **Included:**
- All source code (frontend/ and backend/)
- Docker configuration files
- Documentation files
- .env.example (template)
- .gitignore

❌ **Excluded (by .gitignore):**
- .env (contains secrets)
- node_modules/
- venv/
- __pycache__/
- dist/
- build artifacts

## 🔒 Security Checklist

Before pushing to GitHub:

- [ ] `.env` file is in .gitignore
- [ ] No hardcoded passwords in code
- [ ] No API keys in code
- [ ] SECRET_KEY is not committed
- [ ] Database credentials are not committed
- [ ] `.env.example` has placeholder values only

## 📝 Recommended Branch Strategy

### Main Branch
- Production-ready code
- Protected branch (require pull requests)

### Development Branch
```bash
git checkout -b develop
git push -u origin develop
```

### Feature Branches
```bash
# Create feature branch
git checkout -b feature/new-feature

# Work on feature...
git add .
git commit -m "Add new feature"

# Push feature branch
git push -u origin feature/new-feature

# Create pull request on GitHub
# Merge to develop after review
```

## 🚀 Deployment Workflow

1. **Development**: Work on feature branches
2. **Testing**: Merge to `develop` branch
3. **Production**: Merge `develop` to `main` when ready
4. **Deploy**: Deploy from `main` branch

## 📋 Common Git Commands

```bash
# Check status
git status

# Add files
git add .
git add specific-file.txt

# Commit changes
git commit -m "Your commit message"

# Push changes
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b branch-name

# Switch branches
git checkout branch-name

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename
```

## 🔄 Keeping Repository Updated

```bash
# Pull latest changes
git pull origin main

# Add new changes
git add .

# Commit
git commit -m "Description of changes"

# Push
git push origin main
```

## 📦 Repository Settings (Recommended)

On GitHub, go to Settings:

1. **General**
   - Add description: "Full-stack college activity portal with Django & Angular"
   - Add topics: `django`, `angular`, `docker`, `postgresql`, `pwa`

2. **Branches**
   - Set `main` as default branch
   - Add branch protection rules (optional)

3. **Secrets** (for CI/CD)
   - Add `SECRET_KEY`
   - Add `DATABASE_URL`
   - Add other environment variables

## 🎯 Next Steps

After pushing to GitHub:

1. ✅ Add repository description and topics
2. ✅ Set up branch protection (optional)
3. ✅ Add collaborators (if team project)
4. ✅ Set up GitHub Actions for CI/CD (optional)
5. ✅ Deploy to production

---

**Your repository is now ready for collaboration and deployment!**
