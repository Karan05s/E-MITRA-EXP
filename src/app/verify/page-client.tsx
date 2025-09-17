'use client';

import { VerifyForm } from '@/components/auth/verify-form';
import { Logo } from '@/components/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function VerifyPageClient() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const mobile = searchParams.get('mobile');
  const otp = searchParams.get('otp');

  return (
    <Card className="w-full max-w-md shadow-xl border-2">
      <CardHeader className="items-center space-y-4 text-center">
        <Logo />
        <div className="space-y-1">
          <CardTitle className="font-headline text-2xl">
            Verify Your Identity
          </CardTitle>
          {mobile && (
            <CardDescription>
              An OTP has been sent to your device. Please enter it below.
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {name && mobile && otp ? (
          <>
            <Alert className="mb-4">
              <Terminal className="h-4 w-4" />
              <AlertDescription>
                Check the in-app notification for your OTP.
              </AlertDescription>
            </Alert>
            <VerifyForm name={name} mobile={mobile} otp={otp} />
          </>
        ) : (
          <div className="text-center">
            <p className="text-sm text-destructive">
              Missing user details or OTP.
            </p>
            <Link
              href="/register"
              className="text-sm text-primary hover:underline"
            >
              Go back to registration.
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
