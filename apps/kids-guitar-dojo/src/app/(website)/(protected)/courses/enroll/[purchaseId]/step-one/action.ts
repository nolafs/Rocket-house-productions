'use server';
import { stepOneSchema } from '../_component/schemas';
import { OnBoardingRoutes, FormErrors } from '../_component/path-types';
import { redirect } from 'next/navigation';

export default async function stepOneFormAction(prevState: FormErrors | undefined, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  console.log('[STEP ONE FORM DATA]', data);

  const update = {
    ...data,
    confirmTerms: data.confirmTerms === 'on' ? true : false,
    parentConsent: data.parentConsent === 'on' ? true : false,
    newsletter: data.newsletter === 'on' ? true : false,
    notify: data.notify === 'on' ? true : false,
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

  redirect(`${data.productId}/${OnBoardingRoutes.CHILD_DETAILS}`);
}
