// src/components/structured-data.tsx
import type { MinimalThing, MinimalWithContext } from '@/types/schema-dts';

interface StructuredDataProps<T extends MinimalThing> {
  data: MinimalWithContext<T>;
}

export function StructuredData<T extends MinimalThing>({ data }: StructuredDataProps<T>) {
   if (!data || typeof data['@type'] !== 'string') {
     // console.warn('StructuredData: Input data is invalid (null, undefined, or missing @type), skipping render.');
     return null;
   }

   let jsonString: string;
   try {
     jsonString = JSON.stringify(data);
   } catch (error) {
     // console.error('StructuredData: Error stringifying data. Skipping render.', error, data);
     return null; // Don't render if data can't be stringified
   }

   // Construct a simple, relatively stable key.
   // Using @type and a common identifier like url or name.
   const type = data['@type'];
   let identifier = String((data as any).url || (data as any).name || '');
   // Basic sanitization and length limit for the key.
   identifier = identifier.replace(/[^a-zA-Z0-9-_]/g, '').substring(0, 50);
   const key = `structured-data-${type}-${identifier || 'default'}`;

   return (
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{ __html: jsonString }}
       key={key}
     />
   );
}
