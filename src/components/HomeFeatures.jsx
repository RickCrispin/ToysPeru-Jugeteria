import React, { useState } from 'react'

export default function HomeFeatures() {
  const [hoveredIdx, setHoveredIdx] = useState(null)

  const features = [
    {
      icon: '🚚',
      title: 'Envío Rápido y Seguro',
      description: 'Entrega garantizada en 24-48 horas a todo el país con rastreo en tiempo real y embalaje premium que protege tus compras.',
      details: 'Cobertura nacional • Rastreo GPS • Asegurado'
    },
    {
      icon: '💳',
      title: 'Pago 100% Seguro',
      description: 'Múltiples métodos de pago disponibles con encriptación de nivel bancario. Tu información está completamente protegida.',
      details: 'Tarjeta • PayPal • Yape • Plin • Transferencia'
    },
    {
      icon: '🎁',
      title: 'Garantía y Satisfacción',
      description: 'Todos nuestros productos vienen con garantía de satisfacción. Si no estás feliz, devolvemos tu dinero sin preguntas.',
      details: '30 días de garantía • Devolución fácil • Reembolso total'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Para Toda la Familia',
      description: 'Juguetes cuidadosamente seleccionados para todas las edades. Desde bebés hasta adolescentes, tenemos opciones para todos.',
      details: '0+ años • Educativos • Seguros • Aprobados'
    }
  ]

  return (
    <section className="py-12 md:py-20 relative">
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
        .animate-slide-in {
          animation: slideInUp 0.6s ease-out forwards;
        }
      `}</style>

      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-6">
            <div className="w-1 md:w-2 h-1 md:h-2 bg-indigo-600 rounded-full"></div>
            <span className="text-xs md:text-sm font-bold text-indigo-600 uppercase tracking-wider">Por Qué Elegirnos</span>
            <div className="w-1 md:w-2 h-1 md:h-2 bg-indigo-600 rounded-full"></div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">¿Por Qué Elegir Toys Perú?</h2>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto px-2">Ofrecemos la mejor experiencia de compra con garantía de calidad y satisfacción</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group cursor-pointer relative"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                animation: `slideInUp 0.6s ease-out ${idx * 0.1}s both`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg md:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              
              <div className="relative bg-white/80 backdrop-blur-xl p-4 md:p-6 lg:p-8 rounded-lg md:rounded-2xl border border-white/20 h-full shadow-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-lg md:rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                <div className="text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-6 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">{feature.icon}</div>
                
                <h3 className="text-base md:text-lg lg:text-xl font-bold mb-2 md:mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors">{feature.title}</h3>
                
                <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-4 leading-relaxed min-h-[60px]">{feature.description}</p>
                
                <div className="overflow-hidden max-h-0 group-hover:max-h-20 transition-all duration-300">
                  <div className="pt-3 md:pt-4 border-t border-gray-200">
                    <p className="text-xs text-indigo-600 font-semibold">{feature.details}</p>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full -mr-2 md:-mr-4 -mb-2 md:-mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Sección de beneficios adicionales */}
        <div className="mt-8 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
          <div className="flex items-start md:items-center gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg md:rounded-xl border border-green-100">
            <div className="text-3xl md:text-4xl flex-shrink-0">✓</div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm md:text-base mb-0 md:mb-1">Productos Verificados</h4>
              <p className="text-xs md:text-sm text-gray-600">Cada producto pasa control de calidad riguroso</p>
            </div>
          </div>
          <div className="flex items-start md:items-center gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg md:rounded-xl border border-blue-100">
            <div className="text-3xl md:text-4xl flex-shrink-0">⭐</div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm md:text-base mb-0 md:mb-1">Reseñas Auténticas</h4>
              <p className="text-xs md:text-sm text-gray-600">Opiniones verificadas de clientes reales</p>
            </div>
          </div>
          <div className="flex items-start md:items-center gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg md:rounded-xl border border-pink-100">
            <div className="text-3xl md:text-4xl flex-shrink-0">💝</div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm md:text-base mb-0 md:mb-1">Programa Loyalty</h4>
              <p className="text-xs md:text-sm text-gray-600">Gana puntos en cada compra y canjéalos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
