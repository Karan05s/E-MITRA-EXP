'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  HelpCircle,
  Send,
  Loader,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { guideChat } from '@/app/actions';
import type { ChatMessage, User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FloatingChatProps {
  user: User;
}

const suggestedQuestions = [
  'What are red zones?',
  'How does the SOS button work?',
  'What is my Unique User ID for?',
  'Tell me about the admin panel.',
];

export function FloatingChat({ user }: FloatingChatProps) {
  const [isOpen, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSend = async (messageContent?: string) => {
    const content = (messageContent || input).trim();
    if (!content) return;

    const userMessage: ChatMessage = { role: 'user', content };
    const currentMessages = [...messages, userMessage];

    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    const result = await guideChat(currentMessages);

    if (result.success && result.data) {
      const modelMessage: ChatMessage = { role: 'model', content: result.data };
      setMessages((prev) => [...prev, modelMessage]);
    } else {
      const errorMessage = result.error || 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Chat Error',
        description: errorMessage,
      });
      setMessages(messages); // Revert optimistic update
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          role: 'model',
          content: `Hi ${user.name}! I'm your E-Mitra guide. How can I help you understand the app?`,
        },
      ]);
      setError(null);
      setInput('');
    }
  }, [isOpen, user.name]);

  const showSuggestedQuestions =
    !isLoading &&
    messages.length > 0 &&
    messages[messages.length - 1].role === 'model';

  return (
    <>
      <Button
        className="fixed bottom-4 left-4 z-20 h-16 w-16 rounded-full shadow-lg"
        onClick={() => setOpen(true)}
      >
        <HelpCircle className="h-8 w-8" />
        <span className="sr-only">Open App Guide Chat</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="flex h-[90vh] max-h-[700px] w-[95vw] max-w-2xl flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              E-Mitra App Guide
            </DialogTitle>
            <DialogDescription>
              Ask me anything about how to use the app.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-grow" ref={scrollAreaRef}>
            <div className="space-y-4 p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-end gap-2',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-lg px-3 py-2 text-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'whitespace-pre-wrap bg-muted text-muted-foreground'
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {showSuggestedQuestions && (
                <div className="flex flex-col items-start gap-2 pt-4">
                  <p className="px-2 text-sm text-muted-foreground">
                    Or ask about a feature:
                  </p>
                  {suggestedQuestions.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      className="h-auto w-auto"
                      onClick={() => handleSend(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              )}
              {isLoading && (
                <div className="flex items-end justify-start gap-2">
                  <Avatar className="h-8 w-8">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                  </Avatar>
                  <div className="max-w-[75%] rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                    <Loader className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="flex items-center gap-2 border-t p-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about app features..."
              disabled={isLoading}
              className="flex-grow"
            />
            <Button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
