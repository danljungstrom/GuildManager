/**
 * RosterSearch Component
 *
 * Search bar for filtering roster by character name or player name.
 * Provides real-time search with clear functionality.
 */

'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRosterStore } from '@/lib/stores/roster-store';

export function RosterSearch() {
  const searchQuery = useRosterStore((state) => state.filters.searchQuery);
  const setSearchQuery = useRosterStore((state) => state.setSearchQuery);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search by character or player name..."
        value={searchQuery || ''}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-9"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
