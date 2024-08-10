import React from 'react';
import { db } from '@rocket-house-productions/integration';
import { Label } from '@rocket-house-productions/shadcn-ui';
import SelectRole from './select-role';
import { clerkClient } from '@clerk/nextjs/server';

interface ActionRoleProps {
  userId: string;
}

export const ActionRole = async ({ userId }: ActionRoleProps) => {
  console.log('USER ID', userId);

  const user = await db.account.findFirst({
    where: {
      userId: userId,
    },
  });

  const updateRole = async (formData: any) => {
    'use server';
    console.log(formData);
    try {
      await db.account.update({
        where: {
          userId: userId,
        },
        data: {
          role: formData,
        },
      });

      await clerkClient().users.updateUserMetadata(userId, {
        publicMetadata: {
          role: formData,
        },
      });
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  return (
    <form>
      <Label htmlFor="role">Role</Label>
      <SelectRole role={user?.role} updateRole={updateRole} />
    </form>
  );
};

export default ActionRole;
