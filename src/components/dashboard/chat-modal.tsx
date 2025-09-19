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
import { MessageCircle, Send, Loader, AlertTriangle } from 'lucide-react';
import { chat } from '@/app/actions';
import type { ChatMessage, User } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ChatModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User;
}

const suggestedQuestions = [
  'What are some tips for solo travelers?',
  'How do I stay safe in a new city?',
  'What should I do if I feel unsafe?',
];

export function ChatModal({ isOpen, onOpenChange, user }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSend = async (messageContent?: string) => {
    const content = (messageContent || input).trim();
    if (!content) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content,
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    const result = await chat(currentMessages);

    if (result.success && result.data) {
      const modelMessage: ChatMessage = {
        role: 'model',
        content: result.data,
      };
      setMessages((prev) => [...prev, modelMessage]);
    } else {
      const errorMessage = result.error || 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Chat Error',
        description: errorMessage,
      });
      // Revert optimistic update
      setMessages(messages);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      // Reset chat on open
      setMessages([
        {
          role: 'model',
          content: `Hi ${user.name}! I'm Mitra, your personal safety assistant. How can I help you today?`,
        },
      ]);
      setError(null);
      setInput('');
    }
  }, [isOpen, user.name]);

  const showSuggestedQuestions = !isLoading && messages.length > 0 && messages[messages.length - 1].role === 'model';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-[700px] w-[95vw] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="text-primary" />
            Chat with Mitra
          </DialogTitle>
          <DialogDescription>
            Your AI-powered personal safety assistant.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow" ref={scrollAreaRef}>
          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'model' && (
                  <Avatar className="h-8 w-8">
                    <div className="bg-primary/20 flex items-center justify-center w-full h-full">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground whitespace-pre-wrap'
                  }`}
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
                <p className="text-sm text-muted-foreground px-2">
                  Or try one of these:
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
              <div className="flex items-end gap-2 justify-start">
                <Avatar className="h-8 w-8">
                  <div className="bg-primary/20 flex items-center justify-center w-full h-full">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                </Avatar>
                <div className="max-w-[75%] rounded-lg px-3 py-2 text-sm bg-muted text-muted-foreground">
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
            placeholder="Type your message..."
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
  );
}
