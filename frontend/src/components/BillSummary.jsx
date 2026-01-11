import { useMemo, useRef, useState } from 'react';
import { toJpeg } from 'html-to-image';
import { Calculator, TrendingUp, TrendingDown, Share2 } from 'lucide-react';

export function BillSummary({ people, items }) {
  const shareableRef = useRef(null);
  const [sharing, setSharing] = useState(false);
  const [shareError, setShareError] = useState('');

  const summary = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price, 0);

    // Calculate what each person should pay based on items they participate in
    const personSummary = people.map((person) => {
      const personItems = items.filter((item) => item.personId === person.id);
      const totalSpent = personItems.reduce((sum, item) => sum + item.price, 0);

      // Calculate how much this person should pay
      let totalOwes = 0;
      items.forEach((item) => {
        if (item.participants && item.participants.length > 0) {
          // Item has specific participants
          if (item.participants.includes(person.id)) {
            totalOwes += item.price / item.participants.length;
          }
        } else {
          // Fallback: if no participants specified, split equally among all people
          totalOwes += item.price / people.length;
        }
      });

      const balance = totalSpent - totalOwes;

      return {
        person,
        items: personItems,
        totalSpent,
        totalOwes,
        balance,
      };
    });

    const debtors = personSummary
      .filter((p) => p.balance < -0.01)
      .map((p) => ({ name: p.person.name, amount: Math.abs(p.balance) }));
    const creditors = personSummary
      .filter((p) => p.balance > 0.01)
      .map((p) => ({ name: p.person.name, amount: p.balance }));

    const transfers = [];
    const debtorList = [...debtors];
    const creditorList = [...creditors];
    let d = 0;
    let c = 0;

    while (d < debtorList.length && c < creditorList.length) {
      const amount = Math.min(debtorList[d].amount, creditorList[c].amount);
      transfers.push({
        from: debtorList[d].name,
        to: creditorList[c].name,
        amount,
      });
      debtorList[d].amount -= amount;
      creditorList[c].amount -= amount;
      if (debtorList[d].amount <= 0.01) d += 1;
      if (creditorList[c].amount <= 0.01) c += 1;
    }

    return {
      total,
      personSummary,
      transfers,
    };
  }, [people, items]);

  const handleShare = async () => {
    if (!shareableRef.current || summary.total <= 0) return;
    setSharing(true);
    setShareError('');

    try {
      const dataUrl = await toJpeg(shareableRef.current, {
        quality: 0.95,
        backgroundColor: '#f8fafc',
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'split-summary.jpg', { type: 'image/jpeg' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'SplitEasy summary',
          text: 'Bill summary with who owes whom',
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'split-summary.jpg';
        link.click();
      }
    } catch (error) {
      console.error('Share failed', error);
      setShareError('Unable to create or share the image right now. Please try again.');
    } finally {
      setSharing(false);
    }
  };

  if (people.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Bill Summary</h2>
        </div>
        {summary.total > 0 && (
          <button
            type="button"
            onClick={handleShare}
            disabled={sharing}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-300"
          >
            <Share2 className="w-5 h-5" />
            {sharing ? 'Preparing...' : 'Share / Save'}
          </button>
        )}
      </div>

      <div ref={shareableRef} className="space-y-6">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="text-sm text-indigo-600 mb-1">Total Bill</div>
          <div className="text-3xl font-bold text-indigo-700">
            Rs {summary.total.toFixed(2)}
          </div>
        </div>

        <div className="space-y-4">
          {summary.personSummary.map(({ person, items: personItems, totalSpent, totalOwes, balance }) => (
            <div key={person.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{person.name}</h3>
                  <div className="text-sm text-gray-500">Total: Rs {(totalSpent + totalOwes).toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Spent: Rs {totalSpent.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">Should pay: Rs {totalOwes.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  {balance > 0.01 ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold">+Rs {balance.toFixed(2)}</span>
                    </div>
                  ) : balance < -0.01 ? (
                    <div className="flex items-center gap-1 text-red-600">
                      <TrendingDown className="w-5 h-5" />
                      <span className="font-semibold">Rs {balance.toFixed(2)}</span>
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
                  <div className="text-sm font-medium text-gray-600 mb-2">Items they paid for</div>
                  <div className="space-y-1">
                    {personItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-600">Rs {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {summary.total > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm font-semibold text-yellow-800 mb-2">Who pays whom</div>
            {summary.transfers.length > 0 ? (
              <div className="space-y-2 text-sm text-yellow-900">
                {summary.transfers.map((transfer, index) => (
                  <div key={`${transfer.from}-${transfer.to}-${index}`} className="flex justify-between">
                    <span>{`${transfer.from} -> ${transfer.to}`}</span>
                    <span className="font-semibold">Rs {transfer.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-yellow-800">Everyone is already settled.</div>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Generated by{' '}
            <a
              href="https://split-easy-xi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 underline"
            >
              split-easy-xi.vercel.app
            </a>
          </p>
        </div>
      </div>

      {shareError && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {shareError}
        </div>
      )}
    </div>
  );
}
