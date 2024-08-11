import z from 'zod';

export const stepOneSchema = z.object({
  firstName: z.string().min(1, 'Please Enter First Name'),
  lastName: z.string().min(1, 'Please Enter Last Name'),
  email: z.string().email('Please enter a valid email'),
  confirmTerms: z.boolean().refine(value => value, {}),
  parentConsent: z.boolean().refine(value => value, {}),
  newsletter: z.boolean().optional(),
  notify: z.boolean().optional(),
});

export const stepTwoSchema = z.object({
  birthday: z.string().min(1, 'Please Enter Birthday'),
  name: z.string().min(1, 'Please Enter Name'),
  //optional email for child
  childEmail: z.string().email('Please enter a valid email').optional(),
});

export const stepThreeSchema = z.object({
  avatar: z.string().min(1, 'Please Upload Avatar'),
});

export const onBoardingSchema = z.object({
  ...stepOneSchema.shape,
  ...stepTwoSchema.shape,
  ...stepThreeSchema.shape,
});

export const onBoardingInitialValuesSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  confirmTerms: z.boolean().optional(),
  parentConsent: z.boolean().optional(),
  newsletter: z.boolean().optional(),
  notify: z.boolean().optional(),
  birthday: z.string().optional(),
  name: z.string().optional(),
  childEmail: z.string().optional(),
  avatar: z.string().optional(),
});

export type OnBoardingType = z.infer<typeof onBoardingSchema>;
export type OnBoardingInitialValuesType = z.infer<typeof onBoardingInitialValuesSchema>;
