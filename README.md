# Areti Alliance CRM Dashboard
A comprehensive customer relationship management system for Areti Alliance's delivery operations.

# Create GitHub workflow directory
mkdir -p .github\workflows

# Create deployment workflow file
@"
name: Deploy CRM Frontend

on:
  push:
    branches: [ master ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3

      - name: Setup Node.js 🔧
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies 📦
        run: npm ci

      - name: Build 🏗️
        run: npm run build
        env:
          REACT_APP_API_URL: `${{ secrets.REACT_APP_API_URL }}`

      - name: Deploy to GitHub Pages 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: build
          branch: gh-pages
          cname: dashboard.aretialliance.com