import React, { useState } from 'react'

export default function HomeTestimonials() {
  const [activeIdx, setActiveIdx] = useState(0)

  const testimonials = [
    {
      name: 'María García',
      role: 'Madre de dos niños',
      image: '👩',
      content: 'La calidad de los productos es excelente. Mis hijos adoran los juguetes que compré. El envío fue rápido y seguro. ¡Definitivamente volveré!',
      rating: 5
    },
    {
      name: 'Carlos López',
      role: 'Abuelo',
      image: '👴',
      content: 'Increíble servicio. Encontré el regalo perfecto para mi nieta. El equipo de atención al cliente fue muy amable y me ayudó en todo momento.',
      rating: 5
    },
    {
      name: 'Sandra Martínez',
      role: 'Educadora',
      image: '👩‍🏫',
      content: 'Uso los juguetes educativos de Toys Perú en mi aula. Los niños aprenden mientras se divierten. ¡Una excelente inversión en educación!',
      rating: 5
    },
    {
      name: 'Roberto Díaz',
      role: 'Padre',
      image: '👨',
      content: 'Calidad excepcional. Los juguetes son seguros y estimulan la creatividad. La garantía de satisfacción me dio mucha confianza al comprar.',
      rating: 5
    },
    {
      name: 'Juanita Rodríguez',
      role: 'Mamá',
      image: '👩‍🦱',
      content: 'No esperaba tanta calidad por este precio. El catálogo es muy amplio y encuentro opciones para todas las edades. ¡Muy recomendado!',
      rating: 5
    }
  ]

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Carrusel principal */}
        <div className="max-w-4xl mx-auto mb-8 md:mb-12">
          <div className="relative">
            {/* Tarjeta principal */}
            <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12 border border-white/20 backdrop-blur-xl">
              {/* Comillas decorativas */}
              <div className="text-4xl md:text-6xl text-indigo-200 mb-2 md:mb-4 leading-none">"</div>

              {/* Contenido */}
              <p className="text-base md:text-lg lg:text-2xl text-gray-800 font-semibold mb-4 md:mb-8 leading-relaxed">
                {testimonials[activeIdx].content}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4 md:mb-6">
                {[...Array(testimonials[activeIdx].rating)].map((_, i) => (
                  <span key={i} className="text-lg md:text-2xl text-yellow-400">★</span>
                ))}
              </div>

              {/* Autor */}
              <div className="flex items-center gap-2 md:gap-4">
                <div className="text-4xl md:text-5xl">{testimonials[activeIdx].image}</div>
                <div>
                  <h4 className="font-bold text-sm md:text-lg text-gray-800">{testimonials[activeIdx].name}</h4>
                  <p className="text-indigo-600 text-xs md:text-sm">{testimonials[activeIdx].role}</p>
                </div>
              </div>

              {/* Indicador de posición */}
              <div className="absolute top-4 md:top-6 right-4 md:right-6 text-xs md:text-sm text-gray-400">
                {activeIdx + 1} / {testimonials.length}
              </div>
            </div>

            {/* Flechas de navegación - más pequeñas en móvil */}
            <button
              onClick={() => setActiveIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
              className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 md:p-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 text-sm md:text-base"
            >
              ←
            </button>
            <button
              onClick={() => setActiveIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
              className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 md:p-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 text-sm md:text-base"
            >
              →
            </button>
          </div>
        </div>

        {/* Puntos de navegación */}
        <div className="flex items-center justify-center gap-2 mb-8 md:mb-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`h-2 md:h-3 rounded-full transition-all duration-300 ${
                idx === activeIdx
                  ? 'bg-indigo-600 w-6 md:w-8'
                  : 'bg-gray-300 w-2 md:w-3 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Grid de testimonios pequeños */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {testimonials.slice(0, 3).map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all border-l-4 border-indigo-600"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="text-3xl md:text-4xl">{testimonial.image}</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-xs md:text-sm">{testimonial.name}</h4>
                  <p className="text-gray-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-3">
                {testimonial.content}
              </p>
              <div className="flex gap-1 mt-3 md:mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm md:text-base">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
