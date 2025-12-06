/**
 * Roster Page
 *
 * Main roster management page with comprehensive filtering, sorting,
 * search, and admin capabilities. Integrates all roster components.
 */

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Settings, Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRosterStore, useRosterStats } from '@/lib/stores/roster-store';
import { RosterSearch } from '@/components/roster/RosterSearch';
import { RosterFilters } from '@/components/roster/RosterFilters';
import { RosterTable } from '@/components/roster/RosterTable';
import { getAllRosterMembers } from '@/lib/firebase/roster';
import type { RosterMember } from '@/lib/types/roster.types';
import { getClassColor } from '@/lib/consts/classes';
import { getRoleColor } from '@/lib/consts/roles';
import type { ClassType } from '@/lib/types/classes.types';
import type { RoleType } from '@/lib/types/roles.types';

// Dynamically import heavy components (only loaded when needed)
const CharacterDetail = dynamic(
  () => import('@/components/roster/CharacterDetail').then((mod) => ({ default: mod.CharacterDetail })),
  { ssr: false }
);

const RosterAdminForm = dynamic(
  () => import('@/components/roster/RosterAdminForm').then((mod) => ({ default: mod.RosterAdminForm })),
  { ssr: false }
);

export default function RosterPage() {
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const isLoading = useRosterStore((state) => state.isLoading);
  const setLoading = useRosterStore((state) => state.setLoading);
  const setMembers = useRosterStore((state) => state.setMembers);
  const members = useRosterStore((state) => state.members);
  const filteredMembers = useRosterStore((state) => state.filteredMembers);
  const isEditMode = useRosterStore((state) => state.isEditMode);
  const setEditMode = useRosterStore((state) => state.setEditMode);

  const stats = useRosterStats();

  // Load roster data on mount
  useEffect(() => {
    loadRosterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRosterData = async () => {
    setLoading(true);
    try {
      // Try to load from Firebase first
      const firebaseMembers = await getAllRosterMembers();
      setMembers(firebaseMembers);

      // Only use mock data if explicitly needed for development
      // Comment out the lines below to start with an empty roster
      // if (firebaseMembers.length === 0) {
      //   console.log('No roster data in Firebase, using mock data');
      //   const mockMembers = await getMockRosterMembers();
      //   setMembers(mockMembers);
      // }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setEditingMemberId(null);
    setIsAdminFormOpen(true);
  };

  const handleEditMember = (member: RosterMember) => {
    if (member.id) {
      setEditingMemberId(member.id);
      setIsAdminFormOpen(true);
    }
  };

  const handleCloseAdminForm = () => {
    setIsAdminFormOpen(false);
    setEditingMemberId(null);
  };

  const editingMember = editingMemberId
    ? members.find((m) => m.id === editingMemberId)
    : null;

  // Calculate max counts for progress bar scaling
  const maxClassCount = Math.max(...Object.values(stats.classCounts), 1);
  const maxRoleCount = Math.max(...Object.values(stats.roleCounts), 1);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Guild Roster</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view all guild members
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* TODO: Implement proper admin authentication */}
          <Button
            variant={isEditMode ? 'default' : 'outline'}
            size="icon"
            onClick={() => setEditMode(!isEditMode)}
            title={isEditMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
          >
            <Settings className="h-4 w-4" />
          </Button>
          {isEditMode && (
            <Button onClick={handleAddMember}>
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          )}
        </div>
      </div>

      {/* Roster Table Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Roster Members</CardTitle>
              <CardDescription>
                {isLoading
                  ? 'Loading...'
                  : `Showing ${filteredMembers.length} of ${members.length} members`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <RosterSearch />
            <div className="flex-shrink-0">
              <RosterFilters />
            </div>
          </div>

          {/* Roster Table */}
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <RosterTable
              isEditMode={isEditMode}
              onEditMember={handleEditMember}
            />
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Core Raiders</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.coreRaiders}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trials</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.trials}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Class & Role Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Class Distribution</CardTitle>
            <CardDescription>Members by class</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <div className="space-y-2">
                {Object.entries(stats.classCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([className, count]) => {
                    const color = getClassColor(className as ClassType);
                    const percentage = (count / maxClassCount) * 100;
                    return (
                      <div key={className} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ color }}>{className}</span>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Role Distribution</CardTitle>
            <CardDescription>Members by raid role</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.roleCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([role, count]) => {
                    const color = getRoleColor(role as RoleType);
                    const percentage = (count / maxRoleCount) * 100;
                    const totalPercentage = stats.totalMembers > 0
                      ? Math.round((count / stats.totalMembers) * 100)
                      : 0;
                    return (
                      <div key={role} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ color }}>{role}</span>
                          <span className="text-muted-foreground">
                            {count} <span className="text-xs">({totalPercentage}%)</span>
                          </span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Character Detail Modal */}
      <CharacterDetail />

      {/* Admin Form Modal */}
      <RosterAdminForm
        isOpen={isAdminFormOpen}
        onClose={handleCloseAdminForm}
        editingMember={editingMember}
      />
    </div>
  );
}
