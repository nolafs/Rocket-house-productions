'use server';
import { stepOneSchema } from '../_component/schemas';
import { OnBoardingRoutes, FormErrors, BASE_URL } from '../_component/path-types';
import { redirect } from 'next/navigation';

export default async function stepThreeFormAction(prevState: FormErrors | undefined, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  console.log('before data', data);

  const update = {
    ...data,
  };

  const validated = stepOneSchema.safeParse(update);

  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});

    return errors;
  }

  const baseUrl = `${BASE_URL}/${formData.get('productId')}`;
  redirect(`${baseUrl}${OnBoardingRoutes.REVIEW}`);
}
