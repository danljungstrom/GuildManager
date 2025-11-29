import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GuildConfig } from '@/lib/types/guild-config.types';
import { FIRESTORE_PATHS } from '@/lib/constants/firestore-paths';
import { getThemePreset } from '@/lib/constants/theme-presets';

/**
 * Simplified input for initial guild setup
 * Only requires guild name and theme preset selection
 */
export interface GuildConfigInput {
  name: string;
  themePresetId: string;
}

/**
 * Fetches the guild configuration from Firestore
 */
export async function getGuildConfig(): Promise<GuildConfig | null> {
  if (!db) {
    console.warn('Firestore not initialized. Please check your .env.local file.');
    return null;
  }

  try {
    const docRef = doc(db, FIRESTORE_PATHS.GUILD_CONFIG);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as GuildConfig;
    }
    return null;
  } catch (error) {
    console.error('Error fetching guild config:', error);
    return null;
  }
}

/**
 * Initializes guild configuration with user-provided values
 * Uses theme preset for colors and sets sensible defaults for other fields
 */
export async function initializeGuildConfig(
  input: GuildConfigInput
): Promise<GuildConfig> {
  if (!db) {
    throw new Error('Firestore not initialized. Please check your .env.local file and ensure Firebase is configured correctly.');
  }

  // Get the selected theme preset
  const themePreset = getThemePreset(input.themePresetId);
  if (!themePreset) {
    throw new Error(`Invalid theme preset ID: ${input.themePresetId}`);
  }

  const now = new Date().toISOString();

  const config: GuildConfig = {
    id: 'guild',
    metadata: {
      name: input.name,
      // Other metadata fields are optional and can be set later in admin settings
    },
    theme: {
      colors: themePreset.colors.light, // Default to light theme colors
      typography: themePreset.typography, // Include typography configuration
      darkMode: false,
      logo: input.themePresetId, // Set theme icon ID as default logo
      logoType: 'theme-icon',
      logoFrame: false,
    },
    features: {
      enableRaidPlanning: true,
      enableAttunementTracking: true,
      enableProfessionTracking: true,
      enablePublicRoster: true,
    },
    createdAt: now,
    updatedAt: now,
  };

  try {
    const docRef = doc(db, FIRESTORE_PATHS.GUILD_CONFIG);
    await setDoc(docRef, config);
    return config;
  } catch (error) {
    console.error('Error initializing guild config:', error);
    throw error;
  }
}

/**
 * Updates guild configuration
 */
export async function updateGuildConfig(
  updates: Partial<Omit<GuildConfig, 'id' | 'createdAt'>>
): Promise<void> {
  if (!db) {
    throw new Error('Firestore not initialized. Please check your .env.local file.');
  }

  try {
    const docRef = doc(db, FIRESTORE_PATHS.GUILD_CONFIG);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating guild config:', error);
    throw error;
  }
}
