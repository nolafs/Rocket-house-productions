import React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rocket-house-productions/shadcn-ui';

type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

interface DialogAddressProps {
  address: Address;
}

export const DialogAddress = ({ address }: DialogAddressProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} size={'sm'}>
          view
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Address</DialogTitle>
          <DialogDescription>View billing address</DialogDescription>
        </DialogHeader>

        <dl>
          <dt>Line 1</dt>
          <dd>{address.line1}</dd>
          <dt>Line 2</dt>
          <dd>{address.line2}</dd>
          <dt>City</dt>
          <dd>{address.city}</dd>
          <dt>State</dt>
          <dd>{address.state}</dd>
          <dt>Postal Code</dt>
          <dd>{address.postal_code}</dd>
          <dt>Country</dt>
          <dd>{address.country}</dd>
        </dl>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddress;
