'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ClassIcon } from '@/components/wow/ClassIcon';
import { RoleIcon } from '@/components/wow/RoleIcon';
import { Star, Edit2, Trash2, UserPlus, Plus } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AdminContext';
import { getUserProfile, unclaimCharacter, deleteAltCharacter } from '@/lib/firebase/user-profiles';
import { getRosterMemberById } from '@/lib/firebase/roster';
import type { UserProfile, AltCharacter } from '@/lib/types/user-profile.types';
import type { RosterMember } from '@/lib/types/roster.types';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MyCharactersProps {
  onClaimClick: () => void;
  onAddAltClick: () => void;
  onEditClick: (characterId: string) => void;
  onEditAltClick: (altId: string) => void;
}

export function MyCharacters({ onClaimClick, onAddAltClick, onEditClick, onEditAltClick }: MyCharactersProps) {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mainCharacter, setMainCharacter] = useState<RosterMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const userProfile = await getUserProfile(user.id);
        setProfile(userProfile);

        // Fetch main character from roster if exists
        if (userProfile?.mainCharacterId) {
          const main = await getRosterMemberById(userProfile.mainCharacterId);
          setMainCharacter(main);
        } else {
          setMainCharacter(null);
        }
      } catch (err) {
        console.error('Error fetching characters:', err);
        setError('Failed to load your characters');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  const handleUnclaimMain = async () => {
    if (!user?.id || !mainCharacter?.id) return;

    try {
      await unclaimCharacter(user.id, mainCharacter.id);
      setMainCharacter(null);
      setProfile((prev) => (prev ? { ...prev, mainCharacterId: undefined, claimedCharacters: [] } : null));
    } catch (err) {
      console.error('Error unclaiming character:', err);
    }
  };

  const handleDeleteAlt = async (altId: string) => {
    if (!user?.id) return;

    try {
      await deleteAltCharacter(user.id, altId);
      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          altCharacters: prev.altCharacters.filter((alt) => alt.id !== altId),
        };
      });
    } catch (err) {
      console.error('Error deleting alt:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Characters</CardTitle>
          <CardDescription>Sign in to manage your characters</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You need to be logged in to view and manage your characters.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Characters</CardTitle>
          <CardDescription>Loading your characters...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Characters</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const hasMain = !!mainCharacter;
  const alts = profile?.altCharacters || [];

  return (
    <div className="space-y-4">
      {/* Main Character Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                Main Character
              </CardTitle>
              <CardDescription>
                {hasMain
                  ? 'Your primary character in the guild roster'
                  : 'Claim a character from the roster to get started'}
              </CardDescription>
            </div>
            {!hasMain && (
              <Button onClick={onClaimClick}>
                <UserPlus className="h-4 w-4 mr-2" />
                Claim Character
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!hasMain ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">
                You haven't claimed a main character yet. Click "Claim Character" above to find yours.
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-lg border border-primary bg-primary/5">
              <div className="flex items-center gap-3">
                <ClassIcon className={mainCharacter.class} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{mainCharacter.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      Main
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{mainCharacter.spec || mainCharacter.class}</span>
                    {mainCharacter.role && (
                      <>
                        <span>•</span>
                        <RoleIcon role={mainCharacter.role} size="sm" />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditClick(mainCharacter.id!)}
                  title="Edit character info"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="Unclaim character">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Unclaim {mainCharacter.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove {mainCharacter.name} from your account. The character will
                        remain in the roster and can be claimed by another user.
                        {alts.length > 0 && (
                          <span className="block mt-2 font-medium text-destructive">
                            Warning: Your {alts.length} alt character(s) will remain, but you'll need
                            to reclaim a main to add more alts.
                          </span>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleUnclaimMain}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Unclaim
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alts Card - Only show if user has a main character */}
      {hasMain && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Alt Characters</CardTitle>
                <CardDescription>
                  {alts.length === 0
                    ? 'Add your alt characters (not shown in main roster)'
                    : `${alts.length} alt${alts.length > 1 ? 's' : ''} registered`}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={onAddAltClick}>
                <Plus className="h-4 w-4 mr-1" />
                Add Alt
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {alts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground text-sm">
                  No alt characters yet. Click "Add Alt" above to add your first alt.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {alts.map((alt) => (
                  <div
                    key={alt.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <ClassIcon className={alt.class} size="md" />
                      <div>
                        <span className="font-medium">{alt.name}</span>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{alt.spec || alt.class}</span>
                          {alt.role && (
                            <>
                              <span>•</span>
                              <RoleIcon role={alt.role} size="sm" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditAltClick(alt.id)}
                        title="Edit alt info"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Delete alt">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {alt.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete this alt character. This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteAlt(alt.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
