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

## Getting Started

### Prerequisites

- Node.js 20+ or later
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd GuildManager

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Create production build
pnpm build

# Start production server
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
- **Styling**: Tailwind CSS v3 with CSS custom properties
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: Zustand (to be implemented)
- **Database**: Firebase Firestore (to be implemented)
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

### Phase 2: Core Features (Next)
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
