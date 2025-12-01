import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import videoSource from '../img/NinosJugando.mp4'

export default function HomeHero() {
  const navigate = useNavigate()
  const [animate, setAnimate] = useState(false)
  const [charIndices, setCharIndices] = useState({})

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const textLines = [
    'Bienvenido a Toys Perú',
    'Diversión Sin Límites',
    'Tu tienda de confianza para juguetes de calidad',
  ]

  return (
    <div className="relative w-screen -mx-4 sm:-mx-6 lg:-mx-8 h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] overflow-hidden">
      <style>{`
        @keyframes textFadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes charWiggle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(2deg); }
          50% { transform: translateY(8px) rotate(-2deg); }
          75% { transform: translateY(-4px) rotate(1deg); }
        }
        @keyframes glowPulse {
          0%, 100% { 
            text-shadow: 0 0 20px rgba(236, 72, 153, 0.5), 
                        0 0 30px rgba(168, 85, 247, 0.3);
          }
          50% { 
            text-shadow: 0 0 40px rgba(236, 72, 153, 0.8), 
                        0 0 60px rgba(168, 85, 247, 0.5);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
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
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .line-animate {
          animation: textFadeInUp 0.8s ease-out forwards;
        }
        .char-wiggle {
          display: inline-block;
          animation: charWiggle 0.6s ease-in-out infinite;
        }
        .glow-text {
          animation: glowPulse 3s ease-in-out infinite;
        }
        .slide-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .slide-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .fade-scale {
          animation: fadeInScale 0.8s ease-out forwards;
        }
      `}</style>

      {/* Video de fondo con efecto paralax */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
        style={{
          filter: 'blur(2px) brightness(0.6) saturate(1.1)',
        }}
      >
        <source src={videoSource} type="video/mp4" />
      </video>

      {/* Overlay gradiente oscuro mejorado */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60"></div>

      {/* Contenido principal - Más espacio y mejor distribución */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full text-center">
          
          {/* Línea 1: Bienvenida */}
          <div
            className="line-animate mb-4 md:mb-6"
            style={{ animationDelay: animate ? '0.2s' : '0s' }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text">
              Bienvenido a Toys Perú
            </h2>
          </div>

          {/* Línea 2: Título principal con efecto glow */}
          <div
            className="line-animate mb-8 md:mb-10"
            style={{ animationDelay: animate ? '0.4s' : '0s' }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white glow-text drop-shadow-2xl mb-2">
              Diversión Sin Límites
            </h1>
          </div>

          {/* Línea 3: Descripción corta */}
          <div
            className="line-animate mb-8 md:mb-12"
            style={{ animationDelay: animate ? '0.6s' : '0s' }}
          >
            <p className="text-base md:text-xl lg:text-2xl text-gray-100 drop-shadow-lg font-medium leading-relaxed">
              Tu tienda de confianza para juguetes de calidad y seguridad
            </p>
          </div>

          {/* Botones con animaciones laterales */}
          <div
            className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
            style={{ animationDelay: animate ? '0.8s' : '0s' }}
          >
            <button
              onClick={() => navigate('/productos')}
              className="slide-left px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg md:text-xl rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Ver Catálogo
            </button>
            <button
              onClick={() => navigate('/productos')}
              className="slide-right px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg md:text-xl rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              Ver Promociones
            </button>
          </div>
        </div>
      </div>

      {/* Indicador de scroll - Down arrow animation */}
      <div
        className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 fade-scale"
        style={{ animationDelay: animate ? '1s' : '0s' }}
      >
        <div className="flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-xs text-white font-semibold uppercase tracking-wider">Desplázate</span>
          <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  )
}
