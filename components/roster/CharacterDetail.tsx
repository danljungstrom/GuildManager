/**
 * CharacterDetail Component
 *
 * Detailed modal view for a roster member, showing comprehensive
 * character information including attunements, professions, and attendance.
 */

'use client';

import { X, User, Calendar, Shield, Briefcase, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRosterStore } from '@/lib/stores/roster-store';
import { ClassIcon } from '@/components/wow/ClassIcon';
import { RoleIcon } from '@/components/wow/RoleIcon';
import { SpecIcon } from '@/components/wow/SpecIcon';
import { ProfessionIcon } from '@/components/wow/ProfessionIcon';
import { AttendanceBadge } from '@/components/wow/AttendanceBadge';
import { CLASSIC_ATTUNEMENTS } from '@/lib/types/roster.types';
import { getRankDisplayName } from '@/lib/types/roster.types';

export function CharacterDetail() {
  const selectedMemberId = useRosterStore((state) => state.selectedMemberId);
  const members = useRosterStore((state) => state.members);
  const setSelectedMember = useRosterStore((state) => state.setSelectedMember);

  const member = members.find((m) => m.id === selectedMemberId);
  const isOpen = !!member;

  if (!member) return null;

  const handleClose = () => {
    setSelectedMember(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <ClassIcon className={member.class} variant="icon" size="lg" />
            <div>
              <span className={`class-${member.class.toLowerCase()} text-2xl font-bold`}>
                {member.name}
              </span>
              {member.playerName && (
                <p className="text-sm text-muted-foreground font-normal">
                  Played by {member.playerName}
                </p>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rank</p>
              <Badge variant="outline" className="text-base">
                {getRankDisplayName(member.rank)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Class</p>
              <ClassIcon className={member.class} variant="text" showText />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Level</p>
              <p className="text-base font-semibold">{member.level || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Gear Score</p>
              <p className="text-base font-semibold">
                {member.gearInfo?.gearScore || 'N/A'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Specializations & Role */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Specializations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Main Spec</p>
                {member.spec ? (
                  <SpecIcon
                    className={member.class}
                    spec={member.spec}
                    size="md"
                    showText
                  />
                ) : (
                  <p className="text-sm">Not specified</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Off Spec</p>
                {member.offSpec ? (
                  <SpecIcon
                    className={member.class}
                    spec={member.offSpec}
                    size="md"
                    showText
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">None</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Raid Role</p>
                {member.role ? (
                  <RoleIcon role={member.role} variant="both" size="md" showText />
                ) : (
                  <p className="text-sm text-muted-foreground">Not specified</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Attendance */}
          {member.attendance && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Raid Attendance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Attendance Rate
                    </p>
                    <AttendanceBadge
                      status={
                        member.attendance.percentage >= 90
                          ? 'present'
                          : member.attendance.percentage >= 75
                          ? 'late'
                          : 'absent'
                      }
                      percentage={member.attendance.percentage}
                      showPercentage
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Raids</p>
                    <p className="text-base font-semibold">
                      {member.attendance.attendedRaids || 0} /{' '}
                      {member.attendance.totalRaids || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Last Raid</p>
                    <p className="text-base font-semibold">
                      {member.attendance.lastRaid
                        ? new Date(member.attendance.lastRaid).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Professions */}
          {member.professions && member.professions.length > 0 && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {member.professions.map((prof, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-md bg-muted"
                    >
                      <ProfessionIcon
                        profession={prof.profession}
                        skill={prof.skill}
                        showText
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Attunements */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Attunements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CLASSIC_ATTUNEMENTS.map((attunement) => {
                const completed = member.attunements[attunement.name] || false;
                return (
                  <div
                    key={attunement.name}
                    className={`flex items-center gap-2 p-2 rounded-md border ${
                      completed
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: attunement.color }}
                    />
                    <span className="text-sm">{attunement.displayName}</span>
                    {completed && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guild Roles */}
          {member.extraRoles && member.extraRoles.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Guild Roles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.extraRoles.map((role) => (
                    <Badge key={role} variant="secondary" className="text-base">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Additional Info */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member.joinDate && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Joined Guild</p>
                <p className="text-base">
                  {new Date(member.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
            {member.altCharacters && member.altCharacters.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Alt Characters</p>
                <div className="flex flex-wrap gap-1">
                  {member.altCharacters.map((alt, idx) => (
                    <Badge key={idx} variant="outline">
                      {alt}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {member.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <p className="text-sm bg-muted p-3 rounded-md">{member.notes}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
