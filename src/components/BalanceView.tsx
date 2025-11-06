import { PersonTotals, SimplifiedDebt } from '../types';

interface BalanceViewProps {
  people: string[];
  totalSpending: number;
  totals: Record<string, PersonTotals>;
  settlements: SimplifiedDebt[];
}

function BalanceView({ people, totalSpending, totals, settlements }: BalanceViewProps) {

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
      <h2 className="text-gray-700 mb-4 text-2xl border-b-2 border-gray-200 pb-2">
        🧮 Balances
      </h2>

      <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-lg mb-6 shadow-sm">
        <span className="text-sm sm:text-base">Total Group Spending:</span>
        <strong className="text-lg sm:text-2xl">${totalSpending.toFixed(2)}</strong>
      </div>

      <div className="mb-6">
        <h3 className="text-gray-600 my-2 text-lg">Individual Balances</h3>
        {people.map((person) => {
          const t = totals[person] || { paid: 0, owed: 0, net: 0 };
          const status = t.net > 0.005 ? 'is owed' : t.net < -0.005 ? 'owes' : 'settled up';
          const amount = Math.abs(t.net);
          const sign = t.net > 0.005 ? '+' : t.net < -0.005 ? '-' : '';
          return (
            <div
              key={person}
              className={
                `flex justify-between items-center px-3 py-3 mb-2 rounded-md transition-all hover:translate-x-1 border ` +
                (t.net > 0.005
                  ? 'bg-green-100 border-green-200'
                  : t.net < -0.005
                  ? 'bg-red-100 border-red-200'
                  : 'bg-gray-100 border-gray-300')
              }
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">{person}</span>
                <span className="text-gray-600 text-xs">paid ${t.paid.toFixed(2)} • owes ${t.owed.toFixed(2)}</span>
              </div>
              <span className="flex items-center gap-2">
                <span className="text-gray-700 text-sm">{status}</span>
                <strong className={t.net > 0.005 ? 'text-green-700 text-lg' : t.net < -0.005 ? 'text-red-700 text-lg' : 'text-gray-700 text-lg'}>{sign}${amount.toFixed(2)}</strong>
              </span>
            </div>
          );
        })}
      </div>

      {settlements.length === 0 ? (
        <div className="text-center py-8 bg-green-100 rounded-lg text-green-900 font-medium">
          <p>✅ All balances are settled!</p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-gray-700 mb-1 font-medium">🧾 Suggested Settlements</h3>
          <p className="text-xs text-gray-500 mb-3">Minimum transactions to settle all debts:</p>
          <ul className="text-gray-800">
            {settlements.map((s, idx) => (
              <li key={idx} className="mb-1 flex items-center justify-between">
                <span>
                  <span className="font-medium text-red-600">{s.from}</span>
                  <span className="text-gray-500 mx-1">→</span>
                  <span className="font-medium text-green-600">{s.to}</span>
                </span>
                <span className="text-sm font-semibold text-red-600">${s.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BalanceView;
