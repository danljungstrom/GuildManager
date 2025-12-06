'use client';

import { useState, useMemo, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import iconTagsData from '@/lib/data/icon-tags.json';

interface IconData {
  name: string;
  artist: string;
  tags: string[];
  path: string;
}

interface IconLibrary {
  icons: Record<string, IconData>;
  tagIndex: Record<string, string[]>;
  artistIndex: Record<string, string[]>;
  totalIcons: number;
  totalTags: number;
}

interface IconLibraryPickerProps {
  selectedIcon?: string;
  onSelect: (iconPath: string, artist: string) => void;
  onCancel?: () => void;
}

// WoW-relevant tags to feature prominently
const FEATURED_TAGS = [
  'weapon', 'armor', 'shield', 'sword', 'axe', 'skull',
  'creature', 'dragon', 'medieval-fantasy', 'magic',
  'crown', 'helmet', 'symbol', 'emblem', 'animal',
  'fire', 'ice', 'death', 'nature', 'abstract'
];

export function IconLibraryPicker({ selectedIcon, onSelect, onCancel }: IconLibraryPickerProps) {
  const library = iconTagsData as IconLibrary;

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  // Get all available tags, sorted with featured first
  const allTags = useMemo(() => {
    const tags = Object.keys(library.tagIndex).sort();
    const featured = FEATURED_TAGS.filter(t => tags.includes(t));
    const others = tags.filter(t => !FEATURED_TAGS.includes(t));
    return [...featured, '---', ...others];
  }, [library.tagIndex]);

  // Filter icons based on search and tag
  const filteredIcons = useMemo(() => {
    let icons = Object.values(library.icons);

    // Filter by tag
    if (selectedTag && selectedTag !== 'all') {
      const tagIcons = library.tagIndex[selectedTag] || [];
      icons = icons.filter(icon => tagIcons.includes(icon.path));
    }

    // Filter by search
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      icons = icons.filter(icon =>
        icon.name.toLowerCase().includes(searchLower) ||
        icon.artist.toLowerCase().includes(searchLower) ||
        icon.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by name
    return icons.sort((a, b) => a.name.localeCompare(b.name));
  }, [library, selectedTag, search]);

  const handleSelect = useCallback((icon: IconData) => {
    onSelect(icon.path, icon.artist);
  }, [onSelect]);

  const displayedIcon = hoveredIcon
    ? library.icons[hoveredIcon]
    : selectedIcon
      ? library.icons[selectedIcon]
      : null;

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {allTags.map((tag) => (
              tag === '---' ? (
                <div key="separator" className="h-px bg-border my-1" />
              ) : (
                <SelectItem key={tag} value={tag}>
                  {tag.replace(/-/g, ' ')}
                  <span className="ml-2 text-muted-foreground text-xs">
                    ({library.tagIndex[tag]?.length || 0})
                  </span>
                </SelectItem>
              )
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredIcons.length} icons {selectedTag !== 'all' && `in "${selectedTag}"`}
      </p>

      <div className="flex gap-4">
        {/* Icon Grid */}
        <ScrollArea className="h-[400px] flex-1 border rounded-lg p-2">
          <div className="grid grid-cols-8 gap-1">
            {filteredIcons.map((icon) => (
              <button
                key={icon.path}
                onClick={() => handleSelect(icon)}
                onMouseEnter={() => setHoveredIcon(icon.path)}
                onMouseLeave={() => setHoveredIcon(null)}
                className={cn(
                  'aspect-square p-2 rounded-md border transition-all hover:bg-primary/10 hover:border-primary',
                  selectedIcon === icon.path && 'bg-primary/20 border-primary ring-2 ring-primary'
                )}
                title={`${icon.name} by ${icon.artist}`}
              >
                <div
                  className="w-full h-full bg-foreground"
                  style={{
                    WebkitMask: `url(/icons/game-icons.net/${icon.path}.svg) center/contain no-repeat`,
                    mask: `url(/icons/game-icons.net/${icon.path}.svg) center/contain no-repeat`,
                  }}
                />
              </button>
            ))}
          </div>
          {filteredIcons.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No icons found
            </div>
          )}
        </ScrollArea>

        {/* Preview Panel */}
        <div className="w-48 space-y-3">
          <Label className="text-sm font-medium">Preview</Label>
          <div className="aspect-square border rounded-lg flex items-center justify-center bg-muted/30">
            {displayedIcon ? (
              <div
                className="w-24 h-24 bg-primary"
                style={{
                  WebkitMask: `url(/icons/game-icons.net/${displayedIcon.path}.svg) center/contain no-repeat`,
                  mask: `url(/icons/game-icons.net/${displayedIcon.path}.svg) center/contain no-repeat`,
                }}
              />
            ) : (
              <span className="text-muted-foreground text-sm">Hover to preview</span>
            )}
          </div>
          {displayedIcon && (
            <div className="space-y-1 text-sm">
              <p className="font-medium truncate">{displayedIcon.name}</p>
              <p className="text-muted-foreground">
                by <span className="text-foreground">{displayedIcon.artist}</span>
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {displayedIcon.tags.slice(0, 4).map(tag => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-muted rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {displayedIcon.tags.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{displayedIcon.tags.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {onCancel && (
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => selectedIcon && library.icons[selectedIcon] && handleSelect(library.icons[selectedIcon])}
            disabled={!selectedIcon}
          >
            Select Icon
          </Button>
        </div>
      )}
    </div>
  );
}
