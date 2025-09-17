'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  Loader,
  ShieldCheck,
  Phone,
  HeartPulse,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSafetySuggestions } from '@/app/actions';
import type { Position, EmergencyContact } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface SosModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  position: Position | null;
  emergencyContacts: EmergencyContact[];
  isMapLoaded: boolean;
}

export function SosModal({
  isOpen,
  onOpenChange,
  position,
  emergencyContacts,
}: SosModalProps) {
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSuggestions = async () => {
    if (!position) {
      setError('Your location is not available. Cannot get suggestions.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    const locationDescription = `User is at latitude ${position.latitude} and longitude ${position.longitude}.`;
    const result = await getSafetySuggestions({ locationDescription });

    if (result.success && result.data) {
      setSuggestions(result.data.suggestions);
    } else {
      setError(result.error || 'An unexpected error occurred.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      // Reset state on open
      setSuggestions(null);
      fetchSuggestions();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle />
            SOS - Emergency Mode
          </DialogTitle>
          <DialogDescription>
            Stay calm. Help is on the way. Below are safety suggestions and
            emergency contacts.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-[150px] rounded-lg border bg-muted p-4 my-4">
          {isLoading && (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <Loader className="mb-2 h-6 w-6 animate-spin" />
              <p>Generating personalized suggestions...</p>
            </div>
          )}
          {error && !suggestions && (
            <div className="flex h-full flex-col items-center justify-center text-destructive">
              <AlertTriangle className="mb-2 h-6 w-6" />
              <p className="text-center font-semibold">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={fetchSuggestions}
              >
                Try Again
              </Button>
            </div>
          )}
          {suggestions && (
            <div className="space-y-2 text-sm text-foreground">
              <h3 className="flex items-center gap-2 font-semibold text-primary">
                <ShieldCheck className="h-4 w-4" />
                Safety Suggestions
              </h3>
              <p className="whitespace-pre-wrap">{suggestions}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            Indian Emergency Contacts
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="tel:100"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <div className="rounded-full bg-primary/10 p-2">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Police</p>
                <p className="text-sm text-muted-foreground">100</p>
              </div>
            </a>
            <a
              href="tel:102"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
            >
              <div className="rounded-full bg-destructive/10 p-2">
                <HeartPulse className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="font-semibold">Ambulance</p>
                <p className="text-sm text-muted-foreground">102</p>
              </div>
            </a>
            <a
              href="tel:112"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted sm:col-span-2"
            >
              <div className="rounded-full bg-accent/20 p-2">
                <ShieldAlert className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-semibold">National Emergency Helpline</p>
                <p className="text-sm text-muted-foreground">112</p>
              </div>
            </a>
          </div>

          {emergencyContacts.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Emergency Contacts
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {emergencyContacts.map((contact, index) => (
                    <a
                      key={index}
                      href={`tel:${contact.phone}`}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
                    >
                      <div>
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {contact.phone}
                        </p>
                      </div>
                      <div className="rounded-full bg-primary/10 p-2">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
