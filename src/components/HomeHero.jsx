import React, { useEffect, useState } from 'react'
import videoSource from '../img/NinosJugando.mp4'

export default function HomeHero() {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Iniciar animación cuando monta
    const timer = setTimeout(() => setAnimate(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
      {/* Video con blur */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
        style={{
          filter: 'blur(3px) brightness(0.7)',
        }}
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Contenido centrado con animación */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`text-center transform transition-all duration-1000 ${
            animate
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-90'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              Diversión Sin Límites
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-white drop-shadow-lg animate-pulse">
            Descubre el mundo mágico de Toys Perú
          </p>
        </div>
      </div>
    </div>
  )
}
