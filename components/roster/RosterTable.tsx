/**
 * RosterTable Component
 *
 * Main table display for roster members with sorting, expandable rows,
 * and detail views. Uses shadcn/ui Table components.
 */

'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRosterStore } from '@/lib/stores/roster-store';
import { ClassIcon } from '@/components/wow/ClassIcon';
import { RoleIcon } from '@/components/wow/RoleIcon';
import { SpecIcon } from '@/components/wow/SpecIcon';
import { AttendanceBadge } from '@/components/wow/AttendanceBadge';
import type { RosterMember, RosterSortField } from '@/lib/types/roster.types';

interface RosterTableRowProps {
  member: RosterMember;
  onSelect: (member: RosterMember) => void;
}

function RosterTableRow({ member, onSelect }: RosterTableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => onSelect(member)}
      >
        {/* Expand Toggle */}
        <TableCell className="w-[50px]">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleToggleExpand}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>

        {/* Character Name */}
        <TableCell className="w-[150px] font-medium">
          <div className="flex items-center gap-2">
            <ClassIcon className={member.class} variant="icon" size="sm" />
            <span className={`class-${member.class.toLowerCase()}`}>
              {member.name}
            </span>
          </div>
        </TableCell>

        {/* Rank */}
        <TableCell className="w-[100px]">
          <Badge variant="outline">{member.rank}</Badge>
        </TableCell>

        {/* Class */}
        <TableCell className="w-[100px]">
          <ClassIcon className={member.class} variant="text" showText />
        </TableCell>

        {/* Role */}
        <TableCell className="w-[90px]">
          {member.role && (
            <RoleIcon role={member.role} variant="both" size="sm" showText />
          )}
        </TableCell>

        {/* Spec */}
        <TableCell className="w-[120px]">
          {member.spec && (
            <SpecIcon
              className={member.class}
              spec={member.spec}
              size="sm"
              showText
            />
          )}
        </TableCell>

        {/* Attendance */}
        <TableCell className="w-[110px]">
          {member.attendance ? (
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
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
        </TableCell>
      </TableRow>

      {/* Expanded Row Details */}
      {isExpanded && (
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={7} className="p-0 border-0">
            <div className="p-4 bg-muted/30 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Player Info */}
                {member.playerName && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Player Name</h4>
                    <p className="text-sm text-muted-foreground">
                      {member.playerName}
                    </p>
                  </div>
                )}

                {/* Join Date */}
                {member.joinDate && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Joined</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(member.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}

                {/* Off-Spec */}
                {member.offSpec && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Off-Spec</h4>
                    <SpecIcon
                      className={member.class}
                      spec={member.offSpec}
                      size="sm"
                      showText
                    />
                  </div>
                )}

                {/* Extra Roles */}
                {member.extraRoles && member.extraRoles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Guild Roles</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.extraRoles.map((role) => (
                        <Badge key={role} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professions */}
                {member.professions && member.professions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Professions</h4>
                    <div className="space-y-1">
                      {member.professions.map((prof, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground">
                          {prof.profession} ({prof.skill})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attunements */}
                <div>
                  <h4 className="text-sm font-semibold mb-1">Attunements</h4>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(member.attunements).map(
                      ([key, completed]) =>
                        completed && (
                          <Badge key={key} variant="secondary">
                            {key.toUpperCase()}
                          </Badge>
                        )
                    )}
                    {Object.values(member.attunements).every((v) => !v) && (
                      <span className="text-sm text-muted-foreground">
                        None
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {member.notes && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Notes</h4>
                  <p className="text-sm text-muted-foreground">{member.notes}</p>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export function RosterTable() {
  const filteredMembers = useRosterStore((state) => state.filteredMembers);
  const setSelectedMember = useRosterStore((state) => state.setSelectedMember);
  const sort = useRosterStore((state) => state.sort);
  const setSortField = useRosterStore((state) => state.setSortField);
  const toggleSortDirection = useRosterStore(
    (state) => state.toggleSortDirection
  );

  const handleSort = (field: RosterSortField) => {
    if (sort.field === field) {
      toggleSortDirection();
    } else {
      setSortField(field);
    }
  };

  const getSortIcon = (field: RosterSortField) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? (
      <ArrowUp className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-1" />
    );
  };

  const handleRowClick = (member: RosterMember) => {
    if (member.id) {
      setSelectedMember(member.id);
    }
  };

  if (filteredMembers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No members found matching the current filters.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="table-fixed min-w-[780px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[150px] text-left">
              <Button
                variant="ghost"
                onClick={() => handleSort('name')}
                className="flex items-center p-0 h-auto font-semibold hover:bg-transparent"
              >
                Name
                {getSortIcon('name')}
              </Button>
            </TableHead>
            <TableHead className="w-[100px] text-left">
              <Button
                variant="ghost"
                onClick={() => handleSort('rank')}
                className="flex items-center p-0 h-auto font-semibold hover:bg-transparent"
              >
                Rank
                {getSortIcon('rank')}
              </Button>
            </TableHead>
            <TableHead className="w-[100px] text-left">
              <Button
                variant="ghost"
                onClick={() => handleSort('class')}
                className="flex items-center p-0 h-auto font-semibold hover:bg-transparent"
              >
                Class
                {getSortIcon('class')}
              </Button>
            </TableHead>
            <TableHead className="w-[90px] text-left">Role</TableHead>
            <TableHead className="w-[120px] text-left">Spec</TableHead>
            <TableHead className="w-[110px] text-left">
              <Button
                variant="ghost"
                onClick={() => handleSort('attendance')}
                className="flex items-center p-0 h-auto font-semibold hover:bg-transparent"
              >
                Attendance
                {getSortIcon('attendance')}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <RosterTableRow
              key={member.id}
              member={member}
              onSelect={handleRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
