# Quick Start - GuildManager

## 🚀 3-Step Setup (10 minutes total)

### Step 1: Firebase (5 min)
1. Go to https://console.firebase.google.com/
2. Create new project
3. Enable Firestore Database (production mode)
4. Get config from Project Settings → Web App

### Step 2: Deploy (3 min)
1. Click Deploy to Vercel button in README
2. Add 6 Firebase environment variables
3. Wait for deployment

### Step 3: Configure (2 min)
1. Visit your site
2. Fill in the setup wizard
3. Done!

## 📋 Firebase Environment Variables

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## 🎨 What You Can Customize (No Code Required)

- Guild name & server
- Region & faction
- WoW expansion
- Guild description
- Color scheme (HSL format)
- Feature toggles
  - Raid planning
  - Attunement tracking
  - Profession tracking
  - Public roster visibility

## 🔧 Admin Access

After setup, visit `/admin/settings` to change any configuration.

## 💰 Cost

**$0/month** - Everything runs on free tiers:
- Firebase: 1GB storage, 50K reads/day free
- Vercel: Unlimited hobby projects free

## 🆘 Troubleshooting

### Setup wizard doesn't appear
→ Clear Firestore data and refresh

### "Firestore not initialized"
→ Check environment variables in Vercel

### Can't save changes
→ Update Firestore security rules

See full guide: [docs/SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 📚 Documentation

- [Full Setup Guide](./SETUP_GUIDE.md) - Detailed walkthrough
- [README.md](../README.md) - Project overview
- [Firebase Docs](https://firebase.google.com/docs/firestore)
- [Vercel Docs](https://vercel.com/docs)

## ✨ Features Coming Soon

- Guild roster management
- Raid calendar & planning
- Member attunement tracking
- Profession recipes tracking
- Discord integration
- WarcraftLogs integration

---

**Need help?** Open an issue on GitHub!
