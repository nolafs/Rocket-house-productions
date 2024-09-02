'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import cn from 'classnames';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/10',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-[50%] top-[50%] z-50 grid w-full max-w-xl translate-x-[-50%] translate-y-[-50%] gap-4 bg-gray-200 pb-3 shadow-lg duration-200 sm:rounded-xl',
        className,
      )}
      {...props}>
      <div className={'text-lessons-foreground bg-lesson flex h-full w-full flex-col sm:rounded-xl'}>{children}</div>
      <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute right-4 top-9 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none sm:rounded-sm">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="5" fill="white" />
          <path
            d="M20.1177 17.9991L26.0594 12.0669L26.0596 12.0666C26.3416 11.7846 26.5 11.4022 26.5 11.0035C26.5 10.6047 26.3416 10.2223 26.0596 9.94036C25.7777 9.6584 25.3953 9.5 24.9965 9.5C24.5978 9.5 24.2154 9.6584 23.9334 9.94036L23.9331 9.94064L18.0009 15.8823L12.0686 9.94064L12.0683 9.94036C11.7863 9.6584 11.4039 9.5 11.0052 9.5C10.6064 9.5 10.224 9.6584 9.94206 9.94036C9.66011 10.2223 9.50171 10.6047 9.50171 11.0035C9.50171 11.4022 9.66011 11.7846 9.94206 12.0666L9.94234 12.0669L15.8841 17.9991L9.94351 23.9303C9.94332 23.9305 9.94312 23.9307 9.94292 23.9309C9.80267 24.0701 9.69133 24.2357 9.61531 24.4182C9.53919 24.6009 9.5 24.7969 9.5 24.9948C9.5 25.1928 9.53919 25.3887 9.61531 25.5715C9.69117 25.7535 9.80221 25.9189 9.94206 26.0579C10.0811 26.1978 10.2465 26.3088 10.4285 26.3847C10.6113 26.4608 10.8072 26.5 11.0052 26.5C11.2031 26.5 11.3991 26.4608 11.5818 26.3847C11.7643 26.3087 11.93 26.1973 12.0693 26.057C12.0694 26.0568 12.0696 26.0566 12.0697 26.0565L18.0009 20.1159L23.932 26.0565C23.9322 26.0567 23.9324 26.0569 23.9326 26.0571C24.0719 26.1974 24.2375 26.3087 24.4199 26.3847C24.6026 26.4608 24.7986 26.5 24.9965 26.5C25.1945 26.5 25.3904 26.4608 25.5732 26.3847C25.7552 26.3088 25.9206 26.1978 26.0596 26.0579C26.1995 25.9189 26.3105 25.7535 26.3864 25.5715C26.4625 25.3887 26.5017 25.1928 26.5017 24.9948C26.5017 24.7969 26.4625 24.6009 26.3864 24.4182C26.3105 24.2359 26.1993 24.0705 26.0592 23.9313L26.0594 23.9314L25.7061 24.2853L26.0582 23.9303L20.1177 17.9991ZM20.1177 17.9991L19.7638 18.3524M20.1177 17.9991L19.7638 18.3524M19.7638 18.3524L19.4101 17.9992M19.7638 18.3524L19.4101 17.9992M19.4101 17.9992L19.41 17.9991L19.4101 17.9992Z"
            fill="#EC4899"
            stroke="#EC4899"
          />
        </svg>

        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'text-shadow font-lesson-heading bg-dialog-lesson relative flex h-[100px] flex-col items-center justify-center space-y-1.5 bg-pink-500 bg-repeat sm:rounded-t-xl',
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-center text-xl font-semibold leading-[38px] leading-none tracking-tight text-white md:text-2xl lg:text-3xl',
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-muted-foreground text-sm', className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col p-8', className)} {...props} />
);
DialogBody.displayName = 'DialogBody';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogBody,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
