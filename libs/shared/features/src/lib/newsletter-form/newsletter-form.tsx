'use client';
import React from 'react';
import { useFormState } from 'react-dom';
import { ZodIssue } from 'zod';
import NewsletterFormStatus from './newsletter-form-status';

type NewsletterProps = {
  action: (_prevState: any, params: FormData) => Promise<{ errors: ZodIssue[] }>;
};

const findErrors = (fieldName: string, errors: ZodIssue[]) => {
  return errors
    .filter(item => {
      return item.path.includes(fieldName);
    })
    .map(item => item.message);
};

export function NewsletterForm({ action }: NewsletterProps) {
  const [state, handleSubscription] = useFormState(action, { errors: [] });

  const emailErrors = findErrors('email', state.errors);

  console.log(state, emailErrors);

  return (
    <form action={handleSubscription} className="mt-6 sm:flex sm:max-w-md">
      <label htmlFor="email-address" className="sr-only">
        Email address
      </label>
      <div className={'grow'}>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          autoComplete="email"
          className="text-primary w-full min-w-0 appearance-none rounded-md border-0 bg-white px-3 py-3 text-base ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
        />
        <ErrorMessages errors={emailErrors} />
      </div>
      <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
        <button
          type="submit"
          className="bg-primary flex w-full items-center justify-center rounded-md px-4 py-3.5 text-sm font-bold uppercase text-white hover:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500">
          Subscribe
        </button>
      </div>
      <section className="mt-6 flex justify-center text-center">
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
