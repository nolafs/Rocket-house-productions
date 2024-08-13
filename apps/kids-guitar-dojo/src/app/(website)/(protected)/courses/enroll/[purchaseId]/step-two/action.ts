'use server';
import { stepTwoSchema } from '../_component/schemas';
import { OnBoardingRoutes, FormErrors } from '../_component/path-types';
import { redirect } from 'next/navigation';

export default async function stepTwoFormAction(prevState: FormErrors | undefined, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const update = {
    ...data,
  };

  console.log('before data', update);

  const validated = stepTwoSchema.safeParse(update);

  console.log('validated', validated);

  if (!validated.success) {
    const errors = validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});

    return errors;
  }

  console.log('send data to server', data);

  redirect(`${data.productId}/${OnBoardingRoutes.CHILD_AVATAR}`);
}
