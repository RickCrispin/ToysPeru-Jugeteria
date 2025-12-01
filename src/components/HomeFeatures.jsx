import React from 'react'

export default function HomeFeatures() {
  const features = [
    {
      icon: '🚚',
      title: 'Envío Rápido',
      description: 'Entrega en 24-48 horas a todo el país con embalaje seguro.'
    },
    {
      icon: '💳',
      title: 'Pago Seguro',
      description: 'Múltiples métodos de pago disponibles y totalmente seguro.'
    },
    {
      icon: '🎁',
      title: 'Garantía',
      description: 'Todos nuestros productos vienen con garantía de satisfacción.'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Para Toda la Familia',
      description: 'Juguetes para todas las edades y preferencias de diversión.'
    }
  ]

  return (
    <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16 rounded-2xl">
      <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">¿Por Qué Elegir Toys Perú?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
