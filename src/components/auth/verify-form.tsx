'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/types';
import { registerUser } from '@/app/actions';

const formSchema = z.object({
  otp: z
    .string()
    .min(6, 'OTP must be 6 digits.')
    .max(6, 'OTP must be 6 digits.'),
});

interface VerifyFormProps {
  name: string;
  mobile: string;
}

export function VerifyForm({ name, mobile }: VerifyFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, we'd verify the OTP with a backend. Here we mock success.
    console.log('Verifying OTP:', values.otp);
    const newUser: User = {
      id: Math.random().toString().slice(2, 14),
      name,
      mobile,
    };

    // "Register" the user in our mock database
    await registerUser(newUser);

    localStorage.setItem('e-mitra-user', JSON.stringify(newUser));
    toast({
      title: 'Verification Successful!',
      description: 'Welcome to E-Mitra.',
      variant: 'default',
      className: 'bg-accent text-accent-foreground',
    });
    router.replace('/');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>6-Digit OTP</FormLabel>
              <FormControl>
                <Input
                  placeholder="● ● ● ● ● ●"
                  {...field}
                  type="number"
                  className="text-center tracking-[0.5em]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Verifying...' : 'Verify & Proceed'}
        </Button>
      </form>
    </Form>
  );
}
