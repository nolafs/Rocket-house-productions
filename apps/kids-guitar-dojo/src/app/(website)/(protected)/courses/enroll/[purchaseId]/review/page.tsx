import { BASE_URL } from '../_component/path-types';
import ReviewForm from './_components/ReviewForm';

export default async function Page({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  return <ReviewForm baseUrl={baseUrl} />;
}
