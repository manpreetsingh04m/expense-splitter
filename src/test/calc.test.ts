import { describe, it, expect } from 'vitest';
import { calculatePersonTotal, simplifyDebts, totalGroupSpending } from '../utils/calc';
import { Expense } from '../types';

describe('`calculate totals`', () => {
  const people = ['Alice', 'Bob', 'Charlie', 'Diana'];

  const expensesEqual: Expense[] = [
    {
      id: 1,
      description: 'Dinner',
      amount: 120,
      paidBy: 'Alice',
      splitBetween: ['Alice', 'Bob', 'Charlie', 'Diana'],
      date: '2024-01-01',
      splitType: 'equal',
    },
    {
      id: 2,
      description: 'Taxi',
      amount: 40,
      paidBy: 'Bob',
      splitBetween: ['Alice', 'Bob'],
      date: '2024-01-02',
      splitType: 'equal',
    },
  ];

  it('calculate totals for equal splits', () => {
    const totals = calculatePersonTotal(people, expensesEqual);
    // Dinner 120 / 4 = 30 each; Taxi 40 / 2 = 20 each
    // Paid: Alice 120, Bob 40; Owed: Alice 50, Bob 50, Charlie 30, Diana 30
    expect(totals['Alice']).toEqual({ paid: 120, owed: 50, net: 70 });
    expect(totals['Bob']).toEqual({ paid: 40, owed: 50, net: -10 });
    expect(totals['Charlie']).toEqual({ paid: 0, owed: 30, net: -30 });
    expect(totals['Diana']).toEqual({ paid: 0, owed: 30, net: -30 });
  });

  it('calculate totals for custom splits', () => {
    const expensesCustom: Expense[] = [
      {
        id: 1,
        description: 'Tickets',
        amount: 200,
        paidBy: 'Charlie',
        splitBetween: ['Alice', 'Charlie', 'Diana'],
        date: '2024-01-03',
        splitType: 'custom',
        customAmounts: { Alice: 50, Charlie: 100, Diana: 50 },
      },
    ];
    const totals = calculatePersonTotal(people, expensesCustom);
    expect(totals['Charlie']).toEqual({ paid: 200, owed: 100, net: 100 });
    expect(totals['Alice']).toEqual({ paid: 0, owed: 50, net: -50 });
    expect(totals['Diana']).toEqual({ paid: 0, owed: 50, net: -50 });
  });

  it('simplifies debts into minimal transactions', () => {
    const totals = calculatePersonTotal(people, expensesEqual);
    const settlements = simplifyDebts(totals);
    // Totals: Alice +70, Bob -10, Charlie -30, Diana -30 → minimal is 3 payments
    expect(settlements.length).toBe(3);
    const sumPaid = settlements.reduce((s, t) => s + t.amount, 0);
    expect(sumPaid).toBeCloseTo(70, 2);
  });

  it('calculate total group spending', () => {
    expect(totalGroupSpending(expensesEqual)).toBe(160);
  });
});


