import { Card, CardContent, CardHeader, CardTitle } from '@rocket-house-productions/shadcn-ui';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import Link from 'next/link';

type Service = {
  name: string;
  description: string;
  url: string;
};

const SERVICES: Service[] = [
  {
    name: 'Prismic',
    description: 'Content management system',
    url: 'https://prismic.io',
  },
  {
    name: 'Stripe',
    description: 'Payment gateway',
    url: 'https://stripe.com',
  },
  {
    name: 'Clerk',
    description: 'Authentication service',
    url: 'https://clerk.dev',
  },
];

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">{service.name}</p>
        <p className="text-muted-foreground text-sm">{service.description}</p>
      </div>
      <div className="ml-auto">
        <Link href={service.url} className={buttonVariants({ size: 'sm' })}>
          Visit
        </Link>
      </div>
    </div>
  );
}

export function CardServiceList() {
  return (
    <Card x-chunk="dashboard-01-chunk-6">
      <CardHeader>
        <CardTitle>Service Links</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {SERVICES.map((service, idx) => (
          <ServiceCard key={idx} service={service} />
        ))}
      </CardContent>
    </Card>
  );
}

export default CardServiceList;
