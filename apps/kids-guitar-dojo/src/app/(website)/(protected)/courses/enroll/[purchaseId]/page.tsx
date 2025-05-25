import { redirect } from 'next/navigation';
import { BASE_URL } from './_component/path-types';

export default async function Page(props: { params: Promise<{ purchaseId: string }> }) {
  const params = await props.params;
  const destination = `${BASE_URL}${params.purchaseId}/intro`;

  // Redirect immediately on server-side if necessary
  redirect(destination);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}
