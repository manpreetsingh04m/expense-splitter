import { useEffect, useMemo, useState } from 'react';
import BalanceView from './components/BalanceView';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import PeopleManager from './components/PeopleManager';
import { initialExpenses, initialPeople } from './initialData';
import { Expense, PersonTotals, SimplifiedDebt } from './types';
import { calculatePersonTotal, simplifyDebts, totalGroupSpending } from './utils/calc';

function App() {
  const [people, setPeople] = useState<string[]>(initialPeople);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [data, setdata] = useState(false);
  useEffect(() => {
    try {
      const p = localStorage.getItem('people');
      const e = localStorage.getItem('expenses');
      if (p) {
        const parsed = JSON.parse(p);
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
          setPeople(parsed);
        }
      }
      if (e) {
        const parsed = JSON.parse(e);
        if (Array.isArray(parsed)) {
          setExpenses(parsed as Expense[]);
        }
      }
      setdata(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (!data) return;
    try {
      localStorage.setItem('people', JSON.stringify(people));
    } catch {}
  }, [people, data]);
  useEffect(() => {
    if (!data) return;
    try {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch {}
  }, [expenses, data]);

  const addPerson = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (people.includes(trimmed)) return;
    setPeople((prev) => [...prev, trimmed]);
  };

  const removePerson = (name: string) => {
    setPeople((prev) => prev.filter((p) => p !== name));
    setExpenses((prev) =>
      prev.map((e) => ({
        ...e,
        splitBetween: e.splitBetween.filter((p) => p !== name),
        customAmounts: e.customAmounts
          ? Object.fromEntries(
              Object.entries(e.customAmounts).filter(([person]) => person !== name)
            )
          : undefined,
      }))
    );
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses((prev) => {
      const nextId = (prev[prev.length - 1]?.id ?? 0) + 1;
      return [...prev, { ...expense, id: nextId }];
    });
  };

  const deleteExpense = (id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totals: Record<string, PersonTotals> = useMemo(
    () => calculatePersonTotal(people, expenses),
    [people, expenses]
  );
  const settlements: SimplifiedDebt[] = useMemo(
    () => simplifyDebts(totals),
    [totals]
  );
  const totalSpending = useMemo(() => totalGroupSpending(expenses), [expenses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <header className="bg-white/10 backdrop-blur-md p-6 text-center border-b border-white/20">
        <h1 className="text-white text-4xl font-bold drop-shadow-lg">💰 Expense Splitter</h1>
      </header>

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <PeopleManager people={people} onAdd={addPerson} onRemove={removePerson} />
            <ExpenseForm people={people} onAddExpense={addExpense} />
          </div>

          <div>
            <BalanceView people={people} totalSpending={totalSpending} totals={totals} settlements={settlements} />
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
