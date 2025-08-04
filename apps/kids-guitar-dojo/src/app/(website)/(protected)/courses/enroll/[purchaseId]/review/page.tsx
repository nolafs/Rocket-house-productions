import { BASE_URL } from '../_component/path-types';
import ReviewForm from './_components/ReviewForm';
import { createClient } from '@/prismicio';

export default async function Page(props: { params: Promise<{ purchaseId: string }> }) {
  const params = await props.params;
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  const client = createClient();
  const { data } = await client.getSingle('onboarding');

  return (
    <ReviewForm
      baseUrl={baseUrl}
      header={data.onboarding_step_review_header}
      body={data?.onboarding_step_review_body}
    />
  );
}
