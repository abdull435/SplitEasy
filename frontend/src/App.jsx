import { useState } from 'react';
import { Receipt, LogIn, X } from 'lucide-react';
import './index.css';
import { PersonManager } from './components/PersonManager';
import { ItemManager } from './components/ItemManager';
import { BillSummary } from './components/BillSummary';

function App() {
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState([]);
  const [loginError, setLoginError] = useState('');

  const addPerson = (name) => {
    const newPerson = {
      id: Date.now().toString(),
      name,
    };
    setPeople((prev) => [...prev, newPerson]);
  };

  const removePerson = (id) => {
    setPeople((prev) => prev.filter((person) => person.id !== id));
    setItems((prev) => prev.filter((item) => item.personId !== id));
  };

  const addItem = (name, price, personId, participants) => {
    const newItem = {
      id: Date.now().toString(),
      name,
      price,
      personId,
      participants,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLogin = () => {
    setLoginError('Server is not working to save, but you can simply split bills now');
    setTimeout(() => setLoginError(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="flex items-center justify-center gap-3 flex-1">
              <Receipt className="w-10 h-10 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-800">Bill Splitter</h1>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogIn className="w-5 h-5" />
                Login
              </button>
            </div>
          </div>
          <p className="text-gray-600">
            Add people, assign items, and split the bill fairly
          </p>
        </div>

        {loginError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
            <div className="text-red-700">{loginError}</div>
            <button
              onClick={() => setLoginError('')}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <PersonManager
            people={people}
            onAddPerson={addPerson}
            onRemovePerson={removePerson}
          />

          <ItemManager
            people={people}
            items={items}
            onAddItem={addItem}
            onRemoveItem={removeItem}
          />
        </div>

        <BillSummary people={people} items={items} />
      </div>
    </div>
  );
}

export default App;
