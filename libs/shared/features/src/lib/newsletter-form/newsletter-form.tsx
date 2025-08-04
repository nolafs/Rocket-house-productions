'use client';
import React, { useActionState } from 'react';
import NewsletterFormStatus from './newsletter-form-status';
import { handleSubscription } from './action';

const initialState = {
  status: '',
  message: '',
  data: null,
};

export function NewsletterForm() {
  const [state, formAction] = useActionState(handleSubscription, initialState);
  return (
    <form action={formAction} className="mt-6 flex flex-col">
      <div className={'flex flex-col md:flex-row'}>
        <label htmlFor="email-address" className="sr-only">
          Email address
        </label>
        <div className={'md:grow'}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            //autoComplete="email"
            className="text-primary w-full min-w-0 appearance-none rounded-md border-0 bg-white px-3 py-3 text-base ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
          />
        </div>
        <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
          <button
            type="submit"
            className="bg-primary flex w-full items-center justify-center rounded-md px-4 py-3.5 text-sm font-bold uppercase text-white hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500">
            Subscribe
          </button>
        </div>
      </div>
      <section className="mt-2 w-full">
        <NewsletterFormStatus state={state} />
      </section>
    </form>
  );
}

const ErrorMessages = ({ errors }: { errors: string[] }) => {
  if (errors.length === 0) return null;

  const text = errors.join(', ');

  return <div className="peer text-red-600">{text}</div>;
};

export default NewsletterForm;
