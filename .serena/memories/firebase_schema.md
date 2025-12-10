# GuildManager - Firebase Schema Reference

## Collections

### guilds/{guildId}
Main guild configuration document.

```typescript
interface GuildConfig {
  id: string;                   // Document ID (typically "default")
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  metadata: {
    name: string;               // Guild name
    server: string;             // WoW server name
    region: "US" | "EU" | "KR" | "TW" | "CN";
    faction: "Alliance" | "Horde";
    expansion: "classic" | "tbc" | "wotlk" | "cata" | "retail";
    description?: string;
    website?: string;
    discordInvite?: string;
    recruitmentMessage?: string;
  };
  
  theme: {
    preset: string;             // Theme preset name
    darkMode: boolean;
    logo?: string;              // Legacy logo path
    logoConfig?: LogoConfig;    // Logo configuration
    favicon?: string;
    borderRadius?: number;
    customCSS?: string;
    typography?: ThemeTypography;
    colors?: ThemeColors;
    customThemes?: SavedCustomTheme[];
  };
  
  discord?: {
    enabled: boolean;
    guildId?: string;
    guildName?: string;
    ownerId?: string;
    requireDiscordMembership?: boolean;
    roleMappings?: RoleMapping[];
  };
  
  features?: {
    raidPlanning?: boolean;
    attunementTracking?: boolean;
    professionTracking?: boolean;
    publicRoster?: boolean;
  };
}
```

### roster/{memberId}
Guild member documents.

```typescript
interface RosterMember {
  id: string;                   // Auto-generated document ID
  name: string;                 // Character name
  class: ClassType;             // WoW class
  spec: string;                 // Specialization name
  role: RoleType;               // Tank, DPS, Healer
  rank: GuildRank;              // Guild Master, Officer, etc.
  
  // Optional fields
  playerName?: string;          // Real name / account name
  race?: string;
  notes?: string;
  joinDate?: string;            // ISO date string
  offSpec?: string;             // Off-spec specialization
  extraRoles?: RoleType[];      // Additional roles (hybrid classes)
  
  // Professions
  professions?: ProfessionEntry[];  // [{profession, skill}]
  
  // Attunements (expansion-specific)
  attunements?: Record<string, boolean>;
  
  // Attendance
  attendance?: {
    present: number;
    absent: number;
    late: number;
    excused: number;
  };
  
  // Alt characters
  altCharacters?: AltCharacter[];
  
  // User claiming
  claimedBy?: string;           // Discord user ID
  claimDate?: string;           // ISO date string
  
  // Metadata
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  isMock?: boolean;             // For demo/test data
}
```

### userProfiles/{discordId}
User profile documents.

```typescript
interface UserProfile {
  discordId: string;            // Discord user ID (document ID)
  discordUsername: string;
  discordAvatar?: string;
  discordGlobalName?: string;
  
  // Permissions
  isSuperAdmin?: boolean;       // Site owner
  isAdmin?: boolean;            // Admin access
  adminLevel?: "super" | "full" | "limited";
  
  // Guild membership
  discordRoles?: string[];      // Discord role IDs
  
  // Timestamps
  createdAt?: Timestamp;
  lastLogin?: Timestamp;
}
```

### characterRequests/{requestId}
Character claim requests.

```typescript
interface CharacterRequest {
  id: string;
  characterId: string;          // Roster member ID
  characterName: string;
  requesterId: string;          // Discord user ID
  requesterName: string;
  status: "pending" | "approved" | "rejected";
  requestType: "claim" | "alt";
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
  resolvedBy?: string;
  notes?: string;
}
```

## Firestore Paths

Defined in `lib/constants/firestore-paths.ts`:

```typescript
const FIRESTORE_PATHS = {
  GUILDS: 'guilds',
  ROSTER: 'roster',
  USER_PROFILES: 'userProfiles',
  CHARACTER_REQUESTS: 'characterRequests',
};
```

## Security Rules

Current rules (permissive for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Production rules should:**
- Require authentication for writes
- Validate data structure
- Restrict admin operations to authenticated admins
- Allow public reads for roster if publicRoster enabled

## Indexes

Defined in `firestore.indexes.json`:
- Composite indexes for roster queries (class + role, rank + attendance, etc.)
- Needed for complex filtering and sorting operations
