export const CurrencyToSymbol = (currency: string) => {
  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    AUD: '$',
    EUR: '€',
    GBP: '£',
  };

  return currencySymbols[currency] || currency;
};

export default CurrencyToSymbol;
