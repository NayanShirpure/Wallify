import type { Thing, WithContext } from 'schema-dts';

interface StructuredDataProps<T extends Thing & { "@type": string }> {
  data: WithContext<T>;
}

export function StructuredData<T extends Thing & { "@type": string }>({ data }: StructuredDataProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      key={`structured-data-${data['@type']}-${(data as any).url || (data as any).name || JSON.stringify(data).substring(0,50)}`}
    />
  );
}
