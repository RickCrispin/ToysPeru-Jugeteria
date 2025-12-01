import React, { useState, useEffect } from 'react'
import HomeHero from '../components/HomeHero'
import HomeProducts from '../components/HomeProducts'
import HomeCategories from '../components/HomeCategories'
import HomeFeatures from '../components/HomeFeatures'
import HomeTestimonials from '../components/HomeTestimonials'
import HomeStats from '../components/HomeStats'
import HomeFAQ from '../components/HomeFAQ'

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState({})

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      const sections = document.querySelectorAll('[data-scroll-section]')
      const newVisible = {}
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.8
        newVisible[section.dataset.scrollSection] = isVisible
      })
      
      setVisibleSections(newVisible)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative overflow-hidden pt-0">
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
        @keyframes floatIn {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes rotateInX {
          from {
            opacity: 0;
            transform: rotateX(90deg);
          }
          to {
            opacity: 1;
            transform: rotateX(0deg);
          }
        }
        @keyframes wiggleLetters {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(1deg); }
          50% { transform: translateY(5px) rotate(-1deg); }
          75% { transform: translateY(-3px) rotate(0.5deg); }
        }
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-on-scroll {
          opacity: 0;
          animation: slideInUp 0.8s ease-out forwards;
        }
        .section-visible {
          animation: slideInUp 0.8s ease-out forwards !important;
        }
        .wiggle-char {
          display: inline-block;
          animation: wiggleLetters 0.6s ease-in-out;
        }
        .perspective {
          perspective: 1000px;
        }
        .rotate-in {
          animation: rotateInX 0.8s ease-out;
        }
      `}</style>

      {/* Fondo animado con gradientes */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50 to-indigo-50"></div>
        <div className="absolute top-1/4 -left-1/3 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.5}px)` }}></div>
        <div className="absolute bottom-1/4 -right-1/3 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * -0.3}px)` }}></div>
      </div>

      {/* Hero con Video */}
      <section className="px-4 relative z-10 pb-6 md:pb-10">
        <HomeHero />
      </section>

      {/* Sección de Bienvenida - Breve y concisa */}
      <section className="container mx-auto px-4 py-8 md:py-12 relative z-10" data-scroll-section="welcome">
        <div
          className={`text-center transition-all duration-1000 ${
            visibleSections.welcome ? 'section-visible' : 'opacity-0'
          }`}
        >
          <p className="text-base md:text-lg text-gray-700 mb-2">
            Nos dedicamos a traer alegría a cada hogar con juguetes seguros, educativos y divertidos
          </p>
          <p className="text-sm md:text-base text-gray-600">
            que estimulen la imaginación y creatividad de grandes y pequeños.
          </p>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="relative z-10" data-scroll-section="stats">
        <HomeStats visibleSections={visibleSections} />
      </section>

      {/* Categorías */}
      <section className="container mx-auto px-4 py-12 md:py-20 relative z-10" data-scroll-section="categories">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          visibleSections.categories ? 'section-visible' : 'opacity-0'
        }`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Explora Nuestras Categorías</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">Encuentra el juguete perfecto para cada ocasión</p>
        </div>
        <HomeCategories />
      </section>

      {/* Productos Destacados */}
      <section className="container mx-auto px-4 py-12 md:py-20 relative z-10" data-scroll-section="products">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          visibleSections.products ? 'section-visible' : 'opacity-0'
        }`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Productos Destacados</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">Los favoritos de nuestros clientes</p>
        </div>
        <HomeProducts />
      </section>

      {/* Características */}
      <section className="relative z-10" data-scroll-section="features">
        <HomeFeatures />
      </section>

      {/* Testimoniales */}
      <section className="container mx-auto px-4 py-12 md:py-20 relative z-10" data-scroll-section="testimonials">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          visibleSections.testimonials ? 'section-visible' : 'opacity-0'
        }`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">Miles de familias felices confían en nosotros</p>
        </div>
        <HomeTestimonials />
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-12 md:py-20 relative z-10" data-scroll-section="faq">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          visibleSections.faq ? 'section-visible' : 'opacity-0'
        }`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Preguntas Frecuentes</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">Resolvemos tus dudas</p>
        </div>
        <HomeFAQ />
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 py-12 md:py-20 relative z-10" data-scroll-section="newsletter">
        <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl transition-all duration-1000 ${
          visibleSections.newsletter ? 'section-visible' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" style={{ transform: `translateY(${scrollY * 0.1}px)` }}></div>
          
          <div className="relative p-8 md:p-12 lg:p-20 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-4 md:mb-6 text-3xl md:text-4xl">✉️</div>
            <span className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-80">Ofertas Exclusivas</span>
            
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Suscríbete a Nuestro Boletín</h3>
            <p className="text-base md:text-lg text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto px-4">Recibe descuentos especiales, nuevas colecciones y ofertas exclusivas directamente en tu bandeja de entrada.</p>
            
            <form className="flex flex-col md:flex-row gap-2 md:gap-3 justify-center max-w-lg mx-auto mb-4 md:mb-6 px-4">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="px-4 md:px-6 py-2 md:py-3 rounded-lg flex-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all text-sm md:text-base"
              />
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold px-6 md:px-8 py-2 md:py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 text-sm md:text-base whitespace-nowrap">
                Suscribirse
              </button>
            </form>
            
            <p className="text-white/70 text-xs md:text-sm">✓ Sin spam • ✓ Fácil de desuscribirse • ✓ Tus datos son seguros</p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-12 md:py-20 relative z-10 text-center mb-8 md:mb-0" data-scroll-section="cta-final">
        <div className={`transition-all duration-1000 ${
          visibleSections['cta-final'] ? 'section-visible' : 'opacity-0'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">¿Aún no encuentras lo que buscas?</h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 px-4">Contáctanos y nuestro equipo te ayudará a encontrar el juguete perfecto</p>
          <div className="flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 justify-center">
            <button className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all text-sm md:text-base">
              Contactar Soporte
            </button>
            <button className="w-full md:w-auto px-6 md:px-8 py-2 md:py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition-all text-sm md:text-base">
              Ver Todas las Categorías
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
