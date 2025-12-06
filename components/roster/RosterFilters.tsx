/**
 * RosterFilters Component
 *
 * Comprehensive filtering UI for roster display.
 * Allows filtering by class, role, rank, and attunements.
 * Shows active filter count and provides clear all functionality.
 */

'use client';

import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { useRosterStore, useActiveFilterCount } from '@/lib/stores/roster-store';
import { CLASSES } from '@/lib/consts/classes';
import { ROLES } from '@/lib/consts/roles';
import { GUILD_RANKS } from '@/lib/types/roster.types';
import { CLASSIC_ATTUNEMENTS } from '@/lib/types/roster.types';
import { ClassIcon } from '@/components/wow/ClassIcon';
import { RoleIcon } from '@/components/wow/RoleIcon';
import { cn } from '@/lib/utils';

export function RosterFilters() {
  const filters = useRosterStore((state) => state.filters);
  const toggleClassFilter = useRosterStore((state) => state.toggleClassFilter);
  const toggleRoleFilter = useRosterStore((state) => state.toggleRoleFilter);
  const toggleRankFilter = useRosterStore((state) => state.toggleRankFilter);
  const toggleAttunementFilter = useRosterStore(
    (state) => state.toggleAttunementFilter
  );
  const clearFilters = useRosterStore((state) => state.clearFilters);
  const activeFilterCount = useActiveFilterCount();

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Class Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              filters.classes.length > 0 && 'border-primary text-primary'
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Class
            {filters.classes.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filters.classes.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Class</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {CLASSES.map((className) => (
            <DropdownMenuCheckboxItem
              key={className}
              checked={filters.classes.includes(className)}
              onCheckedChange={() => toggleClassFilter(className)}
            >
              <ClassIcon
                className={className}
                variant="both"
                size="sm"
                showText
              />
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Role Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              filters.roles.length > 0 && 'border-primary text-primary'
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Role
            {filters.roles.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filters.roles.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ROLES.map((role) => (
            <DropdownMenuCheckboxItem
              key={role}
              checked={filters.roles.includes(role)}
              onCheckedChange={() => toggleRoleFilter(role)}
            >
              <RoleIcon role={role} variant="both" size="sm" showText />
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rank Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              filters.ranks.length > 0 && 'border-primary text-primary'
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Rank
            {filters.ranks.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filters.ranks.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>Filter by Rank</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {GUILD_RANKS.map((rank) => (
            <DropdownMenuCheckboxItem
              key={rank}
              checked={filters.ranks.includes(rank)}
              onCheckedChange={() => toggleRankFilter(rank)}
            >
              {rank}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Attunement Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              (filters.attunements?.length || 0) > 0 &&
                'border-primary text-primary'
            )}
          >
            <Filter className="h-4 w-4 mr-2" />
            Attunements
            {(filters.attunements?.length || 0) > 0 && (
              <Badge variant="secondary" className="ml-2">
                {filters.attunements?.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by Attunements</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {CLASSIC_ATTUNEMENTS.filter((att) => att.released).map((attunement) => (
            <DropdownMenuCheckboxItem
              key={attunement.name}
              checked={filters.attunements?.includes(attunement.name) || false}
              onCheckedChange={() => toggleAttunementFilter(attunement.name)}
            >
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: attunement.color }}
              />
              {attunement.displayName}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear All Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-2" />
          Clear All
          <Badge variant="secondary" className="ml-2">
            {activeFilterCount}
          </Badge>
        </Button>
      )}
    </div>
  );
}
