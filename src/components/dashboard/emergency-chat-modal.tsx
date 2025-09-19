'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  MessageCircle,
  Loader,
  AlertTriangle,
  Send,
  MapPin,
  Bot,
  User,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getEmergencyChatResponse } from '@/app/actions';
import type { Position, ChatMessage } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
} from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false,
};

const suggestedPrompts = [
  'I need help, I feel unsafe.',
  'Find the nearest police station.',
  'Where is the closest hospital?',
  'What should I do if I\'m being followed?',
];

interface EmergencyChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  position: Position | null;
  isMapLoaded: boolean;
}

export function EmergencyChatModal({
  isOpen,
  onOpenChange,
  position,
  isMapLoaded,
}: EmergencyChatModalProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = useCallback(async (messageText: string) => {
    const trimmedInput = messageText.trim();
    if (!trimmedInput) {
      return;
    }

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmedInput },
    ];
    setMessages(newMessages);
    setIsLoading(true);
    setInput('');
    setDirections(null); // Clear previous directions

    const result = await getEmergencyChatResponse({
      history: newMessages,
      userPosition: position,
    });

    setIsLoading(false);

    if (result.success && result.data) {
      if (result.data.type === 'text') {
        setMessages([
          ...newMessages,
          { role: 'model', content: result.data.content },
        ]);
      } else if (result.data.type === 'tool-result') {
        const place = result.data.result;
        setMessages([
          ...newMessages,
          {
            role: 'model',
            content: `I've found a route to ${place.name}. It's about ${place.distanceText} away.`,
            toolResult: place,
          },
        ]);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Chat Error',
        description:
          result.error || 'Failed to get a response. Please try again.',
      });
      // Revert optimistic update
      setMessages(messages);
    }
  }, [messages, position, toast]);
  
  // Effect to handle rendering directions
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'model' && lastMessage.toolResult && position && isMapLoaded) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: new window.google.maps.LatLng(position.latitude, position.longitude),
          destination: new window.google.maps.LatLng(lastMessage.toolResult.location.lat, lastMessage.toolResult.location.lng),
          travelMode: window.google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  }, [messages, position, isMapLoaded]);


  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isLoading]);
  
  useEffect(() => {
    // Reset state when modal is closed
    if (!isOpen) {
      setMessages([]);
      setInput('');
      setIsLoading(false);
      setDirections(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="text-primary" />
            Emergency Assistant
          </DialogTitle>
          <DialogDescription>
            Ask for help or directions to a safe place. Your live
            location will be used if available.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow" ref={scrollAreaRef}>
          <div className="space-y-4 p-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'model' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot size={20} />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg px-4 py-2 text-sm sm:max-w-md',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                   {message.toolResult && (
                      <div className="mt-2 space-y-2">
                        <div className="w-full aspect-video rounded-md overflow-hidden border">
                          {isMapLoaded && position ? (
                            <GoogleMap
                              mapContainerStyle={containerStyle}
                              center={{lat: position.latitude, lng: position.longitude}}
                              zoom={15}
                              options={mapOptions}
                            >
                              <MarkerF position={{ lat: position.latitude, lng: position.longitude }} />
                              {directions && <DirectionsRenderer directions={directions} />}
                            </GoogleMap>
                          ) : <Loader className="animate-spin" />}
                        </div>
                        <Button variant="outline" size="sm" asChild className="w-full">
                           <a href={message.toolResult.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open in Google Maps
                           </a>
                        </Button>
                      </div>
                   )}
                </div>
                {message.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot size={20} />
                </div>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <Loader className="animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          {messages.length === 0 && !isLoading && (
            <div className="mb-2 grid grid-cols-2 gap-2 text-xs">
              {suggestedPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  className="h-auto whitespace-normal"
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isLoading}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
              placeholder='Type your message...'
              disabled={isLoading}
            />
            <Button
              size="icon"
              onClick={() => handleSendMessage(input)}
              disabled={isLoading || !input.trim()}
              aria-label="Send Message"
            >
              <Send />
            </Button>
          </div>
           {!position && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                <AlertTriangle className="inline-block h-3 w-3 mr-1" />
                Location is off. The assistant cannot find nearby places for you.
              </p>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
