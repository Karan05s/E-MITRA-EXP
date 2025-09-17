'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon, Copy } from 'lucide-react';
import type { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';

interface UserIDCardProps {
  user: User;
}

export function UserIDCard({ user }: UserIDCardProps) {
  const { toast } = useToast();
  const formattedId = user.id.replace(/(\d{4})(?=\d)/g, '$1 ');

  const handleCopy = () => {
    navigator.clipboard.writeText(user.id);
    toast({
      title: 'User ID Copied!',
      description: 'You can now use this ID in the admin panel.',
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex-row items-center justify-center space-x-2 pb-4">
        <UserIcon className="h-5 w-5 text-primary" />
        <CardTitle className="text-xl font-headline">Unique User ID</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[60px] flex-col items-center justify-center gap-3 p-2">
        <div className="text-center">
          <p
            className="font-mono text-2xl font-bold tracking-widest text-foreground"
            aria-label={`Your unique ID is ${user.id
              .split('')
              .join(' ')}`}
          >
            {formattedId}
          </p>
          <p className="text-xs text-muted-foreground">
            This is your unique identifier for tracking.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy ID
        </Button>
      </CardContent>
    </Card>
  );
}
