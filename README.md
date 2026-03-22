# Reviews to Growth — Backend Setup Guide

## What you have
- `server.js` — Node.js backend that holds your API key securely
- `embed.html` — the demo page to embed on Tilda or host anywhere
- No API key is visible to prospects at any point

---

## Step 1 — Push to GitHub (free, 2 minutes)

1. Go to github.com → sign in → click "New repository"
2. Name it: `rtg-backend`
3. Keep it Private
4. Click "Create repository"
5. On your computer, open terminal in this folder and run:

```
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/YOUR_USERNAME/rtg-backend.git
git push -u origin main
```

---

## Step 2 — Deploy on Render (free, 5 minutes)

1. Go to render.com → sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your `rtg-backend` GitHub repo
4. Fill in these settings:
   - Name: `rtg-backend` (or anything you like)
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Under "Environment Variables", click "Add Variable":
   - Key: `ANTHROPIC_API_KEY`
   - Value: your API key (sk-ant-...)
6. Click "Create Web Service"
7. Wait ~2 minutes for it to deploy
8. Copy your URL — it will look like: `https://rtg-backend.onrender.com`

---

## Step 3 — Update embed.html

Open `embed.html` and find this line near the bottom:

```javascript
const BACKEND_URL = 'https://your-app-name.onrender.com';
```

Replace with your actual Render URL:

```javascript
const BACKEND_URL = 'https://rtg-backend.onrender.com';
```

---

## Step 4 — Add to Tilda

1. In Tilda, open your page editor
2. Click "+" to add a block → search for "HTML" → select the T123 HTML block
3. Click the block → "Content" → paste the entire contents of `embed.html`
4. Save and publish

That's it. Your prospects can now use the live demo on your Tilda page.
No API key is visible anywhere. Your key lives only on Render.

---

## Cost reminder
- Render free tier: free (may sleep after 15 min inactivity — upgrade to $7/mo if you want it always-on)
- Anthropic API: ~$0.004 per response generated. 500 demos = ~$2

---

## Files in this folder
| File | Purpose |
|------|---------|
| server.js | Backend proxy — deploy this on Render |
| embed.html | Frontend demo — paste into Tilda |
| package.json | Node dependencies |
| README.md | This guide |
