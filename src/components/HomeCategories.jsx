import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HomeCategories() {
  const navigate = useNavigate()
  
  const categories = [
    { name: 'Peluches', icon: '🧸', color: 'from-pink-400 to-pink-600' },
    { name: 'Construcción', icon: '🏗️', color: 'from-yellow-400 to-yellow-600' },
    { name: 'Vehículos', icon: '🚗', color: 'from-red-400 to-red-600' },
    { name: 'Puzzles', icon: '🧩', color: 'from-blue-400 to-blue-600' },
    { name: 'Muñecas', icon: '👧', color: 'from-purple-400 to-purple-600' },
    { name: 'Deportes', icon: '⚽', color: 'from-green-400 to-green-600' }
  ]

  const handleCategoryClick = (categoryName) => {
    navigate(`/productos?categoria=${encodeURIComponent(categoryName)}`)
  }

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Explora Categorías</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => handleCategoryClick(cat.name)}
            className={`bg-gradient-to-br ${cat.color} p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105 text-white text-center cursor-pointer border-none`}
          >
            <div className="text-4xl mb-2">{cat.icon}</div>
            <p className="font-semibold">{cat.name}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
