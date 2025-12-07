'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AdminContext';
import { addAltCharacter } from '@/lib/firebase/user-profiles';
import { CLASSES, getClassSpecializations, getSpecRole } from '@/lib/consts/classes';
import type { ClassType } from '@/lib/types/classes.types';
import type { RoleType } from '@/lib/types/roles.types';

interface AddAltDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddAltDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddAltDialogProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [characterName, setCharacterName] = useState('');
  const [characterClass, setCharacterClass] = useState<ClassType | ''>('');
  const [characterSpec, setCharacterSpec] = useState('');
  const [notes, setNotes] = useState('');

  const specs = characterClass ? getClassSpecializations(characterClass) : [];
  const role: RoleType | null = characterClass && characterSpec
    ? getSpecRole(characterClass, characterSpec)
    : null;

  const resetForm = () => {
    setCharacterName('');
    setCharacterClass('');
    setCharacterSpec('');
    setNotes('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to add an alt');
      return;
    }

    if (!characterName.trim()) {
      setError('Character name is required');
      return;
    }

    if (!characterClass) {
      setError('Class is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const result = await addAltCharacter(user.id, {
        ownerId: user.id,
        name: characterName.trim(),
        class: characterClass,
        spec: characterSpec || undefined,
        role: role || undefined,
        notes: notes.trim() || undefined,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1000);
    } catch (err) {
      console.error('Error adding alt:', err);
      setError('Failed to add alt character. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Alt Character</DialogTitle>
          <DialogDescription>
            Add an alt character to your profile. Alts are displayed separately
            from the main guild roster.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Alt Added!</p>
              <p className="text-sm text-muted-foreground">
                {characterName} has been added to your alts.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Character Name */}
            <div className="space-y-2">
              <Label htmlFor="altName">Character Name *</Label>
              <Input
                id="altName"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Enter character name"
                disabled={submitting}
              />
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label htmlFor="altClass">Class *</Label>
              <Select
                value={characterClass}
                onValueChange={(value) => {
                  setCharacterClass(value as ClassType);
                  setCharacterSpec(''); // Reset spec when class changes
                }}
                disabled={submitting}
              >
                <SelectTrigger id="altClass">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASSES.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Spec */}
            {specs.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="altSpec">Specialization</Label>
                <Select
                  value={characterSpec}
                  onValueChange={setCharacterSpec}
                  disabled={submitting}
                >
                  <SelectTrigger id="altSpec">
                    <SelectValue placeholder="Select spec (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {specs.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Role display */}
            {role && (
              <div className="text-sm text-muted-foreground">
                Role: <span className="font-medium">{role}</span>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="altNotes">Notes (optional)</Label>
              <Textarea
                id="altNotes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about this alt"
                rows={2}
                disabled={submitting}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded">
                {error}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Add Alt
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
