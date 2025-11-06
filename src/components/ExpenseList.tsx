import { useState } from 'react';
import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
}

function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        📝 Expense History
      </h2>

      {expenses.length === 0 ? (
        <p className="text-center text-gray-400 py-8 italic">
          No expenses added yet. Add your first expense to get started!
        </p>
      ) : (
        <div>
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-gray-50 rounded-lg mb-4 border border-gray-200 overflow-hidden"
            >
              <div className="p-4 flex flex-wrap gap-3 justify-between items-center transition-colors hover:bg-gray-100">
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-800 mb-1 text-base sm:text-lg overflow-hidden text-ellipsis whitespace-normal sm:whitespace-nowrap">
                    {expense.description}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600 text-xs sm:text-sm">
                    <span>{formatDate(expense.date)}</span>
                    <span>Paid by {expense.paidBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                  <span className="text-base sm:text-xl font-semibold text-gray-700">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <button onClick={() => setExpanded((prev) => ({ ...prev, [expense.id]: !prev[expense.id] }))} className="px-2 py-1 text-gray-600 rounded border border-gray-200 hover:bg-gray-100" aria-label="Expand">
                    {expanded[expense.id] ? '▾' : '▸'}
                  </button>
                </div>
              </div>
              {expanded[expense.id] && (
                <div className="px-4 pb-4 text-gray-700 border-t border-gray-200 bg-white">
                  <div className="mt-2 text-sm">
                    <div className="mb-2 text-gray-600">
                      <span className="font-medium">Split Details</span>
                      {expense.splitType === 'custom' && <span className="text-xs bg-gray-100 border border-gray-200 rounded px-2 py-0.5 ml-2">custom</span>}
                    </div>
                    {expense.splitType === 'custom' && expense.customAmounts && (
                      <ul className="mb-3">
                        {expense.splitBetween.map((p) => (
                          <li key={p} className="flex justify-between py-1">
                            <span>{p}</span>
                            <span className="text-red-600 font-medium">owes ${((expense.customAmounts && expense.customAmounts[p]) || 0).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {expense.splitType === 'equal' && (
                      <div className="text-xs text-gray-600 mb-3">Equal split among: {expense.splitBetween.join(', ')}</div>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this expense?')) onDelete(expense.id); }} className="w-full mt-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-red-700">
                      Delete Expense
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-700">
        <p>
          Total Expenses: <strong>{expenses.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default ExpenseList;
