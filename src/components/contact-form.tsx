
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm, ValidationError } from '@formspree/react';
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
      // Optionally reset the form or redirect
      // e.g., if you have access to the form event: event.target.reset();
    } else if (state.errors && state.errors.length > 0) {
        state.errors.forEach(error => {
             toast({
                title: "Submission Error",
                description: error.message || "An unexpected error occurred.",
                variant: "destructive",
             });
        });
    }
  }, [state.succeeded, state.errors, toast]);


  if (state.succeeded) {
      return (
        <Card className="w-full max-w-lg border-border bg-card">
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
    <Card className="w-full max-w-lg border-border bg-card">
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
          {state.errors && state.errors.formErrors && state.errors.formErrors.length > 0 && (
            <div className="mt-2 text-sm text-destructive">
                {state.errors.formErrors.map((error, index) => (
                    <p key={index}>{error.message}</p>
                ))}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

