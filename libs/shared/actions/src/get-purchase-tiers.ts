export const getPurchaseTiers = (courseId: string | null | undefined) => {
  if (!courseId) {
    return [
      { label: 'Free', value: 'free' },
      { label: 'Standard', value: 'standard' },
      { label: 'Premium', value: 'premium' },
    ];
  }

  return [
    { label: 'Free', value: 'free' },
    { label: 'Standard', value: 'standard' },
    { label: 'Premium', value: 'premium' },
  ];
};
