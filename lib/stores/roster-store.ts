/**
 * Roster Store
 *
 * Zustand store for managing roster state, including members list,
 * filtering, sorting, search, and admin edit mode.
 */

import { create } from 'zustand';
import type {
  RosterMember,
  RosterFilters,
  RosterSort,
  RosterSortField,
  RosterSortDirection,
} from '@/lib/types/roster.types';
import {
  memberMatchesFilters,
  sortRosterMembers,
} from '@/lib/types/roster.types';
import type { ClassType } from '@/lib/types/classes.types';
import type { RoleType } from '@/lib/types/roles.types';
import type { GuildRank } from '@/lib/types/roster.types';

interface RosterState {
  // Data
  members: RosterMember[];
  filteredMembers: RosterMember[];

  // UI State
  isLoading: boolean;
  error: string | null;
  isEditMode: boolean;
  selectedMemberId: string | null;

  // Filters
  filters: RosterFilters;
  sort: RosterSort;

  // Actions - Data Management
  setMembers: (members: RosterMember[]) => void;
  addMember: (member: RosterMember) => void;
  updateMember: (id: string, updates: Partial<RosterMember>) => void;
  removeMember: (id: string) => void;

  // Actions - UI State
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setEditMode: (isEditMode: boolean) => void;
  setSelectedMember: (id: string | null) => void;

  // Actions - Filtering & Sorting
  setSearchQuery: (query: string) => void;
  toggleClassFilter: (className: ClassType) => void;
  toggleRoleFilter: (role: RoleType) => void;
  toggleRankFilter: (rank: GuildRank) => void;
  toggleAttunementFilter: (attunement: string) => void;
  clearFilters: () => void;
  setSortField: (field: RosterSortField) => void;
  setSortDirection: (direction: RosterSortDirection) => void;
  toggleSortDirection: () => void;

  // Internal helper to recompute filtered members
  _recomputeFilteredMembers: () => void;
}

const defaultFilters: RosterFilters = {
  classes: [],
  roles: [],
  ranks: [],
  attunements: [],
  searchQuery: '',
};

const defaultSort: RosterSort = {
  field: 'class',
  direction: 'asc',
};

export const useRosterStore = create<RosterState>((set, get) => ({
  // Initial state
  members: [],
  filteredMembers: [],
  isLoading: false,
  error: null,
  isEditMode: false,
  selectedMemberId: null,
  filters: defaultFilters,
  sort: defaultSort,

  // Data Management Actions
  setMembers: (members) => {
    set({ members });
    get()._recomputeFilteredMembers();
  },

  addMember: (member) => {
    set((state) => ({
      members: [...state.members, member],
    }));
    get()._recomputeFilteredMembers();
  },

  updateMember: (id, updates) => {
    set((state) => ({
      members: state.members.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      ),
    }));
    get()._recomputeFilteredMembers();
  },

  removeMember: (id) => {
    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
      selectedMemberId: state.selectedMemberId === id ? null : state.selectedMemberId,
    }));
    get()._recomputeFilteredMembers();
  },

  // UI State Actions
  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setEditMode: (isEditMode) => {
    set({ isEditMode });
    // Clear selection when exiting edit mode
    if (!isEditMode) {
      set({ selectedMemberId: null });
    }
  },

  setSelectedMember: (id) => set({ selectedMemberId: id }),

  // Filtering & Sorting Actions
  setSearchQuery: (query) => {
    set((state) => ({
      filters: { ...state.filters, searchQuery: query },
    }));
    get()._recomputeFilteredMembers();
  },

  toggleClassFilter: (className) => {
    set((state) => {
      const classes = state.filters.classes.includes(className)
        ? state.filters.classes.filter((c) => c !== className)
        : [...state.filters.classes, className];
      return {
        filters: { ...state.filters, classes },
      };
    });
    get()._recomputeFilteredMembers();
  },

  toggleRoleFilter: (role) => {
    set((state) => {
      const roles = state.filters.roles.includes(role)
        ? state.filters.roles.filter((r) => r !== role)
        : [...state.filters.roles, role];
      return {
        filters: { ...state.filters, roles },
      };
    });
    get()._recomputeFilteredMembers();
  },

  toggleRankFilter: (rank) => {
    set((state) => {
      const ranks = state.filters.ranks.includes(rank)
        ? state.filters.ranks.filter((r) => r !== rank)
        : [...state.filters.ranks, rank];
      return {
        filters: { ...state.filters, ranks },
      };
    });
    get()._recomputeFilteredMembers();
  },

  toggleAttunementFilter: (attunement) => {
    set((state) => {
      const attunements = state.filters.attunements || [];
      const newAttunements = attunements.includes(attunement)
        ? attunements.filter((a) => a !== attunement)
        : [...attunements, attunement];
      return {
        filters: { ...state.filters, attunements: newAttunements },
      };
    });
    get()._recomputeFilteredMembers();
  },

  clearFilters: () => {
    set({ filters: defaultFilters });
    get()._recomputeFilteredMembers();
  },

  setSortField: (field) => {
    set((state) => ({
      sort: { ...state.sort, field },
    }));
    get()._recomputeFilteredMembers();
  },

  setSortDirection: (direction) => {
    set((state) => ({
      sort: { ...state.sort, direction },
    }));
    get()._recomputeFilteredMembers();
  },

  toggleSortDirection: () => {
    set((state) => ({
      sort: {
        ...state.sort,
        direction: state.sort.direction === 'asc' ? 'desc' : 'asc',
      },
    }));
    get()._recomputeFilteredMembers();
  },

  // Internal helper to recompute filtered and sorted members
  _recomputeFilteredMembers: () => {
    const { members, filters, sort } = get();

    // Apply filters
    let filtered = members.filter((member) =>
      memberMatchesFilters(member, filters)
    );

    // Apply sorting
    filtered = sortRosterMembers(filtered, sort);

    set({ filteredMembers: filtered });
  },
}));

/**
 * Selector hooks for common queries
 */

/**
 * Get active filter count (for UI badges)
 */
export const useActiveFilterCount = () => {
  return useRosterStore((state) => {
    const { filters } = state;
    return (
      filters.classes.length +
      filters.roles.length +
      filters.ranks.length +
      (filters.attunements?.length || 0) +
      (filters.searchQuery ? 1 : 0)
    );
  });
};

/**
 * Get roster statistics
 */
export const useRosterStats = () => {
  const members = useRosterStore((state) => state.filteredMembers);

  const totalMembers = members.length;
  const coreRaiders = members.filter((m) => m.rank === 'Core').length;
  const trials = members.filter((m) => m.rank === 'Trial').length;

  // Class distribution
  const classCounts = members.reduce((acc, member) => {
    acc[member.class] = (acc[member.class] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Role distribution
  const roleCounts = members.reduce((acc, member) => {
    if (member.role) {
      acc[member.role] = (acc[member.role] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Average attendance
  const attendanceValues = members
    .filter((m) => m.attendance?.percentage !== undefined)
    .map((m) => m.attendance!.percentage);
  const avgAttendance =
    attendanceValues.length > 0
      ? Math.round(
          attendanceValues.reduce((sum, val) => sum + val, 0) /
            attendanceValues.length
        )
      : 0;

  return {
    totalMembers,
    coreRaiders,
    trials,
    classCounts,
    roleCounts,
    avgAttendance,
  };
};

/**
 * Check if a specific member is selected
 */
export const useIsMemberSelected = (memberId: string | undefined) => {
  return useRosterStore(
    (state) => memberId !== undefined && state.selectedMemberId === memberId
  );
};
