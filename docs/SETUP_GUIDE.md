# GuildManager Setup Guide

Complete guide for setting up your guild management website with zero coding required.

## Prerequisites

- A web browser
- A GitHub account (free)
- A Firebase account (free)
- A Vercel account (free)

## Step-by-Step Setup

### 1. Firebase Setup (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "my-guild-website")
4. Disable Google Analytics (not needed) or enable if you want
5. Click "Create project"

#### Enable Firestore Database

1. In the left sidebar, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location closest to your members (e.g., us-central for US guilds)
5. Click "Enable"

#### Get Firebase Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the "</>" (web) icon to create a web app
5. Enter an app nickname (e.g., "GuildManager Web")
6. Don't check "Firebase Hosting"
7. Click "Register app"
8. Copy the config values - you'll need these:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### 2. Deploy to Vercel (5 minutes)

#### Option A: One-Click Deploy

1. Click this button: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/GuildManager)
2. Sign in with GitHub if prompted
3. Click "Create" to fork the repository to your account
4. Add environment variables when prompted:
   - `NEXT_PUBLIC_FIREBASE_API_KEY` → Your Firebase `apiKey`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` → Your Firebase `authDomain`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` → Your Firebase `projectId`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` → Your Firebase `storageBucket`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` → Your Firebase `messagingSenderId`
   - `NEXT_PUBLIC_FIREBASE_APP_ID` → Your Firebase `appId`
5. Click "Deploy"
6. Wait 2-3 minutes for deployment to complete

#### Option B: Manual Deploy

1. Fork this repository on GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Add New" → "Project"
4. Import your forked repository
5. Add the environment variables (same as above)
6. Click "Deploy"

### 3. Initial Website Configuration (2 minutes)

1. Visit your deployed website (Vercel will show you the URL)
2. You'll see a "Welcome to GuildManager!" setup wizard
3. Fill in the form:
   - **Guild Name**: Your guild's name
   - **Server Name**: Your WoW server (e.g., Faerlina, Grobbulus)
   - **Region**: US, EU, KR, TW, or CN
   - **Faction**: Alliance or Horde
   - **Expansion**: Classic Era, TBC, WotLK, Cataclysm, or Retail
4. Click "Next"
5. Add your guild description
6. Click "Next"
7. Customize colors (optional - you can change these later)
8. Click "Complete Setup"
9. Done! Your website is ready

### 4. Customize Your Site (Ongoing)

To change any settings:

1. Go to your website
2. Click "Admin Settings" button
3. Use the tabs to customize:
   - **General**: Guild name, server, description
   - **Theme**: Colors and appearance
   - **Features**: Enable/disable features

Changes save instantly to your Firebase database!

## Common Issues

### "Firestore not initialized" error

**Solution**: Make sure you added all 6 environment variables correctly in Vercel.

1. Go to your Vercel project
2. Click "Settings" → "Environment Variables"
3. Check all variables are present and spelled correctly
4. If you changed them, click "Redeploy" from the Deployments tab

### Setup wizard doesn't appear

**Solution**: Your Firestore might already have configuration data.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database
4. If you see a "config" collection with a "guild" document, delete it
5. Refresh your website

### Changes in Admin Settings don't save

**Solution**: Check Firestore security rules.

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Go to Firestore Database → Rules
3. Replace the rules with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
4. Click "Publish"

**Note**: These rules allow anyone to read/write. For production, you should add authentication.

## Next Steps

- Add guild members to your roster (coming soon)
- Set up raid schedules (coming soon)
- Customize your theme further
- Share your website URL with guild members!

## Getting Help

- Check the [GitHub Issues](https://github.com/yourusername/GuildManager/issues)
- Read the full [README.md](../README.md)
- Review the [Firebase Documentation](https://firebase.google.com/docs/firestore)

## Cost

Everything is free for small guilds:

- **Firebase**: Free tier includes 1GB storage and 50K reads/day
- **Vercel**: Free tier includes unlimited hobby projects
- **Total**: $0/month for typical guild usage (under 100 members)

You only pay if you exceed the free tiers, which is unlikely for a guild website.
