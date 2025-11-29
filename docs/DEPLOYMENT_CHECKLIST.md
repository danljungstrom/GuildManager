# Deployment Checklist

Use this checklist when deploying GuildManager for a guild.

## Pre-Deployment

- [ ] Firebase project created
- [ ] Firestore Database enabled (production mode)
- [ ] Firebase web app created
- [ ] All 6 config values copied
- [ ] GitHub repository forked (if doing manual deploy)

## Vercel Setup

- [ ] Vercel account created/logged in
- [ ] Repository imported or one-click deploy used
- [ ] All environment variables added:
  - [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] Deployment completed successfully
- [ ] Production URL copied

## Initial Configuration

- [ ] Visited production URL
- [ ] Setup wizard appeared
- [ ] Guild information filled in:
  - [ ] Guild name
  - [ ] Server name
  - [ ] Region
  - [ ] Faction
  - [ ] Expansion
- [ ] Guild description added
- [ ] Theme colors customized (optional)
- [ ] Setup completed successfully
- [ ] Homepage loads with guild info

## Post-Deployment

- [ ] Test admin settings page (`/admin/settings`)
- [ ] Verify guild info displays correctly
- [ ] Test changing a setting and saving
- [ ] Verify changes persist after page reload
- [ ] Check mobile responsiveness
- [ ] Share URL with guild members

## Firestore Security Rules (Important!)

- [ ] Update security rules in Firebase Console
- [ ] Add the rules from `firestore.rules`
- [ ] Rules published successfully

**Current rules allow public read/write - fine for testing but should add auth for production!**

## Optional Configuration

- [ ] Custom domain added to Vercel
- [ ] DNS configured
- [ ] SSL certificate verified
- [ ] Analytics setup (if desired)
- [ ] Error monitoring (Sentry, etc.)

## Testing

- [ ] Homepage loads
- [ ] Setup wizard works (test with new Firebase project)
- [ ] Admin settings page accessible
- [ ] Settings save correctly
- [ ] Color changes apply
- [ ] Mobile view works
- [ ] Theme demo page works (`/theme-demo`)

## Documentation for Guild Admins

- [ ] Share admin settings URL
- [ ] Provide brief instructions on customization
- [ ] Share color picker tool for HSL colors: https://hslpicker.com/

## Troubleshooting Reference

| Issue | Solution |
|-------|----------|
| Setup wizard doesn't appear | Delete Firestore config/guild document |
| "Firestore not initialized" | Check environment variables |
| Changes don't save | Update Firestore security rules |
| Page won't load | Check Vercel deployment logs |

## Future Updates

When pulling updates from GitHub:

- [ ] Pull latest changes to forked repo
- [ ] Vercel auto-deploys from main branch
- [ ] Verify deployment succeeded
- [ ] Test key functionality
- [ ] No need to reconfigure (config stored in Firestore)

## Rollback Plan

If something goes wrong:

1. Go to Vercel → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Or revert GitHub commit and redeploy

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Production URL**: _______________

**Firebase Project ID**: _______________

**Notes**:
_______________________________________________________________
_______________________________________________________________
_______________________________________________________________
