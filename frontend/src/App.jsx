import { useState } from 'react'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="md:text-3xl text-center mt-10 text-blue-600 font-bold">
      Tailwind is working! 🎉
    </div>

  )
}

export default App
