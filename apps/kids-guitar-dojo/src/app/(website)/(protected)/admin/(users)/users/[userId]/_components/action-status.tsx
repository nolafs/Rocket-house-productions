'use client';
import React from 'react';
import SelectRole from './select-role';
import toast from 'react-hot-toast';
import { updateUserRole } from '@rocket-house-productions/actions/server';
import { Label } from '@rocket-house-productions/shadcn-ui';

interface ActionRoleProps {
  userId: string;
  accountId: string;
  role?: string | null | undefined;
}

export const ActionRole = ({ accountId, userId, role }: ActionRoleProps) => {
  const formRef = React.useRef<HTMLFormElement>(null);

  const updateRole = async (data: any) => {
    const formData = new FormData(formRef.current!);

    try {
      const account = await updateUserRole(accountId, userId, formData.get('role') as string);
      if (account) {
        toast.success('User role updated');
      }
    } catch (error) {
      console.error('Failed to update user role', error);
      toast.error('Failed to update user role');
    }
  };

  return (
    <form ref={formRef} onChange={updateRole}>
      <Label htmlFor="role">Role</Label>
      <SelectRole role={role} />
    </form>
  );
};

export default ActionRole;
