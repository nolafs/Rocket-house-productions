'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DialogReturnUrl } from '@rocket-house-productions/lesson';
import { PinInput } from '@rocket-house-productions/pin';

export default function PinOverlay() {
  const [err, setErr] = useState<string | null>(null);
  const sp = useSearchParams();
  const router = useRouter();
  const returnTo = sp.get('returnTo') || '/course';

  const onSuccess = () => {
    setErr(null);
    router.push(returnTo);
  };

  const onFailure = () => {
    setErr('Incorrect code');
    return;
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <DialogReturnUrl title={'Enter Parent PIN'}>
      <div className="p-10">
        <PinInput onSuccess={onSuccess} onFailure={onFailure} onCancel={onCancel} />
      </div>
    </DialogReturnUrl>
  );
}
