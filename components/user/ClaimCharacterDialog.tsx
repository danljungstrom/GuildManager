'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClassIcon } from '@/components/wow/ClassIcon';
import { RoleIcon } from '@/components/wow/RoleIcon';
import { Search, Check, UserCheck } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AdminContext';
import { claimCharacter, isCharacterClaimed, getCharacterClaimant } from '@/lib/firebase/user-profiles';
import { getAllRosterMembers } from '@/lib/firebase/roster';
import type { RosterMember } from '@/lib/types/roster.types';
import { cn } from '@/lib/utils';

interface ClaimCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ClaimCharacterDialog({
  open,
  onOpenChange,
  onSuccess,
}: ClaimCharacterDialogProps) {
  const { user } = useAuth();
  const [roster, setRoster] = useState<RosterMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoster() {
      if (!open) return;

      try {
        setLoading(true);
        setError(null);
        const members = await getAllRosterMembers();
        setRoster(members);
      } catch (err) {
        console.error('Error fetching roster:', err);
        setError('Failed to load roster');
      } finally {
        setLoading(false);
      }
    }

    fetchRoster();
  }, [open]);

  // Filter for unclaimed characters matching search
  const availableCharacters = useMemo(() => {
    return roster
      .filter((char) => !char.claimedBy)
      .filter((char) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          char.name.toLowerCase().includes(query) ||
          char.class.toLowerCase().includes(query) ||
          char.spec?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [roster, searchQuery]);

  const handleClaim = async (character: RosterMember) => {
    if (!user || !character.id) return;

    try {
      setClaiming(true);
      setError(null);
      setSuccessMessage(null);

      const result = await claimCharacter(
        user.id,
        character.id,
        user.discordUsername,
        user.displayName,
        user.avatar
      );

      if (result.success) {
        setSuccessMessage(`Successfully claimed ${character.name}!`);
        // Update local state to reflect the claim
        setRoster((prev) =>
          prev.map((c) =>
            c.id === character.id ? { ...c, claimedBy: user.id } : c
          )
        );
        // Wait a moment then close and notify parent
        setTimeout(() => {
          onSuccess();
          onOpenChange(false);
          setSuccessMessage(null);
        }, 1500);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Error claiming character:', err);
      setError('Failed to claim character');
    } finally {
      setClaiming(false);
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setError(null);
    setSuccessMessage(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Claim a Character</DialogTitle>
          <DialogDescription>
            Select a character from the roster to claim as yours
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded flex items-center gap-2">
              <Check className="h-4 w-4" />
              {successMessage}
            </div>
          )}

          {/* Character List */}
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : availableCharacters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? (
                <p>No unclaimed characters match "{searchQuery}"</p>
              ) : (
                <p>No unclaimed characters available</p>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {availableCharacters.map((char) => (
                  <div
                    key={char.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ClassIcon className={char.class} size="md" />
                      <div>
                        <div className="font-medium">{char.name}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{char.spec || char.class}</span>
                          {char.role && (
                            <>
                              <span>•</span>
                              <RoleIcon role={char.role} size="sm" />
                            </>
                          )}
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {char.rank}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleClaim(char)}
                      disabled={claiming}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Claim
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Stats */}
          {!loading && (
            <div className="text-xs text-muted-foreground text-center">
              {availableCharacters.length} unclaimed character{availableCharacters.length !== 1 ? 's' : ''} available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
