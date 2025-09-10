'use client';

import {
  Siren,
  Lightbulb,
  MessageSquare,
  Languages,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionsBarProps {
  onSos: () => void;
  onSuggestions: () => void;
  onTranslate: () => void;
}

export function ActionsBar({
  onSos,
  onSuggestions,
  onTranslate,
}: ActionsBarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 w-full border-t bg-card/80 p-2 backdrop-blur-sm">
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
        <ActionButton
          icon={Lightbulb}
          label="Tips"
          onClick={onSuggestions}
          variant="ghost"
        />
        <ActionButton
          icon={Languages}
          label="Translate"
          onClick={onTranslate}
          variant="ghost"
        />
        <ActionButton
          icon={Siren}
          label="SOS"
          onClick={onSos}
          variant="destructive"
          className="animate-pulse"
        />
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant: 'destructive' | 'ghost';
  className?: string;
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  variant,
  className,
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      className={`flex h-14 flex-col items-center justify-center gap-1 rounded-2xl ${className}`}
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}
