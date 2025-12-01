import React, { useEffect, useState } from 'react'
import { getCount } from '../lib/cart'

export default function FloatingCartButton({ scrollY, isScrolling, isCartOpen, onCartClick }) {
    const [count, setCount] = useState(() => getCount())
    const [shouldAutoOpen, setShouldAutoOpen] = useState(false)

    useEffect(() => {
        function onUpdate(e) {
            setCount(e?.detail?.count ?? getCount())
        }
        globalThis.addEventListener('cartUpdated', onUpdate)
        return () => globalThis.removeEventListener('cartUpdated', onUpdate)
    }, [])

    // Auto-abrir cuando el botón llega a cierta altura
    useEffect(() => {
        if (scrollY > 300 && !isCartOpen && !shouldAutoOpen) {
            setShouldAutoOpen(true)
            // Auto-abrir después de 200ms de estar en posición
            const timer = setTimeout(() => {
                if (scrollY > 300) {
                    onCartClick()
                    setShouldAutoOpen(false)
                }
            }, 200)
            return () => clearTimeout(timer)
        }
        if (scrollY < 300) {
            setShouldAutoOpen(false)
        }
    }, [scrollY, isCartOpen, onCartClick])

    // Solo mostrar si está scrolleando o si el carrito está abierto
    if (!isScrolling && scrollY < 100 && !isCartOpen) {
        return null
    }

    // Calcular posición: comienza desde arriba y baja con el scroll
    // Comienza en 100px, cuando scrollea 300px, está a 200px del top
    const topPosition = Math.min(100 + scrollY * 0.3, window.innerHeight - 100)

    return (
        <button
            onClick={onCartClick}
            className="fixed right-4 z-40 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 p-4 flex items-center justify-center group"
            style={{
                top: `${topPosition}px`,
                transform: scrollY > 300 ? 'scale(1.1)' : 'scale(1)',
                opacity: isScrolling || scrollY > 100 ? 1 : 0.7,
            }}
            title="Abrir carrito"
        >
            <svg 
                className="w-6 h-6 transition-transform group-hover:scale-110" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
            </svg>
            
            {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
                    {count}
                </span>
            )}

            {/* Tooltip en hover */}
            <div className="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {count} items en carrito
            </div>
        </button>
    )
}
