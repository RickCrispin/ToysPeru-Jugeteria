import React, { useState, useEffect } from 'react'

export default function HomeStats({ visibleSections }) {
  const [counters, setCounters] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    satisfaction: 0
  })
  const [isVisible, setIsVisible] = useState(false)
  const [started, setStarted] = useState(false)

  // Detectar cuando la sección es visible en el viewport
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setIsVisible(true)
        setStarted(true)
      }
    }, { threshold: 0.3 })

    const section = document.querySelector('[data-stats-section]')
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) observer.unobserve(section)
    }
  }, [started])

  useEffect(() => {
    if (!isVisible || started) return
    
    setStarted(true)
    const intervals = {}
    const targets = {
      customers: 287,
      products: 50,
      orders: 1243,
      satisfaction: 4.9
    }

    Object.entries(targets).forEach(([key, target]) => {
      intervals[key] = setInterval(() => {
        setCounters(prev => {
          const increment = key === 'satisfaction' ? 0.1 : Math.ceil(target / 50)
          if (prev[key] < target) {
            const newValue = prev[key] + increment
            return { ...prev, [key]: newValue > target ? target : newValue }
          } else {
            clearInterval(intervals[key])
            return { ...prev, [key]: target }
          }
        })
      }, 30)
    })

    return () => Object.values(intervals).forEach(clearInterval)
  }, [isVisible, started])

  const stats = [
    {
      icon: '👥',
      label: 'Clientes Felices',
      value: counters.customers.toLocaleString(),
      suffix: '+',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📦',
      label: 'Productos Premium',
      value: counters.products.toLocaleString(),
      suffix: '',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🛍️',
      label: 'Órdenes Entregadas',
      value: counters.orders.toLocaleString(),
      suffix: '+',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '⭐',
      label: 'Satisfacción',
      value: counters.satisfaction.toFixed(1),
      suffix: '/5',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  return (
    <section className="py-12 md:py-20 relative overflow-hidden" data-stats-section="true">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 via-purple-100/50 to-pink-100/50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group relative"
              style={{
                animation: `slideInUp 0.6s ease-out ${idx * 0.15}s both`
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 rounded-xl md:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300`}></div>
              
              <div className="relative bg-white/90 backdrop-blur-xl p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl border border-white/30 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className="text-4xl md:text-5xl mb-2 md:mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                  {stat.icon}
                </div>
                
                <div className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}{stat.suffix}
                </div>
                
                <p className="text-gray-600 font-semibold text-xs md:text-sm uppercase tracking-wider">{stat.label}</p>
                
                <div className={`mt-3 md:mt-4 h-1 bg-gradient-to-r ${stat.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
