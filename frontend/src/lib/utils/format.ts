// "₱ 1,234.50"
const twoDecimals = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const peso = (amount: number) => `₱ ${twoDecimals.format(amount)}`;
