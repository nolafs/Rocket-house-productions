import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rocket-house-productions/shadcn-ui';
import { db } from '@rocket-house-productions/integration';

function ItemCard({
  firstName,
  lastName,
  email,
  spend,
}: {
  firstName?: string;
  lastName?: string;
  email: string;
  spend: string;
}) {
  const firstLetter = firstName?.charAt(0) || email.charAt(0);
  const secondLetter = lastName?.charAt(0) || '';

  return (
    <div className="flex items-center gap-4">
      <Avatar className="hidden h-9 w-9 sm:flex">
        <AvatarImage src="/avatars/01.png" alt="Avatar" />
        <AvatarFallback>
          {firstLetter}
          {secondLetter}
        </AvatarFallback>
      </Avatar>
      <div className="grid gap-1">
        <p className="text-sm font-medium leading-none">
          {firstName} {lastName}
        </p>
        <p className="text-muted-foreground text-sm">{email}</p>
      </div>
      <div className="ml-auto font-medium">+{spend}</div>
    </div>
  );
}

export async function CardRecentSales() {
  const purchases = await db.purchase.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      amount: true,
      account: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  return (
    <Card x-chunk="dashboard-01-chunk-5">
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {purchases.map(purchase => (
          <ItemCard
            key={purchase.id}
            firstName={purchase.account.firstName || ''}
            lastName={purchase.account.lastName || ''}
            email={purchase.account.email || ''}
            spend={new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(purchase.amount / 100)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default CardRecentSales;
