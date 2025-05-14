
// src/types/schema-dts.ts

// Basic Thing type
export interface MinimalThing {
  "@type": string;
  name?: string;
  description?: string;
  url?: string;
  image?: string | { "@type": "ImageObject"; url: string; width?: number; height?: number };
  [key: string]: any; // Allow other properties
}

// Wrapper to add @context
export interface MinimalWithContext<T extends MinimalThing> {
  "@context": "https://schema.org";
  "@type": T["@type"]; // Ensure @type matches the generic
  [key: string]: any; // Allow other properties from T, including '@type' itself.
}

// Specific schema types can extend MinimalThing

// WebPage is made generic to allow subtypes to correctly define their @type
export interface WebPage<T_Type extends string = "WebPage"> extends MinimalThing {
    "@type": T_Type;
    // Potential WebPage specific properties can be added here if needed later
}

export interface Organization extends MinimalThing {
    "@type": "Organization";
    logo?: string | { "@type": "ImageObject"; url: string; };
    contactPoint?: ContactPoint | ContactPoint[];
    sameAs?: string[];
}

export interface ContactPoint extends MinimalThing {
    "@type": "ContactPoint";
    contactType?: string;
    telephone?: string;
    email?: string;
    url?: string;
}

export interface ImageObject extends MinimalThing {
  "@type": "ImageObject";
  contentUrl?: string;
  thumbnailUrl?: string;
  width?: { "@type": "Distance"; value: string; unitCode: string } | string | number;
  height?: { "@type": "Distance"; value: string; unitCode: string } | string | number;
  caption?: string;
  encodingFormat?: string;
  uploadDate?: string;
}

// SearchResultsPage extends the generic WebPage, specifying its type
export interface SearchResultsPage extends WebPage<"SearchResultsPage"> {
  // @type is "SearchResultsPage" via WebPage<"SearchResultsPage">
}

// BlogPosting is an article/creative work, not necessarily a WebPage itself.
// It usually appears *on* a WebPage.
export interface BlogPosting extends MinimalThing {
  "@type": "BlogPosting";
  headline?: string;
  datePublished?: string;
  dateModified?: string;
  author?: MinimalThing | MinimalThing[];
  publisher?: MinimalThing;
  mainEntityOfPage?: WebPage<string>; // Can be any type of WebPage
  keywords?: string;
}

// Blog (the collection of posts, typically the blog index page) is a WebPage
export interface Blog extends WebPage<"Blog"> {
  // @type is "Blog" via WebPage<"Blog">
  blogPost?: BlogPosting[];
}

// ContactPage extends the generic WebPage, specifying its type
export interface ContactPage extends WebPage<"ContactPage"> {
  // @type is "ContactPage" via WebPage<"ContactPage">
}

export interface Person extends MinimalThing {
  "@type": "Person";
}

export interface SearchAction extends MinimalThing {
  "@type": "SearchAction";
  target?: { "@type": "EntryPoint"; urlTemplate: string; } | string;
  "query-input"?: string;
}

export interface WebSite extends MinimalThing {
  "@type": "WebSite";
  potentialAction?: SearchAction | SearchAction[];
}

// Distance is used in ImageObject for width/height sometimes
export interface Distance extends MinimalThing {
  "@type": "Distance";
  value: string;
  unitCode: string; // e.g., "E37" for pixel, though often string numbers suffice for schema.org
}

// Removed: export type * from 'schema-dts';
// No longer re-exporting from 'schema-dts' to ensure local minimal types are used.
