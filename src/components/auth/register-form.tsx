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
import { User, Smartphone } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  mobile: z
    .string()
    .refine((val) => /^\d{10,15}$/.test(val), {
      message: 'Please enter a valid mobile number.',
    }),
});

interface RegisterFormProps {
  setAnimationSpeed: (speed: 'slow' | 'fast') => void;
}

export function RegisterForm({ setAnimationSpeed }: RegisterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      mobile: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Speed up animation
    setAnimationSpeed('fast');
    setTimeout(() => setAnimationSpeed('slow'), 1000); // Revert after 1 second

    // Generate a random 6-digit OTP for the prototype
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    toast({
      title: 'OTP Sent (For Proto)',
      description: `Your verification code is: ${otp}`,
      duration: 15000,
    });
    router.push(
      `/verify?name=${encodeURIComponent(
        values.name
      )}&mobile=${encodeURIComponent(values.mobile)}&otp=${otp}`
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="E- Mitra" {...field} className="pl-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <div className="relative">
                 <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FormControl>
                  <Input placeholder="e.g. 1234567890" {...field} className="pl-10" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Sending OTP...' : 'Get OTP'}
        </Button>
      </form>
    </Form>
  );
}
