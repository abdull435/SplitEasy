import { useState } from 'react';
import { Receipt } from 'lucide-react';
import './index.css';
import { PersonManager } from './components/PersonManager';
import { ItemManager } from './components/ItemManager';
import { BillSummary } from './components/BillSummary';

function App() {
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState([]);

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

  const addItem = (name, price, personId) => {
    const newItem = {
      id: Date.now().toString(),
      name,
      price,
      personId,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Receipt className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Bill Splitter</h1>
          </div>
          <p className="text-gray-600">
            Add people, assign items, and split the bill fairly
          </p>
        </div>

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
