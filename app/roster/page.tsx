/**
 * Roster Page
 *
 * Main roster management page with comprehensive filtering, sorting,
 * search, and admin capabilities. Integrates all roster components.
 */

'use client';

import { useEffect, useState } from 'react';
import { Plus, Settings, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRosterStore, useRosterStats } from '@/lib/stores/roster-store';
import { RosterSearch } from '@/components/roster/RosterSearch';
import { RosterFilters } from '@/components/roster/RosterFilters';
import { RosterTable } from '@/components/roster/RosterTable';
import { CharacterDetail } from '@/components/roster/CharacterDetail';
import { RosterAdminForm } from '@/components/roster/RosterAdminForm';
import { getMockRosterMembers } from '@/lib/mock/roster-data';
import { getAllRosterMembers } from '@/lib/firebase/roster';

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

  const handleEditMember = (memberId: string) => {
    setEditingMemberId(memberId);
    setIsAdminFormOpen(true);
  };

  const handleCloseAdminForm = () => {
    setIsAdminFormOpen(false);
    setEditingMemberId(null);
  };

  const editingMember = editingMemberId
    ? members.find((m) => m.id === editingMemberId)
    : null;

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

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Members</CardTitle>
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
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Core Raiders</CardTitle>
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
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Trials</CardTitle>
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
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Avg Attendance</CardTitle>
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
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Class Distribution</CardTitle>
            <CardDescription>Members by class</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.classCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([className, count]) => (
                    <Badge
                      key={className}
                      variant="outline"
                      className={`class-${className.toLowerCase()}`}
                    >
                      {className}: {count}
                    </Badge>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Role Distribution</CardTitle>
            <CardDescription>Members by raid role</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.roleCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([role, count]) => (
                    <Badge
                      key={role}
                      variant="outline"
                      className={`role-${role.toLowerCase()}`}
                    >
                      {role}: {count}
                    </Badge>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
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
            <RosterTable />
          )}
        </CardContent>
      </Card>

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
