'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
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
import { User as UserIcon, Phone, Trash2, PlusCircle } from 'lucide-react';
import type { User, EmergencyContact } from '@/types';

interface ProfileSidebarProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User;
  emergencyContacts: EmergencyContact[];
  onEmergencyContactsChange: (contacts: EmergencyContact[]) => void;
}

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().refine((val) => /^\d{10,15}$/.test(val), {
    message: 'Please enter a valid phone number.',
  }),
});

export function ProfileSidebar({
  isOpen,
  onOpenChange,
  user,
  emergencyContacts,
  onEmergencyContactsChange,
}: ProfileSidebarProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newContact = { name: values.name, phone: values.phone };
    onEmergencyContactsChange([...emergencyContacts, newContact]);
    toast({
      title: 'Contact Added',
      description: `${values.name} has been added to your emergency contacts.`,
    });
    form.reset();
  }
  
  function removeContact(indexToRemove: number) {
    const contactToRemove = emergencyContacts[indexToRemove];
    onEmergencyContactsChange(emergencyContacts.filter((_, index) => index !== indexToRemove));
    toast({
      variant: 'destructive',
      title: 'Contact Removed',
      description: `${contactToRemove.name} has been removed.`,
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <UserIcon />
            Your Profile
          </SheetTitle>
          <SheetDescription>
            View your details and manage emergency contacts.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
            <p>{user.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Registered Mobile
            </h3>
            <p className="font-mono">{user.mobile}</p>
          </div>
        </div>

        <Separator />

        <div className="flex-grow overflow-y-auto pt-4">
          <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/50">
               <h4 className="font-medium flex items-center gap-2 text-sm"><PlusCircle className="h-4 w-4" /> Add New Contact</h4>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="sm" className="w-full">
                Add Contact
              </Button>
            </form>
          </Form>
          
          <div className="space-y-3">
             {emergencyContacts.length > 0 ? (
                emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-semibold text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{contact.phone}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeContact(index)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                       <span className="sr-only">Remove {contact.name}</span>
                    </Button>
                  </div>
                ))
             ) : (
                <p className="text-sm text-center text-muted-foreground py-4">No emergency contacts added yet.</p>
             )}
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}
