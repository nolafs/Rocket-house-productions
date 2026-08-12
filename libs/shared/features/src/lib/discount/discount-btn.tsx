'use client';

import { useEffect, useState } from 'react';
import { KeyTextField } from '@prismicio/client';
import { checkPromo, PromoState } from '@rocket-house-productions/actions/server';

interface DiscountBtnProps {
  discountCode?: KeyTextField;
}

type UIState = 'idle' | 'loading' | 'valid' | 'invalid';

const INVALID_MESSAGES: Record<string, string> = {
  not_found: 'This discount code was not found.',
  inactive: 'This discount code is no longer active.',
  expired: 'This discount code has expired.',
  exhausted: 'This discount code has reached its usage limit.',
};

export function DiscountBtn({ discountCode }: DiscountBtnProps) {
  const [uiState, setUiState] = useState<UIState>('idle');
  const [promo, setPromo] = useState<Extract<PromoState, { ok: true }> | null>(null);
  const [invalidReason, setInvalidReason] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!discountCode) return;

    setUiState('loading');
    checkPromo(discountCode)
      .then(result => {
        if (result.ok) {
          setPromo(result);
          setUiState('valid');
        } else {
          setInvalidReason(INVALID_MESSAGES[result.reason] ?? 'This discount code is not valid.');
          setUiState('invalid');
        }
      })
      .catch(() => {
        setInvalidReason('Unable to verify discount code. Please try again.');
        setUiState('invalid');
      });
  }, [discountCode]);

  const handleCopy = () => {
    if (!discountCode) return;
    navigator.clipboard.writeText(discountCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!discountCode || uiState === 'idle') return null;

  if (uiState === 'loading') {
    return (
      <div className="bg-primary/20 animate-pulse select-none rounded-lg p-5 text-4xl text-transparent">
        {discountCode}
      </div>
    );
  }

  if (uiState === 'invalid') {
    return (
      <div className="rounded-lg border-2 border-red-400 bg-red-50 p-5 text-center text-red-600">
        <p className="text-lg font-semibold">{invalidReason}</p>
      </div>
    );
  }

  const discountLabel = promo?.percentOff ? `${promo.percentOff}% off` : null;
  const expiryLabel = promo?.expiresAt
    ? `Expires ${new Date(promo.expiresAt * 1000).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}`
    : null;

  return (
    <div className="flex flex-col items-center gap-3">
      {(discountLabel || expiryLabel) && (
        <p className="text-muted-foreground text-sm">
          {discountLabel && <>Copy code to receive {discountLabel}</>}
          {discountLabel && expiryLabel && ' · '}
          {expiryLabel && <span className="text-orange-500">{expiryLabel}</span>}
        </p>
      )}
      <div className="border-primary flex items-center overflow-hidden rounded-lg border-2">
        <div className="bg-primary px-6 py-4 text-3xl font-bold tracking-widest text-white">{discountCode}</div>
        <button
          onClick={handleCopy}
          className="text-primary hover:bg-primary/10 active:bg-primary/20 flex min-w-[90px] flex-col items-center justify-center gap-1 bg-white px-3 py-3 transition-colors"
          aria-label={`Copy discount code ${discountCode}`}>
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs font-medium text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span className="text-xs font-medium">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default DiscountBtn;
