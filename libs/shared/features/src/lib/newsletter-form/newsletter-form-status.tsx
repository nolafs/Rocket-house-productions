export function NewsletterFormStatus({ state }: any) {
  return (
    <p
      aria-live="polite"
      className={`p-2 text-sm ${
        state?.status === 'success'
          ? 'text-success bg-success-bg'
          : state?.status === 'failed' || state?.status === 'invalid email' || state?.status === 'empty'
            ? 'text-error bg-error-bg'
            : ''
      } `}>
      {state?.status === 'success'
        ? state?.data?.status
        : (state?.error?.response?.text?.includes('already a list member') && 'Already listed') || state?.message}
    </p>
  );
}

export default NewsletterFormStatus;
