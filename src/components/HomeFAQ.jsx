import React, { useState } from 'react'

export default function HomeFAQ() {
  const [expandedIdx, setExpandedIdx] = useState(0)

  const faqs = [
    {
      question: '¿Cuál es el tiempo de entrega?',
      answer: 'Garantizamos entrega en 24-48 horas hábiles a cualquier punto del país. Ofrecemos rastreo en tiempo real y puedes seguir tu pedido desde que sale de nuestro almacén.',
      icon: '🚚'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito y débito, PayPal, Yape, Plin, y transferencia bancaria. Todos nuestros pagos están protegidos con encriptación de nivel bancario.',
      icon: '💳'
    },
    {
      question: '¿Puedo devolver un producto?',
      answer: 'Por supuesto. Tenemos una política de devolución de 30 días. Si no estás satisfecho, realizamos la devolución completa sin preguntas. Solo necesitas contactarnos.',
      icon: '↩️'
    },
    {
      question: '¿Los juguetes son seguros para todas las edades?',
      answer: 'Todos nuestros productos cumplen con estándares internacionales de seguridad. Cada uno está etiquetado con la edad recomendada. Los juguetes son educativos y estimulan la creatividad.',
      icon: '✅'
    },
    {
      question: '¿Hay descuentos para compras grandes?',
      answer: 'Sí. Ofrecemos descuentos especiales para compras al por mayor. También puedes unirte a nuestro programa de loyalty para obtener puntos en cada compra que puedes canjear.',
      icon: '🎁'
    },
    {
      question: '¿Cómo puedo contactar al servicio al cliente?',
      answer: 'Puedes contactarnos por email, WhatsApp, o llamar directamente. Tenemos un equipo disponible de lunes a sábado. También puedes usar el chat en vivo en nuestra página.',
      icon: '💬'
    }
  ]

  return (
    <section className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-2 md:space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="group"
              style={{
                animation: `slideInUp 0.5s ease-out ${idx * 0.08}s both`
              }}
            >
              <button
                onClick={() => setExpandedIdx(expandedIdx === idx ? -1 : idx)}
                className="w-full"
              >
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-lg md:rounded-xl p-4 md:p-6 hover:bg-white/95 transition-all duration-300 flex items-center justify-between group-hover:shadow-lg group-hover:border-indigo-300">
                  <div className="flex items-center gap-2 md:gap-4 text-left flex-1">
                    <span className="text-2xl md:text-3xl flex-shrink-0">{faq.icon}</span>
                    <h3 className="text-sm md:text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`text-lg md:text-2xl text-indigo-600 transform transition-transform duration-300 flex-shrink-0 ml-2 ${ expandedIdx === idx ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </div>
                </div>
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: expandedIdx === idx ? '500px' : '0px',
                  opacity: expandedIdx === idx ? 1 : 0
                }}
              >
                <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-t-0 border-white/20 rounded-b-lg md:rounded-b-xl p-4 md:p-6 text-gray-700 leading-relaxed text-sm md:text-base">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg md:rounded-2xl p-6 md:p-8 lg:p-12 text-white text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">¿Aún tienes dudas?</h3>
          <p className="mb-4 md:mb-6 text-sm md:text-lg">Nuestro equipo está disponible para ayudarte. No dudes en contactarnos.</p>
          <button className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 text-sm md:text-base">
            Contactar Soporte
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
