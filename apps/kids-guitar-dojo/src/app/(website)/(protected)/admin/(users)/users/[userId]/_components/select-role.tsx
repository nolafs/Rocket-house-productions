'use client';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@rocket-house-productions/shadcn-ui';

interface SelectRoleProps {
  role: string | undefined | null;
  onChange?: (value: string) => void;
}

export const SelectRole = ({ role, onChange }: SelectRoleProps) => {
  return (
    <Select name="role" defaultValue={role || 'member'} onValueChange={onChange}>
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
