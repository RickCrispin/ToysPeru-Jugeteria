import React, { useEffect, useState } from 'react'
import { getCount } from '../lib/cart'

export default function Header({ onCartClick, onSearch }) {
    const [count, setCount] = useState(() => (typeof globalThis !== 'undefined' ? getCount() : 0))
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        function onUpdate(e) {
            setCount(e?.detail?.count ?? getCount())
        }
        globalThis.addEventListener('cartUpdated', onUpdate)
        return () => globalThis.removeEventListener('cartUpdated', onUpdate)
    }, [])

    function handleSearch(val) {
        setSearchTerm(val)
        onSearch?.(val)
    }

    return (
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center font-bold text-lg">🧸</div>
                    <div className="text-2xl font-bold">Juguetería Alegre</div>
                </div>

                <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md">
                    <input
                        type="search"
                        placeholder="Buscar juguetes..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    />
                    <button className="bg-white/30 px-4 py-2 rounded-lg hover:bg-white/40">🔍</button>
                </div>

                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex gap-6">
                        <a href="#" className="hover:text-yellow-200 transition">Inicio</a>
                        <a href="#productos" className="hover:text-yellow-200 transition">Productos</a>
                        <a href="#contacto" className="hover:text-yellow-200 transition">Contacto</a>
                    </nav>

                    <button
                        onClick={onCartClick}
                        className="relative bg-white/30 hover:bg-white/40 px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                        🛒 Carrito
                        {count > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{count}</span>}
                    </button>
                </div>
            </div>
        </header>
    )
}