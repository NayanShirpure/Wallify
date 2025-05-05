
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Contact Us - Wallify',
  description: 'Contact Wallify support',
};

// Basic Contact Form component (client-side for interaction)
// In a real app, this would likely involve state and form handling
// For now, it's just the structure.
function ContactForm() {
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


export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground dark flex flex-col">
       <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
            <ArrowLeft className="h-5 w-5" />
            Back to Wallify
          </Link>
          <h1 className="text-xl font-bold text-primary">Contact Us</h1>
           <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>
      <main className="flex flex-grow flex-col items-center justify-center p-4 py-8 md:p-6 md:py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-primary">Get in Touch</h2>
          <p className="text-muted-foreground">Have questions or feedback? Let us know!</p>
        </div>
        {/* Render the client component */}
        {/* In a real app, form handling would be client-side */}
        <ContactForm />
      </main>
       <footer className="mt-auto border-t border-border bg-secondary/50 py-4 text-center text-xs text-muted-foreground">
         © {new Date().getFullYear()} Wallify. All rights reserved.
      </footer>
    </div>
  );
}
