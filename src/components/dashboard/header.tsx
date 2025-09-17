'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, Menu } from 'lucide-react';
import type { User } from '@/types';
import Link from 'next/link';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onProfileClick: () => void;
}

export function Header({ user, onLogout, onProfileClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-card p-4">
      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" onClick={onProfileClick}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open Profile</span>
        </Button>
        <Logo />
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
          Welcome, {user.name}
        </span>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin" title="Admin Panel">
            <Shield className="h-5 w-5" />
            <span className="sr-only">Admin Panel</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Log out</span>
        </Button>
      </div>
    </header>
  );
}
