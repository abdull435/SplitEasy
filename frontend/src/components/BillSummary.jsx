import { Calculator, TrendingUp, TrendingDown } from 'lucide-react';

export function BillSummary({ people, items }) {
  const calculateSummary = () => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const perPersonShare = people.length > 0 ? total / people.length : 0;

    const personSummary = people.map((person) => {
      const personItems = items.filter(item => item.personId === person.id);
      const totalSpent = personItems.reduce((sum, item) => sum + item.price, 0);
      const balance = totalSpent - perPersonShare;

      return {
        person,
        items: personItems,
        totalSpent,
        balance,
      };
    });

    return {
      total,
      perPersonShare,
      personSummary,
    };
  };

  const summary = calculateSummary();

  if (people.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Bill Summary</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-sm text-indigo-600 mb-1">Total Bill</div>
          <div className="text-3xl font-bold text-indigo-700">
            ${summary.total.toFixed(2)}
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 mb-1">Per Person</div>
          <div className="text-3xl font-bold text-blue-700">
            ${summary.perPersonShare.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {summary.personSummary.map(({ person, items: personItems, totalSpent, balance }) => (
          <div key={person.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{person.name}</h3>
                <div className="text-sm text-gray-500">
                  Spent: ${totalSpent.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                {balance > 0.01 ? (
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">+${balance.toFixed(2)}</span>
                  </div>
                ) : balance < -0.01 ? (
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingDown className="w-5 h-5" />
                    <span className="font-semibold">${balance.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="text-gray-500 font-semibold">Even</div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {balance > 0.01 ? 'Should receive' : balance < -0.01 ? 'Should pay' : 'Balanced'}
                </div>
              </div>
            </div>

            {personItems.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-600 mb-2">Items bought:</div>
                <div className="space-y-1">
                  {personItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-gray-600">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {summary.total > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-800">
            <strong>How to settle:</strong>
            {summary.personSummary
              .filter(s => s.balance < -0.01)
              .map((debtor) => {
                const creditors = summary.personSummary.filter(s => s.balance > 0.01);
                return creditors.map((creditor) => (
                  <div key={`${debtor.person.id}-${creditor.person.id}`} className="mt-1">
                    • {debtor.person.name} pays ${Math.min(Math.abs(debtor.balance), creditor.balance).toFixed(2)} to {creditor.person.name}
                  </div>
                ));
              })}
          </div>
        </div>
      )}
    </div>
  );
}
