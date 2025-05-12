'use client';

import { useEffect } from 'react';
import { useForm as useFormspreeForm, ValidationError } from '@formspree/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Zod schema for validation
const schema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Enter a valid email.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [state, submitToFormspree] = useFormspreeForm("xeoggpoa");
  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    submitToFormspree(data);
  };

  useEffect(() => {
    if (state.succeeded) {
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. We'll get back to you soon.",
      });
      reset(); // Clear form fields
    } else if (state.errors) {
      const formErrors = state.errors.getFormErrors();
      if (formErrors.length > 0) {
        formErrors.forEach((error) =>
          toast({
            title: "Submission Error",
            description: error.message || "An unexpected error occurred.",
            variant: "destructive",
          })
        );
      }
    }
  }, [state.succeeded, state.errors, toast, reset]);

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Your Name"
              className={`bg-input border-input text-foreground ${errors.name ? 'border-destructive ring-destructive' : ''}`}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            <ValidationError prefix="Name" field="name" errors={state.errors} className="text-sm text-destructive" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              className={`bg-input border-input text-foreground ${errors.email ? 'border-destructive ring-destructive' : ''}`}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            <ValidationError prefix="Email" field="email" errors={state.errors} className="text-sm text-destructive" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder="Your message..."
              className={`min-h-[100px] bg-input border-input text-foreground ${errors.message ? 'border-destructive ring-destructive' : ''}`}
            />
            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
            <ValidationError prefix="Message" field="message" errors={state.errors} className="text-sm text-destructive" />
          </div>

          <Button type="submit" disabled={state.submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {state.submitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
