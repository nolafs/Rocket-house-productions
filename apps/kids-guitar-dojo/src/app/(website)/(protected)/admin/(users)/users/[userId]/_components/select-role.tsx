'use client';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@rocket-house-productions/shadcn-ui';

interface SelectRoleProps {
  role: string | undefined;
  updateRole: (role: string) => void;
}

export const SelectRole = ({ role, updateRole }: SelectRoleProps) => {
  return (
    <Select name="role" defaultValue={role} onValueChange={updateRole}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="member">Member</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectRole;
