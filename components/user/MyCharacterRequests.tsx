'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ClassIcon } from '@/components/wow/ClassIcon';
import { Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AdminContext';
import { getUserCharacterRequests, cancelCharacterRequest } from '@/lib/firebase/character-requests';
import type { CharacterRequest } from '@/lib/types/user-profile.types';
import { cn } from '@/lib/utils';
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

export function MyCharacterRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CharacterRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userRequests = await getUserCharacterRequests(user.id);
        setRequests(userRequests);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to load requests');
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [user?.id]);

  const handleCancel = async (requestId: string) => {
    if (!user?.id || !requestId) return;

    try {
      await cancelCharacterRequest(requestId, user.id);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error('Error cancelling request:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="gap-1 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Character Requests</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (requests.length === 0) {
    return null; // Don't show the card if there are no requests
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Character Requests</CardTitle>
        <CardDescription>
          Your pending and past character addition requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border',
                request.status === 'rejected' && 'opacity-60'
              )}
            >
              <div className="flex items-center gap-3">
                <ClassIcon className={request.characterClass} size="md" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{request.characterName}</span>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {request.characterSpec || request.characterClass}
                  </div>
                  {request.reviewNotes && request.status !== 'pending' && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {request.status === 'rejected' ? 'Reason: ' : 'Note: '}
                      {request.reviewNotes}
                    </div>
                  )}
                </div>
              </div>

              {request.status === 'pending' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" title="Cancel request">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Request?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will cancel your request to add {request.characterName} to the roster.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Request</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleCancel(request.id!)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Cancel Request
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
