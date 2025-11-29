# GuildManager

A fully customizable guild management system for World of Warcraft guilds, built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Customizable Theme System**: Runtime theme editing using CSS custom properties
- **Multi-Guild Support**: Support for any WoW expansion (Classic, TBC, WotLK, Cata, Retail)
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **WoW-Specific Components**: Class icons, role indicators, profession tracking, and more
- **Dark Mode**: Full dark/light mode support
- **Type-Safe**: Complete TypeScript coverage for better DX
- **Responsive Design**: Mobile-first design that works on all devices

## 🚀 Quick Start - No Coding Required!

**Get your guild website running in under 10 minutes:**

### For Guild Leaders (Non-Technical)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/danljungstrom/GuildManager)

**3 Simple Steps:**

1. **Create Firebase Project** (5 min)
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Create account if not registered
   - Click **"Create a project"** → Enter name → Disable Analytics → Create
   - Enable Firestore: **Build** → **Firestore Database** → **Create database** → Standard → Choose region → Production mode → Enable
   - Create Web App: **Project Overview** (⚙️) → **Add app** → **Web** (`</>`) → Register app (nickname: "*Guildname*", no hosting)
   - **Copy the entire code block** that appears (looks like this):
   
   ```javascript
   // Import the functions you need from the SDKs you need
   import { initializeApp } from "firebase/app";
   import { getAnalytics } from "firebase/analytics";
   // TODO: Add SDKs for Firebase products that you want to use
   // https://firebase.google.com/docs/web/setup#available-libraries

   // Your web app's Firebase configuration
   // For Firebase JS SDK v7.20.0 and later, measurementId is optional
   const firebaseConfig = {
     apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     authDomain: "my-guild-abc123.firebaseapp.com",
     projectId: "my-guild-abc123",
     storageBucket: "my-guild-abc123.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456",
     measurementId: "G-XXXXXXXXXX"
   };
   
   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const analytics = getAnalytics(app);
   ```
   
   > 💡 **Tip**: Copy the whole thing - we'll extract the values automatically!

2. **Deploy to Vercel** (3 min)
   - Click the Deploy button above
   - Sign in or create and account
   - **Paste your entire Firebase config** when Vercel asks
   - (We'll parse it automatically - no need to enter values separately!)
   - Wait for deployment (~2 minutes)

3. **Setup Your Guild**
   - Visit your new site
   - Complete the setup wizard
   - Customize in Admin Settings

**📚 Detailed Guide:** [docs/QUICKSTART.md](docs/QUICKSTART.md)

**💰 Cost:** $0/month (free tiers)

---

### For Developers

**Local Development:**

```bash
# Clone and install
git clone https://github.com/danljungstrom/GuildManager.git
cd GuildManager
pnpm install

# Setup environment
cp .env.example .env.local
# Add your Firebase config to .env.local

# Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) - The setup wizard will appear.

**Build for production:**
```bash
pnpm build
pnpm start
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles with CSS variables
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   ├── theme-demo/       # Design system showcase
│   └── roster/           # Guild roster (placeholder)
├── components/
│   ├── ui/               # shadcn/ui base components
│   ├── wow/              # WoW-specific components
│   └── theme-demo/       # Theme demo components
├── lib/
│   ├── types/            # TypeScript type definitions
│   ├── consts/           # Constants (classes, roles, professions)
│   ├── mock/             # Mock data for development
│   └── utils.ts          # Utility functions
└── public/
    └── icons/            # Icon assets
```

## Design System

Visit `/theme-demo` to see the complete design system showcase, including:

- Color palette with CSS variable names
- All UI components in various states
- WoW-specific component examples
- Live theme editing controls
- Responsive design demonstrations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React Context + Zustand (context implemented)
- **Database**: Firebase Firestore
- **Testing**: Vitest + Playwright (to be implemented)

## Development

### Available Scripts

```bash
pnpm dev        # Start development server with Turbopack
pnpm build      # Create production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm test       # Run all tests (when implemented)
```

### Adding Components

1. Use shadcn/ui CLI to add base components:
```bash
npx shadcn@latest add [component-name]
```

2. Create WoW-specific components in `components/wow/`
3. Use CSS variables for all colors (no hard-coded values)
4. Ensure TypeScript types are defined
5. Make components responsive by default

## Theme Customization

All theme colors are defined using CSS custom properties in `app/globals.css`. This allows for runtime customization without rebuilding the application.

**Color Variables:**
- Base colors: `--primary`, `--secondary`, `--background`, etc.
- WoW class colors: `--class-druid`, `--class-warrior`, etc.
- Role colors: `--role-tank`, `--role-dps`, `--role-healer`

See `CLAUDE.md` for complete design system documentation.

## Roadmap

### Phase 1: Design System ✅ (Complete)
- [x] Initialize Next.js 15 project
- [x] Set up Tailwind CSS with CSS variables
- [x] Install and configure shadcn/ui
- [x] Create guild configuration types
- [x] Build WoW-specific components
- [x] Create theme demo page

### Phase 2: Core Setup ✅ (Complete)
- [x] Firebase integration
- [x] Guild configuration system
- [x] Setup wizard for first-time users
- [x] Admin settings page
- [x] Runtime configuration without code changes

### Phase 3: Core Features (Next)
- [ ] Implement guild roster with Firestore
- [ ] Add member management (CRUD operations)
- [ ] Create raid planning system
- [ ] Implement attunement tracking
- [ ] Add profession tracking
- [ ] Build admin authentication

### Phase 3: Advanced Features
- [ ] Raid Helper integration
- [ ] Discord integration
- [ ] Calendar and scheduling
- [ ] DKP/EPGP loot system
- [ ] Analytics and reporting

## Contributing

This is currently a personal project for learning and demonstration purposes.

## License

MIT

## Acknowledgments

- Inspired by the seios-aner guild management website
- Built with [shadcn/ui](https://ui.shadcn.com/)
- WoW class colors from official Blizzard styling
