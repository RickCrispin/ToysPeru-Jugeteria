import React from 'react'
import HomeHero from '../components/HomeHero'
import HomeProducts from '../components/HomeProducts'
import HomeCategories from '../components/HomeCategories'
import HomeFeatures from '../components/HomeFeatures'

export default function HomePage() {
  return (
    <div className="space-y-16 pt-0">
      {/* Hero con Video */}
      <section className="px-4">
        <HomeHero />
      </section>

      {/* Sección de Bienvenida */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl shadow-md p-8">
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Bienvenidos a Toys Perú</h2>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Tu tienda de confianza para juguetes de calidad. Desde los más pequeños hasta los adolescentes, tenemos algo especial para cada edad y personalidad.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            Nos dedicamos a traer alegría a cada hogar con juguetes seguros, educativos y divertidos que estimulen la imaginación y creatividad.
          </p>
        </div>
      </section>

      {/* Categorías */}
      <section className="container mx-auto px-4">
        <HomeCategories />
      </section>

      {/* Productos Destacados */}
      <section className="container mx-auto px-4">
        <HomeProducts />
      </section>

      {/* Características */}
      <section className="container mx-auto px-4">
        <HomeFeatures />
      </section>

      {/* Sección de Newsletter */}
      <section className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Recibe Ofertas Exclusivas</h3>
          <p className="mb-6">Suscríbete a nuestro boletín y obtén descuentos especiales en tus próximas compras.</p>
          <div className="flex flex-col md:flex-row gap-2 justify-center">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="px-4 py-2 rounded-lg flex-1 max-w-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold px-6 py-2 rounded-lg transition">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
