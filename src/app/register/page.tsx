'use client';

import { useState } from 'react';
import { RegisterForm } from '@/components/auth/register-form';
import { Logo } from '@/components/logo';
import { RotatingArtBackground } from '@/components/auth/rotating-art-background';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'fast'>('slow');

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 overflow-hidden">
      <RotatingArtBackground animationSpeed={animationSpeed} />
      <Card className="w-full max-w-md shadow-xl border-2 z-10 bg-card/80 backdrop-blur-sm">
        <CardHeader className="items-center text-center space-y-4">
          <Logo />
          <div className="space-y-1">
            <CardTitle className="font-headline text-2xl">
              Welcome to E-Mitra
            </CardTitle>
            <CardDescription>
              Safe Travel Richer Culture
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <RegisterForm setAnimationSpeed={setAnimationSpeed} />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Are you an administrator?{' '}
            <Link
              href="/admin"
              className="font-semibold text-primary hover:underline"
            >
              Go to Admin Panel
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
