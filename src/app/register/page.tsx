import { RegisterForm } from '@/components/auth/register-form';
import { Logo } from '@/components/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="items-center text-center space-y-4">
          <Logo />
          <div className="space-y-1">
            <CardTitle className="font-headline text-2xl">
              Welcome to E-Mitra
            </CardTitle>
            <CardDescription>
              Create an account to get started.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <RegisterForm />
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
