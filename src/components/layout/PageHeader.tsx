
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  backHref: string;
  backTextDesktop: string;
  backTextMobile: string;
  children?: ReactNode; // For actions on the right like ThemeToggle
}

export function PageHeader({
  title,
  backHref,
  backTextDesktop,
  backTextMobile,
  children,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm print:hidden">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
        <Link
          href={backHref}
          className="flex items-center gap-1 sm:gap-1.5 text-sm sm:text-base font-semibold text-primary hover:text-accent transition-colors flex-shrink-0"
          aria-label={`Back to ${backTextDesktop.toLowerCase().includes('wallify') || backTextMobile.toLowerCase().includes('home') ? 'previous page or home' : backTextDesktop }`}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="hidden sm:inline">{backTextDesktop}</span>
          <span className="sm:hidden">{backTextMobile}</span>
        </Link>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base sm:text-lg md:text-xl font-bold text-primary whitespace-nowrap px-2 overflow-hidden text-ellipsis max-w-[70%] text-center">
        {/* <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary whitespace-nowrap text-center flex-1 min-w-0 overflow-hidden text-ellipsis px-2"> */}
          {title}
        </h1>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {children}
        </div>
      </div>
    </header>
  );
}
