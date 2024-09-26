export function NewsletterFormStatus({ state }: any) {
  return (
    <p
      aria-live="polite"
      className={`rounded-md p-2 ${
        state?.status === 'success'
          ? 'bg-success text-white'
          : state?.status === 'failed' || state?.status === 'invalid email' || state?.status === 'empty'
            ? 'bg-danger text-white'
            : ''
      } `}>
      {state?.status === 'success'
        ? state?.message
        : (state?.error?.response?.text?.includes('already a list member') && 'Already listed') || state?.message}
    </p>
  );
}

export default NewsletterFormStatus;
