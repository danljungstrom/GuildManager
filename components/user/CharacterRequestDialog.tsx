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
import { createCharacterRequest } from '@/lib/firebase/character-requests';
import { CLASSES, CLASS_CONFIGS, getClassSpecializations, getSpecRole } from '@/lib/consts/classes';
import type { ClassType } from '@/lib/types/classes.types';
import type { RoleType } from '@/lib/types/roles.types';

interface CharacterRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CharacterRequestDialog({
  open,
  onOpenChange,
  onSuccess,
}: CharacterRequestDialogProps) {
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
      setError('You must be logged in to submit a request');
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

      await createCharacterRequest({
        requesterId: user.id,
        requesterName: user.displayName,
        characterName: characterName.trim(),
        characterClass,
        characterSpec: characterSpec || undefined,
        characterRole: role || undefined,
        notes: notes.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Error submitting request:', err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request New Character</DialogTitle>
          <DialogDescription>
            Submit a request to have your character added to the roster.
            An officer will review your request.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium">Request Submitted!</p>
              <p className="text-sm text-muted-foreground">
                You'll be notified when your request is reviewed.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Character Name */}
            <div className="space-y-2">
              <Label htmlFor="charName">Character Name *</Label>
              <Input
                id="charName"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                placeholder="Enter character name"
                disabled={submitting}
              />
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label htmlFor="charClass">Class *</Label>
              <Select
                value={characterClass}
                onValueChange={(value) => {
                  setCharacterClass(value as ClassType);
                  setCharacterSpec(''); // Reset spec when class changes
                }}
                disabled={submitting}
              >
                <SelectTrigger id="charClass">
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
                <Label htmlFor="charSpec">Specialization</Label>
                <Select
                  value={characterSpec}
                  onValueChange={setCharacterSpec}
                  disabled={submitting}
                >
                  <SelectTrigger id="charSpec">
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
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional info (alts, availability, etc.)"
                rows={3}
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
                Submit Request
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
