import { useState } from 'react';
import { UserPlus, X, Users } from 'lucide-react';

export function PersonManager({ people, onAddPerson, onRemovePerson }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPerson(name.trim());
      setName('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-semibold text-gray-800">People</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter person's name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {people.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No people added yet</p>
        ) : (
          people.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg group hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700 font-medium">{person.name}</span>
              <button
                onClick={() => onRemovePerson(person.id)}
                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
