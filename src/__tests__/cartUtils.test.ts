import { describe, it, expect } from "vitest";
import { applyDiscount, calculateTax, calculateTotal, CartItem } from "../cartUtils.js";

describe("applyDiscount", () => {
  it("applies a percentage discount to a price", () => {
    expect(applyDiscount(100, 10)).toBe(90);
  });

  it("returns the original price when discount is 0%", () => {
    expect(applyDiscount(50, 0)).toBe(50);
  });

  it("returns 0 when discount is 100%", () => {
    expect(applyDiscount(75, 100)).toBe(0);
  });

  it("handles decimal prices correctly", () => {
    expect(applyDiscount(19.99, 10)).toBeCloseTo(17.99, 2);
  });

  it("throws an error for negative prices", () => {
    expect(() => applyDiscount(-10, 10)).toThrow("Price cannot be negative");
  });

  it("throws an error for negative discount percentages", () => {
    expect(() => applyDiscount(100, -5)).toThrow("Discount cannot be negative");
  });

  it("throws an error for discount greater than 100%", () => {
    expect(() => applyDiscount(100, 150)).toThrow(
      "Discount cannot exceed 100%"
    );
  });
});

describe("calculateTax", () => {
  it("calculates tax on a price", () => {
    expect(calculateTax(100, 8.5)).toBeCloseTo(8.5, 2);
  });

  it("returns 0 tax when rate is 0%", () => {
    expect(calculateTax(50, 0)).toBe(0);
  });

  it("handles decimal prices correctly", () => {
    expect(calculateTax(19.99, 10)).toBeCloseTo(2.0, 2);
  });

  it("returns 0 tax when item is tax-exempt", () => {
    expect(calculateTax(100, 8.5, true)).toBe(0);
  });

  it("throws an error for negative prices", () => {
    expect(() => calculateTax(-10, 8.5)).toThrow("Price cannot be negative");
  });

  it("throws an error for negative tax rates", () => {
    expect(() => calculateTax(100, -5)).toThrow("Tax rate cannot be negative");
  });
});

describe("calculateTotal", () => {
  it("calculates totals for a single item", () => {
    const items: CartItem[] = [{ price: 10, quantity: 2 }];
    const result = calculateTotal(items, 0, 10);
    expect(result.subtotal).toBe(20);
    expect(result.discount).toBe(0);
    expect(result.tax).toBeCloseTo(2, 2);
    expect(result.total).toBeCloseTo(22, 2);
  });

  it("calculates totals for multiple items", () => {
    const items: CartItem[] = [
      { price: 10, quantity: 1 },
      { price: 20, quantity: 2 }
    ];
    const result = calculateTotal(items, 0, 0);
    expect(result.subtotal).toBe(50);
    expect(result.total).toBe(50);
  });

  it("applies discount before calculating tax", () => {
    const items: CartItem[] = [{ price: 100, quantity: 1 }];
    const result = calculateTotal(items, 10, 10);
    expect(result.subtotal).toBe(100);
    expect(result.discount).toBe(10);
    // tax on 90 not 100
    expect(result.tax).toBeCloseTo(9, 2);
    expect(result.total).toBeCloseTo(99, 2);
  });

  it("excludes tax-exempt items from tax calculation", () => {
    const items: CartItem[] = [
      { price: 50, quantity: 1, isTaxExempt: true },
      { price: 50, quantity: 1, isTaxExempt: false }
    ];
    const result = calculateTotal(items, 0, 10);
    // only non exempt item gets taxed
    expect(result.tax).toBeCloseTo(5, 2);
    expect(result.total).toBeCloseTo(105, 2);
  });

  it("returns zeros for empty cart", () => {
    const result = calculateTotal([], 0, 0);
    expect(result.subtotal).toBe(0);
    expect(result.discount).toBe(0);
    expect(result.tax).toBe(0);
    expect(result.total).toBe(0);
  });

  it("handles discount and tax exempt items together", () => {
    const items: CartItem[] = [
      { price: 100, quantity: 1, isTaxExempt: true },
      { price: 100, quantity: 1, isTaxExempt: false }
    ];
    const result = calculateTotal(items, 20, 10);
    expect(result.subtotal).toBe(200);
    expect(result.discount).toBe(40);
    // 160 after discount, half taxable so tax is 8
    expect(result.tax).toBeCloseTo(8, 2);
    expect(result.total).toBeCloseTo(168, 2);
  });
});