import z from 'zod';

export const stepOneSchema = z.object({
  firstName: z.string().min(1, 'Please Enter First Name'),
  lastName: z.string().min(1, 'Please Enter Last Name'),
  email: z.string().email('Please enter a valid email'),
  confirmTerms: z.boolean().refine(value => value === true, {
    message: 'Please confirm the terms',
  }),
  parentConsent: z.boolean().refine(value => value === true, {
    message: 'Please confirm parental consent',
  }),
  newsletter: z.boolean().optional(),
  notify: z.boolean().optional(),
  productId: z.string().min(1, 'Please Enter Product Id'),
});

export const stepTwoSchema = z.object({
  birthday: z.string().min(1, 'Please Enter Birthday'),
  productId: z.string().min(1, 'Please Enter Product Id'),
  favoriteColor: z.enum(
    ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'brown', 'gray', 'other'],
    {
      message: 'Invalid selection for favoriteColor',
    },
  ),
  favoriteAnimal: z.enum(
    [
      'dog',
      'cat',
      'fish',
      'bird',
      'rabbit',
      'hamster',
      'turtle',
      'lizard',
      'snake',
      'horse',
      'guinea pig',
      'frog',
      'mouse',
      'ferret',
      'hedgehog',
      'chinchilla',
      'hermit crab',
      'parrot',
      'gerbil',
      'goat',
      'alpaca',
      'iguana',
      'gecko',
      'tarantula',
      'scorpion',
      'pig',
      'cow',
      'duck',
      'chicken',
      'peacock',
      'pony',
      'lamb',
      'raccoon',
      'fox',
      'owl',
      'penguin',
      'koala',
      'kangaroo',
      'sea turtle',
      'dolphin',
      'whale',
      'octopus',
      'other',
    ],
    {
      message: 'Invalid selection for favoriteAnimal',
    },
  ),
  favoriteSuperpower: z.enum(
    [
      'flying',
      'invisibility',
      'super_strength',
      'teleportation',
      'telekinesis',
      'time_travel',
      'mind_reading',
      'other',
    ],
    {
      message: 'Invalid selection for favoriteSuperpower',
    },
  ),
  favoriteHobby: z.enum(['sports', 'reading', 'drawing', 'music', 'dancing', 'cooking', 'video_games', 'other'], {
    message: 'Invalid selection for favoriteHobby',
  }),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer_not_to_say', 'other'], {
    message: 'Invalid selection for gender',
  }),
});

export const stepThreeSchema = z.object({
  avatar: z.string().min(1, 'Please Upload Avatar'),
  productId: z.string().min(1, 'Please Enter Product Id'),
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
