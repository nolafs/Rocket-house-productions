'use server';
import { stepOneSchema } from '../_component/schemas';
import { OnBoardingRoutes, FormErrors } from '../_component/path-types';
import { redirect } from 'next/navigation';

export default async function stepOneFormAction(prevState: FormErrors | undefined, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const update = {
    ...data,
    confirmTerms: data.confirmTerms === 'on',
    parentConsent: data.parentConsent === 'on',
    newsletter: data.newsletter === 'on',
    notify: data.notify === 'on',
  };

  const validated = stepOneSchema.safeParse(update);

  if (!validated.success) {
    return validated.error.issues.reduce((acc: FormErrors, issue) => {
      const path = issue.path[0] as string;
      acc[path] = issue.message;
      return acc;
    }, {});
  }

  redirect(`${data.productId}/${OnBoardingRoutes.CHILD_DETAILS}`);
}
