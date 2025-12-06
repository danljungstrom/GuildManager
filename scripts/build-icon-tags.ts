/**
 * Game-Icons.net Icon Updater & Tag Builder
 *
 * Downloads icons from game-icons.net organized by category, extracts them
 * to the artist-based folder structure, and builds a category mapping JSON.
 *
 * Usage: pnpm build:icon-tags
 *
 * The script will:
 * 1. Fetch the list of all categories from the tags page
 * 2. Download each category zip
 * 3. Extract new icons to public/icons/game-icons.net/[artist]/[icon].svg
 * 4. Build a mapping of icon path → tags
 * 5. Save the mapping to lib/data/icon-tags.json
 *
 * Re-run anytime to fetch new icons from game-icons.net!
 */

import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';

const ICONS_DIR = path.join(process.cwd(), 'public/icons/game-icons.net');
const OUTPUT_FILE = path.join(process.cwd(), 'lib/data/icon-tags.json');
const TAGS_URL = 'https://game-icons.net/tags.html';

// Download white SVGs on transparent background
const ARCHIVE_BASE = 'https://game-icons.net/archives/ffffff/transparent';

interface IconData {
  name: string;
  artist: string;
  tags: string[];
  path: string;
}

interface OutputData {
  generatedAt: string;
  totalIcons: number;
  totalTags: number;
  icons: Record<string, IconData>;
  tagIndex: Record<string, string[]>;
  artistIndex: Record<string, string[]>;
}

// Fetch HTML and extract all tag names
async function fetchAllTags(): Promise<string[]> {
  console.log('Fetching category list from', TAGS_URL);

  const response = await fetch(TAGS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch tags page: ${response.status}`);
  }

  const html = await response.text();

  // Extract tag names from links like /tags/weapon.html
  const tagRegex = /\/tags\/([a-z0-9-]+)\.html/g;
  const tags = new Set<string>();
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    tags.add(match[1]);
  }

  return Array.from(tags).sort();
}

// Download a category zip, extract icons, and return icon info
async function downloadAndExtractCategory(
  tag: string,
  existingIcons: Set<string>
): Promise<{ artist: string; name: string; isNew: boolean }[]> {
  const zipUrl = `${ARCHIVE_BASE}/${tag}.svg.zip`;

  try {
    const response = await fetch(zipUrl);
    if (!response.ok) {
      console.warn(`  Warning: Could not download ${tag} (${response.status})`);
      return [];
    }

    const buffer = await response.arrayBuffer();
    const zip = new AdmZip(Buffer.from(buffer));
    const entries = zip.getEntries();

    const icons: { artist: string; name: string; isNew: boolean }[] = [];

    for (const entry of entries) {
      if (entry.isDirectory) continue;
      if (!entry.entryName.endsWith('.svg')) continue;

      // Parse path: typically "category/artist/icon-name.svg"
      const parts = entry.entryName.split('/').filter(p => p.length > 0);

      let artist: string;
      let name: string;

      if (parts.length >= 2) {
        // Get artist (second to last) and name (last without .svg)
        const fileName = parts[parts.length - 1];
        artist = parts[parts.length - 2];
        name = fileName.replace('.svg', '');
      } else if (parts.length === 1) {
        // Just filename, no artist folder
        artist = 'unknown';
        name = parts[0].replace('.svg', '');
      } else {
        continue;
      }

      const iconPath = `${artist}/${name}`;
      const isNew = !existingIcons.has(iconPath);

      // Extract to artist folder if new
      if (isNew) {
        const artistDir = path.join(ICONS_DIR, artist);
        const iconFile = path.join(artistDir, `${name}.svg`);

        // Create artist directory if needed
        if (!fs.existsSync(artistDir)) {
          fs.mkdirSync(artistDir, { recursive: true });
        }

        // Extract the SVG
        const content = entry.getData();
        fs.writeFileSync(iconFile, content);

        existingIcons.add(iconPath);
      }

      icons.push({ artist, name, isNew });
    }

    return icons;

  } catch (error) {
    console.warn(`  Error processing ${tag}:`, error instanceof Error ? error.message : error);
    return [];
  }
}

// Get existing icons from disk
function getExistingIcons(): Set<string> {
  const icons = new Set<string>();

  if (!fs.existsSync(ICONS_DIR)) {
    return icons;
  }

  const artists = fs.readdirSync(ICONS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const artist of artists) {
    const artistDir = path.join(ICONS_DIR, artist);
    const files = fs.readdirSync(artistDir)
      .filter(f => f.endsWith('.svg'));

    for (const file of files) {
      const name = file.replace('.svg', '');
      icons.add(`${artist}/${name}`);
    }
  }

  return icons;
}

// Sleep helper for rate limiting
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('Game-Icons.net Icon Updater & Tag Builder');
  console.log('==========================================\n');

  // Get existing icons
  console.log('Scanning existing icons...');
  const existingIcons = getExistingIcons();
  console.log(`Found ${existingIcons.size} existing icons\n`);

  // Fetch all tag names
  const tags = await fetchAllTags();
  console.log(`Found ${tags.length} categories to process\n`);

  // Build the mapping
  const output: OutputData = {
    generatedAt: new Date().toISOString(),
    totalIcons: 0,
    totalTags: 0,
    icons: {},
    tagIndex: {},
    artistIndex: {},
  };

  let processed = 0;
  let newIcons = 0;
  const startTime = Date.now();

  for (const tag of tags) {
    processed++;
    process.stdout.write(`[${processed}/${tags.length}] ${tag}...`);

    const icons = await downloadAndExtractCategory(tag, existingIcons);

    // Add to tag index
    output.tagIndex[tag] = [];

    let tagNewCount = 0;
    for (const { artist, name, isNew } of icons) {
      const iconPath = `${artist}/${name}`;

      if (isNew) tagNewCount++;

      // Create or update icon entry
      if (!output.icons[iconPath]) {
        output.icons[iconPath] = {
          name,
          artist,
          tags: [],
          path: iconPath,
        };
      }

      // Add tag to icon
      if (!output.icons[iconPath].tags.includes(tag)) {
        output.icons[iconPath].tags.push(tag);
      }

      // Add to tag index
      if (!output.tagIndex[tag].includes(iconPath)) {
        output.tagIndex[tag].push(iconPath);
      }

      // Add to artist index
      if (!output.artistIndex[artist]) {
        output.artistIndex[artist] = [];
      }
      if (!output.artistIndex[artist].includes(iconPath)) {
        output.artistIndex[artist].push(iconPath);
      }
    }

    newIcons += tagNewCount;
    const newLabel = tagNewCount > 0 ? ` (+${tagNewCount} new)` : '';
    console.log(` ${icons.length} icons${newLabel}`);

    // Rate limiting: 2 requests per second
    await sleep(500);
  }

  // Update totals
  output.totalIcons = Object.keys(output.icons).length;
  output.totalTags = Object.keys(output.tagIndex).length;

  // Save output
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n==========================================');
  console.log(`Completed in ${elapsed}s`);
  console.log(`Total icons: ${output.totalIcons}`);
  console.log(`New icons added: ${newIcons}`);
  console.log(`Total tags: ${output.totalTags}`);
  console.log(`Total artists: ${Object.keys(output.artistIndex).length}`);
  console.log(`Output saved to: ${OUTPUT_FILE}`);
}

main().catch(console.error);
