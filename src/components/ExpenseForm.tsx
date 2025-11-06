import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Expense } from '../types';

interface ExpenseFormProps {
  people: string[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

function ExpenseForm({ people, onAddExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [paidBy, setPaidBy] = useState<string>('');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [selected, setSelected] = useState<Record<string, boolean>>(
    () => Object.fromEntries(people.map((p) => [p, false])) as Record<string, boolean>
  );
  const [message, setMessage] = useState<string | null>(null);
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    setSelected((prev) => {
      const base = Object.fromEntries(people.map((p) => [p, false])) as Record<string, boolean>;
      for (const k of Object.keys(prev)) if (k in base) base[k] = prev[k];
      return base;
    });
    setCustomAmounts((prev) => {
      const next: Record<string, string> = {};
      for (const p of people) if (p in prev) next[p] = prev[p];
      return next;
    });
  }, [people]);

  const handleToggle = (person: string) => {
    setSelected((prev) => ({ ...prev, [person]: !prev[person] }));
  };

  const handleCustomAmount = (person: string, value: string) => {
    if (value === '' || /^\d*(?:\.\d{0,2})?$/.test(value)) {
      setCustomAmounts((prev) => ({ ...prev, [person]: value }));
    }
  };

  const selectedPeople = useMemo(
    () => Object.entries(selected).filter(([, v]) => v).map(([k]) => k),
    [selected]
  );

  const customSum = useMemo(
    () => selectedPeople.reduce((sum, p) => sum + (Number(customAmounts[p]) || 0), 0),
    [selectedPeople, customAmounts]
  );

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate('');
    setPaidBy('');
    setSplitType('equal');
    setSelected(Object.fromEntries(people.map((p) => [p, false])) as Record<string, boolean>);
    setCustomAmounts({});
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    const splitBetween = selectedPeople;

    if (!description.trim()) {
      setMessage('What was this for?');
      return;
    }
    if (!amt || amt <= 0) {
      setMessage('Amount needs to be more than $0');
      return;
    }
    if (!date) {
      setMessage('Pick a date');
      return;
    }
    if (!paidBy) {
      setMessage('Who paid?');
      return;
    }
    if (splitBetween.length === 0) {
      setMessage('Select at least one person');
      return;
    }

    const expense: Omit<Expense, 'id'> = {
      description: description.trim(),
      amount: amt,
      paidBy,
      splitBetween,
      date,
      splitType,
    };

    if (splitType === 'custom') {
      const amounts: Record<string, number> = {};
      for (const p of splitBetween) {
        const val = Number(customAmounts[p] || 0);
        if (val < 0) {
          setMessage('Custom amounts cannot be negative.');
          return;
        }
        amounts[p] = val;
      }
      const sum = Object.values(amounts).reduce((s, v) => s + v, 0);
      if (Math.abs(sum - amt) > 0.01) {
        setMessage(`Total should be $${amt.toFixed(2)} (you have $${sum.toFixed(2)})`);
        return;
      }
      expense.customAmounts = amounts;
    }

    onAddExpense(expense);
    resetForm();
    setMessage('Added!');
    setTimeout(() => setMessage(null), 1500);
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        💸 Add Expense
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-1 text-gray-700 font-medium text-sm"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="What was the expense for?"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 mb-4">
            <label
              htmlFor="amount"
              className="block mb-1 text-gray-700 font-medium text-sm"
            >
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="flex-1 mb-4">
            <label
              htmlFor="date"
              className="block mb-1 text-gray-700 font-medium text-sm"
            >
              Date
            </label>
            <input
              id="date"
              type="date"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="paidBy"
            className="block mb-1 text-gray-700 font-medium text-sm"
          >
            Paid By
          </label>
          <select
            id="paidBy"
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-500 cursor-pointer"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            <option value="">Select person...</option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">
            Split Type
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="equal"
                name="splitType"
                className="cursor-pointer"
                checked={splitType === 'equal'}
                onChange={() => setSplitType('equal')}
              />
              <span>Equal Split</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
              <input
                type="radio"
                value="custom"
                name="splitType"
                className="cursor-pointer"
                checked={splitType === 'custom'}
                onChange={() => setSplitType('custom')}
              />
              <span>Custom Amounts</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium text-sm">
            Split Between
          </label>
          <div className="flex flex-col gap-2">
            {people.map((person) => (
              <div
                key={person}
                className="flex items-center justify-between p-2 bg-gray-50 rounded mb-1"
              >
                <label className="flex items-center gap-2 cursor-pointer px-1 py-1 rounded transition-colors hover:bg-gray-50">
                  <input type="checkbox" className="cursor-pointer" checked={!!selected[person]} onChange={() => handleToggle(person)} />
                  <span>{person}</span>
                </label>
                {splitType === 'custom' && selected[person] && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">$</span>
                    <input
                      inputMode="decimal"
                      placeholder="0.00"
                      className="w-24 px-2 py-1 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:border-indigo-500 text-right"
                      value={customAmounts[person] ?? ''}
                      onChange={(e) => handleCustomAmount(person, e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {splitType === 'custom' && selectedPeople.length > 0 && (
          <div className="mb-4 text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded p-3">
            <div className="flex justify-between">
              <span>Custom total</span>
              <strong>${customSum.toFixed(2)} / ${Number(amount || 0).toFixed(2)}</strong>
            </div>
            <p className="text-xs text-gray-600 mt-1">Total should match the expense amount</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md text-sm font-medium cursor-pointer transition-all hover:bg-indigo-600 hover:-translate-y-px flex items-center justify-center gap-1"
        >
          Add Expense
        </button>
      </form>

      {message && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 mt-4">
          {message}
        </p>
      )}
    </div>
  );
}

export default ExpenseForm;
