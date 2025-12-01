import React, { useEffect, useState } from 'react'
import { getCount } from '../lib/cart'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SearchDropdown from './SearchDropdown'
import UserDropdown from './UserDropdown'
import logo from '../img/LogoJugeteria.png'

export default function Header({ onCartClick, onSearch, onSelectProduct }) {
    const [count, setCount] = useState(() => (typeof globalThis !== 'undefined' ? getCount() : 0))
    const [searchTerm, setSearchTerm] = useState('')
    const [showSearchFocus, setShowSearchFocus] = useState(false)
    const { user, role, signOut } = useAuth()
    const navigate = useNavigate()

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
                <Link to="/" className="flex items-center gap-3">
                    <img src={logo} alt="Toys Perú Logo" className="w-12 h-12 rounded-full object-cover" />
                    <div className="text-2xl font-bold">Toys Perú</div>
                </Link>

                <div className="hidden sm:flex items-center gap-3 flex-1 max-w-md relative">
                    <div className="relative w-full">
                        <input
                            type="search"
                            placeholder="Buscar juguetes..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => setShowSearchFocus(true)}
                            className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        />
                        {showSearchFocus && searchTerm.trim() && <SearchDropdown 
                            searchTerm={searchTerm} 
                            onSelectProduct={(product) => {
                                onSelectProduct?.(product)
                                setShowSearchFocus(false)
                            }}
                            onDetailClose={() => {
                                setSearchTerm('')
                                setShowSearchFocus(false)
                            }} 
                        />}
                    </div>
                    <button className="bg-white/30 px-4 py-2 rounded-lg hover:bg-white/40">Buscar</button>
                </div>

                <div className="flex items-center gap-4">
                    <nav className="hidden md:flex gap-6">
                        <NavLink to="/" className={({ isActive }) => isActive ? 'text-yellow-300 font-semibold' : 'hover:text-yellow-200 transition'}>Inicio</NavLink>
                        <NavLink to="/productos" className={({ isActive }) => isActive ? 'text-yellow-300 font-semibold' : 'hover:text-yellow-200 transition'}>Productos</NavLink>
                        <NavLink to="/contacto" className={({ isActive }) => isActive ? 'text-yellow-300 font-semibold' : 'hover:text-yellow-200 transition'}>Contacto</NavLink>
                        {role === 'admin' && (
                            <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-yellow-300 font-semibold' : 'hover:text-yellow-200 transition'}>Admin</NavLink>
                        )}
                    </nav>

                    {user ? (
                        <UserDropdown user={user} role={role} />
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white/30 hover:bg-white/40 px-4 py-2 rounded-lg transition"
                        >Ingresar</button>
                    )}

                    <button
                        onClick={onCartClick}
                        className="relative bg-white/30 hover:bg-white/40 px-4 py-2 rounded-lg transition flex items-center gap-2"
                    >
                        Carrito
                        {count > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">{count}</span>}
                    </button>
                </div>
            </div>
        </header>
    )
}