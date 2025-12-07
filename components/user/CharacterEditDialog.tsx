'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Check } from 'lucide-react';
import { ClassIcon } from '@/components/wow/ClassIcon';
import { ProfessionIcon } from '@/components/wow/ProfessionIcon';
import { getRosterMemberById, updateRosterMember } from '@/lib/firebase/roster';
import { PROFESSIONS, PROFESSION_CONFIGS } from '@/lib/consts/professions';
import { CLASSIC_ATTUNEMENTS } from '@/lib/types/roster.types';
import type { RosterMember, ProfessionEntry, AttunementMap } from '@/lib/types/roster.types';
import type { Profession } from '@/lib/types/professions.types';

interface CharacterEditDialogProps {
  characterId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CharacterEditDialog({
  characterId,
  open,
  onOpenChange,
  onSuccess,
}: CharacterEditDialogProps) {
  const [character, setCharacter] = useState<RosterMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [professions, setProfessions] = useState<ProfessionEntry[]>([]);
  const [attunements, setAttunements] = useState<AttunementMap>({});

  useEffect(() => {
    async function fetchCharacter() {
      if (!characterId || !open) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const char = await getRosterMemberById(characterId);
        if (char) {
          setCharacter(char);
          setProfessions(char.professions || []);
          setAttunements(char.attunements || {});
        } else {
          setError('Character not found');
        }
      } catch (err) {
        console.error('Error fetching character:', err);
        setError('Failed to load character');
      } finally {
        setLoading(false);
      }
    }

    fetchCharacter();
  }, [characterId, open]);

  const handleClose = () => {
    setCharacter(null);
    setProfessions([]);
    setAttunements({});
    setError(null);
    setSuccess(false);
    onOpenChange(false);
  };

  const handleProfessionChange = (index: number, field: 'profession' | 'skill', value: string | number) => {
    setProfessions((prev) => {
      const updated = [...prev];
      if (field === 'profession') {
        updated[index] = { ...updated[index], profession: value as Profession };
      } else {
        updated[index] = { ...updated[index], skill: value as number };
      }
      return updated;
    });
  };

  const addProfession = () => {
    if (professions.length >= 2) return;
    setProfessions((prev) => [...prev, { profession: 'Alchemy' as Profession, skill: 0 }]);
  };

  const removeProfession = (index: number) => {
    setProfessions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAttunementChange = (attunementKey: string, checked: boolean) => {
    setAttunements((prev) => ({
      ...prev,
      [attunementKey]: checked,
    }));
  };

  const handleSave = async () => {
    if (!characterId) return;

    try {
      setSaving(true);
      setError(null);

      await updateRosterMember(characterId, {
        professions,
        attunements,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1000);
    } catch (err) {
      console.error('Error saving character:', err);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {loading ? (
              <Skeleton className="h-6 w-40" />
            ) : character ? (
              <span className="flex items-center gap-2">
                <ClassIcon className={character.class} size="sm" />
                Edit {character.name}
              </span>
            ) : (
              'Edit Character'
            )}
          </DialogTitle>
          <DialogDescription>
            Update your character's professions and attunements
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="font-medium">Changes Saved!</p>
          </div>
        ) : loading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-destructive">{error}</p>
          </div>
        ) : character ? (
          <Tabs defaultValue="professions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="professions">Professions</TabsTrigger>
              <TabsTrigger value="attunements">Attunements</TabsTrigger>
            </TabsList>

            {/* Professions Tab */}
            <TabsContent value="professions" className="space-y-4">
              {professions.map((prof, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <ProfessionIcon profession={prof.profession} size="md" />
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <Select
                      value={prof.profession}
                      onValueChange={(value) => handleProfessionChange(index, 'profession', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROFESSIONS.filter(
                          (p) => PROFESSION_CONFIGS[p]?.isPrimary
                        ).map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={300}
                        value={prof.skill}
                        onChange={(e) =>
                          handleProfessionChange(index, 'skill', parseInt(e.target.value) || 0)
                        }
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">/ 300</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProfession(index)}
                        className="text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {professions.length < 2 && (
                <Button variant="outline" onClick={addProfession} className="w-full">
                  Add Profession
                </Button>
              )}

              {professions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No professions set. Add up to 2 primary professions.
                </p>
              )}
            </TabsContent>

            {/* Attunements Tab */}
            <TabsContent value="attunements" className="space-y-3">
              {CLASSIC_ATTUNEMENTS.map((attunement) => (
                <div
                  key={attunement.name}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: attunement.color }}
                    />
                    <span>{attunement.displayName}</span>
                  </div>
                  <Checkbox
                    checked={attunements[attunement.name] || false}
                    onCheckedChange={(checked) =>
                      handleAttunementChange(attunement.name, checked as boolean)
                    }
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        ) : null}

        {!success && !loading && character && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
