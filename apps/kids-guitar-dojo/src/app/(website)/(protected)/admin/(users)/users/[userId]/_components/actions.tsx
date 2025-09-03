'use client';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { ConfirmModal } from '@rocket-house-productions/features';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { deleteUser } from '@rocket-house-productions/actions/server';

interface ActionsProps {
  userId: string;
  accountId: string;
}

export function Actions({ accountId, userId }: ActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = async () => {
    setIsLoading(true);

    try {
      await deleteUser(accountId, userId);
      toast.success('User deleted');
      router.refresh();
      router.push(`/admin/users`);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default Actions;
