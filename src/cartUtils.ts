export interface CartItem {
  price: number;
  quantity: number;
  isTaxExempt?: boolean;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}

export function applyDiscount(price: number, discountPercent: number): number {
  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  if (discountPercent < 0) {
    throw new Error("Discount cannot be negative");
  }
  if (discountPercent > 100) {
    throw new Error("Discount cannot exceed 100%");
  }

  const discountMultiplier = 1 - discountPercent / 100;
  return price * discountMultiplier;
}

export function calculateTax(
  price: number,
  taxRate: number,
  isTaxExempt: boolean = false
): number {
  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  if (taxRate < 0) {
    throw new Error("Tax rate cannot be negative");
  }

  if (isTaxExempt) {
    return 0;
  }

  const tax = price * (taxRate / 100);
  return Math.round(tax * 100) / 100;
}

export function calculateTotal(
  items: CartItem[],
  discountPercent: number = 0,
  taxRate: number = 0
): CartTotals {
  // get subtotal first
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // apply discount
  const discount = Math.round(subtotal * (discountPercent / 100) * 100) / 100;
  const discountedSubtotal = subtotal - discount;

  // only tax the non exempt items
  const taxableSubtotal = items
    .filter(item => !item.isTaxExempt)
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  // discount applies proportionally to taxable part too
  const taxableAfterDiscount = subtotal > 0
    ? discountedSubtotal * (taxableSubtotal / subtotal)
    : 0;

  const tax = Math.round(taxableAfterDiscount * (taxRate / 100) * 100) / 100;
  const total = Math.round((discountedSubtotal + tax) * 100) / 100;

  return { subtotal, discount, tax, total };
}