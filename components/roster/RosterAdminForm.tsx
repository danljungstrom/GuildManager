/**
 * RosterAdminForm Component
 *
 * Comprehensive admin form for adding and editing roster members.
 * Multi-step form with validation and Firebase integration.
 */

'use client';

import { useState, useEffect } from 'react';
import { Plus, Save, X, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRosterStore } from '@/lib/stores/roster-store';
import { useGuild } from '@/lib/contexts/GuildContext';
import { CLASSES, getClassSpecializations, getAvailableRolesForClass } from '@/lib/consts/classes';
import { EXTRA_ROLES } from '@/lib/consts/roles';
import { getProfessionsForExpansion, PROFESSION_SKILL_LEVELS } from '@/lib/consts/professions';
import {
  GUILD_RANKS,
  CLASSIC_ATTUNEMENTS,
  initializeAttunements,
  type RosterMember,
  type CreateRosterMember,
  type ProfessionEntry,
} from '@/lib/types/roster.types';
import type { ClassType } from '@/lib/types/classes.types';
import type { RoleType, ExtraRoleType } from '@/lib/types/roles.types';
import type { Profession } from '@/lib/types/professions.types';
import { createRosterMember, updateRosterMember, deleteRosterMember } from '@/lib/firebase/roster';
import { toastSuccess, toastError } from '@/lib/utils/toast';
import { ClassIcon } from '@/components/wow/ClassIcon';
import { SpecIcon } from '@/components/wow/SpecIcon';
import { RoleIcon } from '@/components/wow/RoleIcon';
import { ProfessionIcon } from '@/components/wow/ProfessionIcon';

interface RosterAdminFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingMember?: RosterMember | null;
}

export function RosterAdminForm({
  isOpen,
  onClose,
  editingMember,
}: RosterAdminFormProps) {
  const addMember = useRosterStore((state) => state.addMember);
  const updateMemberInStore = useRosterStore((state) => state.updateMember);
  const removeMember = useRosterStore((state) => state.removeMember);
  const { config } = useGuild();

  // Get professions available for the guild's expansion
  const availableProfessions = getProfessionsForExpansion(config?.metadata?.expansion || 'classic');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [rank, setRank] = useState<string>('Core');
  const [className, setClassName] = useState<ClassType>('Warrior');
  const [spec, setSpec] = useState('');
  const [offSpec, setOffSpec] = useState('');
  const [role, setRole] = useState<RoleType | ''>('');
  const [attunements, setAttunements] = useState(initializeAttunements());
  const [professions, setProfessions] = useState<ProfessionEntry[]>([]);
  const [extraRoles, setExtraRoles] = useState<ExtraRoleType[]>([]);
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Initialize form with editing member data
  useEffect(() => {
    if (editingMember) {
      setName(editingMember.name);
      setRank(editingMember.rank);
      setClassName(editingMember.class);
      setSpec(editingMember.spec || '');
      setOffSpec(editingMember.offSpec || '');
      setRole(editingMember.role || '');
      setAttunements(editingMember.attunements || initializeAttunements());
      setProfessions(editingMember.professions || []);
      setExtraRoles(editingMember.extraRoles || []);
      setJoinDate(
        editingMember.joinDate || new Date().toISOString().split('T')[0]
      );
      setNotes(editingMember.notes || '');
    } else {
      resetForm();
    }
  }, [editingMember, isOpen]);

  const resetForm = () => {
    setName('');
    setRank('Core');
    setClassName('Warrior');
    setSpec('');
    setOffSpec('');
    setRole('');
    setAttunements(initializeAttunements());
    setProfessions([]);
    setExtraRoles([]);
    setJoinDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setError(null);
  };

  const handleClassChange = (newClass: string) => {
    const classType = newClass as ClassType;
    setClassName(classType);
    setSpec('');
    setOffSpec('');

    // Auto-select role if only one available
    const availableRoles = getAvailableRolesForClass(classType);
    if (availableRoles.length === 1) {
      setRole(availableRoles[0]);
    } else {
      setRole('');
    }
  };

  const handleSpecChange = (newSpec: string) => {
    setSpec(newSpec);

    // Auto-select role based on spec
    const availableRoles = getAvailableRolesForClass(className, newSpec);
    if (availableRoles.length === 1) {
      setRole(availableRoles[0]);
    }
  };

  const handleToggleAttunement = (attunementName: string) => {
    setAttunements((prev) => ({
      ...prev,
      [attunementName]: !prev[attunementName],
    }));
  };

  const handleAddProfession = () => {
    setProfessions([...professions, { profession: 'Alchemy', skill: 300 }]);
  };

  const handleRemoveProfession = (index: number) => {
    setProfessions(professions.filter((_, i) => i !== index));
  };

  const handleProfessionChange = (
    index: number,
    field: 'profession' | 'skill',
    value: string | number
  ) => {
    const updated = [...professions];
    if (field === 'profession') {
      updated[index].profession = value as Profession;
    } else {
      updated[index].skill = Number(value);
    }
    setProfessions(updated);
  };

  const handleToggleExtraRole = (extraRole: ExtraRoleType) => {
    setExtraRoles((prev) =>
      prev.includes(extraRole)
        ? prev.filter((r) => r !== extraRole)
        : [...prev, extraRole]
    );
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      toastError('Character name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const memberData: CreateRosterMember = {
        name: name.trim(),
        rank: rank as CreateRosterMember['rank'],
        class: className,
        spec: spec || undefined,
        offSpec: offSpec || undefined,
        role: role || undefined,
        attunements,
        professions,
        extraRoles: extraRoles.length > 0 ? extraRoles : undefined,
        joinDate,
        notes: notes.trim() || undefined,
      };

      if (editingMember?.id) {
        // Update existing member
        await updateRosterMember(editingMember.id, memberData);
        updateMemberInStore(editingMember.id, memberData);
        toastSuccess('Member updated successfully', {
          description: `${name} has been updated`,
        });
      } else {
        // Create new member
        const newMember = await createRosterMember(memberData);
        addMember(newMember);
        toastSuccess('Member added successfully', {
          description: `${name} has been added to the roster`,
        });
      }

      handleClose();
    } catch (err) {
      console.error('Error saving roster member:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save roster member';
      toastError('Failed to save member', {
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!editingMember?.id) return;

    setIsSubmitting(true);
    setError(null);
    setShowDeleteAlert(false);

    try {
      await deleteRosterMember(editingMember.id);
      removeMember(editingMember.id);
      toastSuccess('Member deleted', {
        description: `${editingMember.name} has been removed from the roster`,
      });
      handleClose();
    } catch (err) {
      console.error('Error deleting roster member:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete roster member';
      toastError('Failed to delete member', {
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const availableSpecs = getClassSpecializations(className);
  const availableRoles = spec
    ? getAvailableRolesForClass(className, spec)
    : getAvailableRolesForClass(className);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingMember ? 'Edit Roster Member' : 'Add New Roster Member'}
          </DialogTitle>
          <DialogDescription>
            {editingMember
              ? 'Update character information and raid details'
              : 'Fill in character information to add to the roster'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="progression">Progression</TabsTrigger>
            <TabsTrigger value="details">Additional Details</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Character Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Character name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rank">Rank *</Label>
                <Select value={rank} onValueChange={setRank}>
                  <SelectTrigger id="rank">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GUILD_RANKS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select value={className} onValueChange={handleClassChange}>
                  <SelectTrigger id="class">
                    <div className="flex items-center gap-2">
                      <ClassIcon className={className} variant="icon" size="sm" />
                      <span>{className}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        <div className="flex items-center gap-2">
                          <ClassIcon className={cls} variant="icon" size="sm" />
                          <span>{cls}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Raid Role</Label>
                <Select value={role || "none"} onValueChange={(v) => setRole(v === "none" ? "" : v as RoleType)}>
                  <SelectTrigger id="role">
                    {role ? (
                      <div className="flex items-center gap-2">
                        <RoleIcon role={role} variant="icon" size="sm" />
                        <span>{role}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select role</span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {availableRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        <div className="flex items-center gap-2">
                          <RoleIcon role={r} variant="icon" size="sm" />
                          <span>{r}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="spec">Main Spec</Label>
                <Select value={spec || "none"} onValueChange={(v) => handleSpecChange(v === "none" ? "" : v)}>
                  <SelectTrigger id="spec">
                    {spec ? (
                      <div className="flex items-center gap-2">
                        <SpecIcon className={className} spec={spec} size="sm" />
                        <span>{spec}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select spec</span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {availableSpecs.map((s) => (
                      <SelectItem key={s} value={s}>
                        <div className="flex items-center gap-2">
                          <SpecIcon className={className} spec={s} size="sm" />
                          <span>{s}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="offSpec">Off Spec</Label>
                <Select value={offSpec || "none"} onValueChange={(v) => setOffSpec(v === "none" ? "" : v)}>
                  <SelectTrigger id="offSpec">
                    {offSpec ? (
                      <div className="flex items-center gap-2">
                        <SpecIcon className={className} spec={offSpec} size="sm" />
                        <span>{offSpec}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select off spec</span>
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {availableSpecs.map((s) => (
                      <SelectItem key={s} value={s}>
                        <div className="flex items-center gap-2">
                          <SpecIcon className={className} spec={s} size="sm" />
                          <span>{s}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Progression Tab */}
          <TabsContent value="progression" className="space-y-4">
            {/* Attunements */}
            <div className="space-y-2">
              <Label>Attunements</Label>
              <div className="grid grid-cols-2 gap-2">
                {CLASSIC_ATTUNEMENTS.map((attunement) => (
                  <div
                    key={attunement.name}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: attunement.color }}
                      />
                      <span className="text-sm">{attunement.displayName}</span>
                    </div>
                    <Switch
                      checked={attunements[attunement.name] || false}
                      onCheckedChange={() =>
                        handleToggleAttunement(attunement.name)
                      }
                      disabled={!attunement.released}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Professions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Professions</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddProfession}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {professions.map((prof, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Select
                      value={prof.profession}
                      onValueChange={(v) =>
                        handleProfessionChange(idx, 'profession', v)
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <div className="flex items-center gap-2">
                          <ProfessionIcon profession={prof.profession} size="sm" />
                          <span>{prof.profession}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {availableProfessions.map((p) => (
                          <SelectItem key={p} value={p}>
                            <div className="flex items-center gap-2">
                              <ProfessionIcon profession={p} size="sm" />
                              <span>{p}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={prof.skill.toString()}
                      onValueChange={(v) =>
                        handleProfessionChange(idx, 'skill', v)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROFESSION_SKILL_LEVELS.map((level) => (
                          <SelectItem key={level} value={level.toString()}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveProfession(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Additional Details Tab */}
          <TabsContent value="details" className="space-y-4">
            {/* Extra Roles */}
            <div className="space-y-2">
              <Label>Guild Roles</Label>
              <div className="flex flex-wrap gap-2">
                {EXTRA_ROLES.map((extraRole) => (
                  <Badge
                    key={extraRole}
                    variant={
                      extraRoles.includes(extraRole) ? 'default' : 'outline'
                    }
                    className="cursor-pointer"
                    onClick={() => handleToggleExtraRole(extraRole)}
                  >
                    {extraRole}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Join Date */}
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes about this member..."
                rows={4}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div>
            {editingMember && (
              <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isSubmitting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {editingMember.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{' '}
                      <span className="font-semibold">{editingMember.name}</span> from the roster.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {editingMember ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
