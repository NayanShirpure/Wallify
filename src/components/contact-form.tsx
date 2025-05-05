
'use client'; // Mark this component as a Client Component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// Basic Contact Form component (client-side for interaction)
export function ContactForm() {
    // Placeholder action - replace with actual form submission logic
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        alert('Contact form submission is not implemented in this demo.');
        // Add form submission logic here (e.g., using fetch or a library)
    };

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
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-card-foreground">Email</Label>
            <Input id="email" name="email" type="email" placeholder="your@email.com" required className="bg-input border-input text-foreground" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-card-foreground">Message</Label>
            <Textarea id="message" name="message" placeholder="Your message..." required className="min-h-[100px] bg-input border-input text-foreground" />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
