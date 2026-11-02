const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

export function formatDiscountDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  if (!year || !month || !day) return date;
  return new Intl.DateTimeFormat('pt-BR').format(
    new Date(year, month - 1, day),
  );
}
