/**
 * Roster Professions Page
 *
 * View guild member professions organized by profession type
 */

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ProfessionIcon } from "@/components/wow/ProfessionIcon"
import { useRosterStore } from '@/lib/stores/roster-store';
import { getAllRosterMembers } from '@/lib/firebase/roster';
import type { Profession } from '@/lib/types/professions.types';
import type { RosterMember, ProfessionEntry } from '@/lib/types/roster.types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const professions: Profession[] = [
  'Alchemy', 'Blacksmithing', 'Enchanting', 'Engineering',
  'Herbalism', 'Leatherworking', 'Mining', 'Skinning',
  'Tailoring', 'Cooking', 'Fishing'
];

// Map profession to members with that profession
interface ProfessionMemberEntry {
  member: RosterMember;
  skill: number;
}

export default function RosterProfessionsPage() {
  const isLoading = useRosterStore((state) => state.isLoading);
  const setLoading = useRosterStore((state) => state.setLoading);
  const members = useRosterStore((state) => state.members);
  const setMembers = useRosterStore((state) => state.setMembers);

  // Load roster data on mount
  useEffect(() => {
    loadRosterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRosterData = async () => {
    setLoading(true);
    try {
      const firebaseMembers = await getAllRosterMembers();
      setMembers(firebaseMembers);
    } finally {
      setLoading(false);
    }
  };

  // Group members by profession
  const membersByProfession = members.reduce((acc, member) => {
    member.professions?.forEach((profEntry: ProfessionEntry) => {
      if (!acc[profEntry.profession]) {
        acc[profEntry.profession] = [];
      }
      acc[profEntry.profession].push({
        member,
        skill: profEntry.skill
      });
    });
    return acc;
  }, {} as Record<Profession, ProfessionMemberEntry[]>);

  // Sort members by skill level (highest first)
  Object.keys(membersByProfession).forEach((prof) => {
    membersByProfession[prof as Profession].sort((a, b) => b.skill - a.skill);
  });

  // Get skill level badge color
  const getSkillColor = (skill: number): string => {
    if (skill >= 300) return 'bg-orange-500/20 text-orange-400 border-orange-500/30'; // Master
    if (skill >= 225) return 'bg-purple-500/20 text-purple-400 border-purple-500/30'; // Expert
    if (skill >= 150) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'; // Artisan
    if (skill >= 75) return 'bg-green-500/20 text-green-400 border-green-500/30'; // Journeyman
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30'; // Apprentice
  };

  // Get skill level name
  const getSkillLabel = (skill: number): string => {
    if (skill >= 300) return 'Master';
    if (skill >= 225) return 'Expert';
    if (skill >= 150) return 'Artisan';
    if (skill >= 75) return 'Journeyman';
    return 'Apprentice';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/roster">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary">Guild Professions</h1>
          <p className="text-muted-foreground mt-2">
            Track guild member professions and their skill levels
          </p>
        </div>
      </div>

      {/* Profession Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {professions.map((profession) => (
            <Card key={profession}>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {professions.map((profession) => {
            const professionMembers = membersByProfession[profession] || [];
            const hasMembers = professionMembers.length > 0;

            // Get average skill level
            const avgSkill = hasMembers
              ? Math.round(
                  professionMembers.reduce((sum, entry) => sum + entry.skill, 0) /
                    professionMembers.length
                )
              : 0;

            // Count masters (300 skill)
            const masters = professionMembers.filter((entry) => entry.skill >= 300).length;

            return (
              <Card key={profession} className={!hasMembers ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <ProfessionIcon profession={profession} size="sm" />
                    <CardTitle className="text-base">{profession}</CardTitle>
                  </div>
                  <CardDescription>
                    {hasMembers
                      ? `${professionMembers.length} member${professionMembers.length !== 1 ? 's' : ''}`
                      : 'No members'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hasMembers ? (
                    <>
                      {/* Statistics */}
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className={getSkillColor(avgSkill)}>
                          Avg: {avgSkill} ({getSkillLabel(avgSkill)})
                        </Badge>
                        {masters > 0 && (
                          <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            {masters} Master{masters !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>

                      {/* Member List */}
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground">Members</p>
                        <div className="space-y-1">
                          {professionMembers.slice(0, 8).map(({ member, skill }) => (
                            <div
                              key={`${member.id}-${profession}`}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="truncate">{member.name}</span>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getSkillColor(skill)}`}
                              >
                                {skill}
                              </Badge>
                            </div>
                          ))}
                          {professionMembers.length > 8 && (
                            <p className="text-xs text-muted-foreground italic pt-1">
                              +{professionMembers.length - 8} more...
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No guild members with {profession.toLowerCase()}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
