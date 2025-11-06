import { Expense, PersonTotals, SimplifiedDebt } from '../types';

export function calculatePersonTotal(
  people: string[],
  expenses: Expense[]
): Record<string, PersonTotals> {
  const totals: Record<string, PersonTotals> = Object.fromEntries(
    people.map((p) => [p, { paid: 0, owed: 0, net: 0 }])
  ) as Record<string, PersonTotals>;

  for (const expense of expenses) {
    if (!totals[expense.paidBy]) {
      totals[expense.paidBy] = { paid: 0, owed: 0, net: 0 };
    }
    totals[expense.paidBy].paid += expense.amount;

    const participants = expense.splitBetween.filter((p) => people.includes(p));
    if (participants.length === 0) continue;

    if (expense.splitType === 'equal') {
      const share = expense.amount / participants.length;
      for (const person of participants) {
        if (!totals[person]) {
          totals[person] = { paid: 0, owed: 0, net: 0 };
        }
        totals[person].owed += share;
      }
    } else if (expense.splitType === 'custom' && expense.customAmounts) {
      for (const person of participants) {
        const share = expense.customAmounts[person] ?? 0;
        if (!totals[person]) {
          totals[person] = { paid: 0, owed: 0, net: 0 };
        }
        totals[person].owed += share;
      }
    }
  }

  for (const person of Object.keys(totals)) {
    const { paid, owed } = totals[person];
    totals[person].net = round2(paid - owed);
    totals[person].paid = round2(paid);
    totals[person].owed = round2(owed);
  }

  return totals;
}

export function simplifyDebts(
  totals: Record<string, PersonTotals>
): SimplifiedDebt[] {
  const debtors: { person: string; amount: number }[] = [];
  const creditors: { person: string; amount: number }[] = [];

  for (const [person, t] of Object.entries(totals)) {
    if (t.net < -0.005) debtors.push({ person, amount: round2(-t.net) });
    else if (t.net > 0.005) creditors.push({ person, amount: round2(t.net) });
  }

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements: SimplifiedDebt[] = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i];
    const c = creditors[j];
    const pay = round2(Math.min(d.amount, c.amount));
    if (pay > 0) {
      settlements.push({ from: d.person, to: c.person, amount: pay });
      d.amount = round2(d.amount - pay);
      c.amount = round2(c.amount - pay);
    }
    if (d.amount <= 0.005) i++;
    if (c.amount <= 0.005) j++;
  }

  return settlements;
}

export function totalGroupSpending(expenses: Expense[]): number {
  return round2(expenses.reduce((sum, e) => sum + e.amount, 0));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}


