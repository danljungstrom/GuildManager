import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';

/**
 * 404 Not Found Page
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Page not found</CardTitle>
          </div>
          <CardDescription>
            The page you&apos;re looking for doesn&apos;t exist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The URL you entered may be incorrect, or the page may have been moved.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">
              Return to homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist',
};
