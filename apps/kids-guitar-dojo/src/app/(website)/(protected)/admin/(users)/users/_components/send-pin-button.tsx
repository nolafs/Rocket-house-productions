'use client';

import { useState } from 'react';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { sendPinEmail } from '@rocket-house-productions/actions/server';
import { Check, Mail, Loader2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rocket-house-productions/shadcn-ui';

interface SendPinButtonProps {
  email: string;
  firstName: string;
  size: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'small' | 'icon';
  className?: string;
}

export function SendPinButton({ 
  email, 
  firstName, 
  variant = 'default',
  size='sm',
  className = '' 
}: SendPinButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSendPin = async () => {
    setIsOpen(false);
    setIsLoading(true);
    setStatus('idle');

    console.log('About to send PIN');
    try {
      
      const result = await sendPinEmail({ email, firstName });
      console.log('Send PIN result:', result);
      
      if (result.success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        console.error('Failed to send PIN:', result.error);
      }
    } catch (error) {
      setStatus('error');
      console.error('Error sending PIN:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const getButtonClass = () => {
    const baseClass = `px-4 py-2 rounded font-medium transition-colors ${className}`;
    
    if (status === 'success') {
      return `${baseClass} bg-green-500 text-white`;
    }
    if (status === 'error') {
      return `${baseClass} bg-red-500 text-white`;
    }
    if (isLoading) {
      return `${baseClass} bg-gray-400 text-white cursor-not-allowed`;
    }
    
    return `${baseClass} bg-accent/20 hover:bg-accent/80 text-white!`;
  };

  const displayName = firstName ? `${firstName}`: ' this user';
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size={size}
          className={getButtonClass()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {size !== 'icon' && (
            <span className="ml-2">
              {isLoading ? 'Sending...' : 'Send PIN'}
            </span>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Send Parent PIN</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to send the Parent PIN to <strong>{displayName}</strong> at{' '}
            <strong>{email}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSendPin} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send PIN
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    
  );
}
