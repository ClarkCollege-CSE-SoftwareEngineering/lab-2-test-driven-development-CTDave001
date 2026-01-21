# Lab 2 - TDD Shopping Cart


```bash
npm install
npm test
npm run test:coverage
```

## Functions

- `applyDiscount(price, discountPercent)` - takes a price and discount percentage and returns the discounted price. Throws errors for negative values or discounts over 100%

- `calculateTax(price, taxRate, isTaxExempt)` - calculates tax on a price. Returns 0 if the item is tax exempt.

- `calculateTotal(items, discountPercent, taxRate)` - takes an array of cart items and calculates subtotal, discount, tax, and total. Handles tax exempt items and applies discount before tax.

## Reflection

### How did TDD change the way you approached implementing calculateTotal?

TDD made me think about what the function should actually do before writing code. I had to write out test cases first which forced me to consider edge cases.

### Which of Fowler's test double types (dummy, stub, fake, spy, mock) did you need for this lab? Why or why not?

I didnt do any test doubles for this lab. There's no external dependencies, and the functions take caluclations inputs and return outputs. Classical TDD uses real implementations when you can.

### What would have been different if you wrote implementation first?

I probably would have missed some edge cases. Like the proportional discount on tax exempt items, I might've not have thought about that until way later. Also I probably would have written the code first and then tried to add more tests to match what I already wrote, which basically defeats the purpose.
