'use client';

import { ClerkProvider, UserProfile } from '@clerk/nextjs';
import { Wallet } from 'lucide-react';
import { ParentOrdersTransactions } from '@rocket-house-productions/features';

interface AccountDetailsProps {
  userId: string;
}

export function AccountDetails({ userId }: AccountDetailsProps) {
  return (
    <ClerkProvider dynamic>
      <UserProfile routing="path" path="/courses/account">
        <UserProfile.Page label="Orders" url="orders" labelIcon={<Wallet size={'w-3'} />}>
          <div className="p-4">
            <h2 className="mb-5 text-xl font-semibold">Orders</h2>
            <ParentOrdersTransactions userId={userId} />
          </div>
        </UserProfile.Page>
      </UserProfile>
    </ClerkProvider>
  );
}

export default AccountDetails;
