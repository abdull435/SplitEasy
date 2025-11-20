import { useState } from 'react';
import { ShoppingCart, X, Plus } from 'lucide-react';

export function ItemManager({ people, items, onAddItem, onRemoveItem }) {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName.trim() && price && selectedPersonId) {
      onAddItem(itemName.trim(), parseFloat(price), selectedPersonId);
      setItemName('');
      setPrice('');
    }
  };

  const getPersonName = (personId) => {
    const person = people.find(p => p.id === personId);
    return person ? person.name : 'Unknown';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Items</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-4 space-y-3">
        <input
          type="text"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          placeholder="Item name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={selectedPersonId}
          onChange={(e) => setSelectedPersonId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={people.length === 0}
        >
          <option value="">Select who bought this</option>
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={people.length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </form>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            {people.length === 0 ? 'Add people first' : 'No items added yet'}
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg group hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="text-gray-700 font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  Bought by: {getPersonName(item.personId)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-indigo-600 font-semibold">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
