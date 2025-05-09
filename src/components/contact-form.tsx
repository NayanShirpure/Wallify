
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm, ValidationError } from '@formspree/react';
import type { FormError } from '@formspree/react'; // FieldValues might not be needed
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';


export function ContactForm() {
  const [state, handleSubmit] = useForm("xeoggpoa"); 
  const { toast } = useToast();

  useEffect(() => {
    if (state.succeeded) {
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. We'll get back to you soon.",
      });
      // Formspree typically resets the form on success or you can manually reset if needed.
      // e.g., if you have access to the form event: (event.target as HTMLFormElement).reset();
      // For @formspree/react, relying on its internal state management for reset is common.
    } else if (state.errors && state.errors.length > 0) {
      // state.errors is an array of FormError objects
      // FormError: { code?: string | null; field?: string; message: string; }

      // Display form-level errors (errors without a 'field' property) as toasts
      const formLevelErrors = state.errors.filter(err => !err.field);

      if (formLevelErrors.length > 0) {
        formLevelErrors.forEach(error => {
          toast({
            title: "Submission Error",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          });
        });
      }
      // Field-level errors are handled by the <ValidationError /> components below.
      // A generic toast for "please check the form" could be added here if desired,
      // but might be redundant if field errors are clearly shown.
    }
  }, [state.succeeded, state.errors, toast]);


  if (state.succeeded) {
      return (
        <Card className="w-full max-w-lg border-border bg-card shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl text-card-foreground">Message Sent!</CardTitle>
                <CardDescription className="text-muted-foreground">
                Thank you for contacting us. We will get back to you shortly.
                </CardDescription>
            </CardHeader>
        </Card>
      );
  }

  return (
    <Card className="w-full max-w-lg border-border bg-card shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-card-foreground">Send us a message</CardTitle>
        <CardDescription className="text-muted-foreground">
          We'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground">Name</Label>
            <Input id="name" name="name" placeholder="Your Name" required className="bg-input border-input text-foreground" />
            <ValidationError prefix="Name" field="name" errors={state.errors} className="text-destructive text-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-card-foreground">Email</Label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" required className="bg-input border-input text-foreground" />
            <ValidationError prefix="Email" field="email" errors={state.errors} className="text-destructive text-sm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-card-foreground">Message</Label>
            <Textarea id="message" name="message" placeholder="Your message..." required className="min-h-[100px] bg-input border-input text-foreground" />
            <ValidationError prefix="Message" field="message" errors={state.errors} className="text-destructive text-sm" />
          </div>
          <Button type="submit" disabled={state.submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {state.submitting ? 'Sending...' : 'Send Message'}
          </Button>
          {/* Display form-level errors (errors without a 'field' property) inline below the button */}
          {state.errors && state.errors.filter(err => !err.field).length > 0 && (
            <div className="mt-2 text-sm text-destructive">
                {state.errors.filter(err => !err.field).map((error, index) => (
                    <p key={`form-error-${index}`}>{error.message}</p>
                ))}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

