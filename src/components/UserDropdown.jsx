import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function UserDropdown({ user, role }) {
    const [isOpen, setIsOpen] = useState(false)
    const [firstName, setFirstName] = useState('Usuario')
    const navigate = useNavigate()
    const { signOut } = useAuth()

    useEffect(() => {
        if (user?.id) {
            loadUserName()
        }
    }, [user?.id])

    async function loadUserName() {
        try {
            // Primero intentar buscar por ID
            let { data, error } = await supabase
                .from('profiles')
                .select('nombre')
                .eq('id', user?.id)
                .single()

            // Si no encuentra por ID, buscar por email
            if (error && error.code === 'PGRST116' && user?.email) {
                const { data: profileByEmail, error: emailError } = await supabase
                    .from('profiles')
                    .select('nombre')
                    .eq('email', user.email)
                    .single()
                
                if (!emailError && profileByEmail) {
                    console.log('✅ Perfil encontrado por email, sincronizando...')
                    
                    // Sincronizar el ID
                    try {
                        await supabase
                            .from('profiles')
                            .update({
                                id: user.id,
                                email: user.email
                            })
                            .eq('email', user.email)
                    } catch (e) {
                        console.error('Error en sincronización:', e)
                    }
                    
                    data = profileByEmail
                    error = null
                }
            }

            if (!error && data?.nombre) {
                setFirstName(data.nombre.split(' ')[0])
            }
        } catch (err) {
            console.error('Error cargando nombre:', err)
        }
    }

    function handleNavigation(path) {
        navigate(path)
        setIsOpen(false)
    }

    function handleLogout() {
        signOut()
        navigate('/')
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white/30 hover:bg-white/40 px-4 py-2 rounded-lg transition text-white font-medium"
            >
                {firstName}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                        <p className="font-semibold text-sm">{user?.email}</p>
                        <p className="text-xs text-gray-500">{role}</p>
                    </div>

                    <nav className="py-2">
                        <button
                            onClick={() => handleNavigation('/account')}
                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition flex items-center gap-2"
                        >
                            <span>Cuenta</span>
                        </button>

                        {role === 'admin' && (
                            <button
                                onClick={() => handleNavigation('/admin')}
                                className="w-full text-left px-4 py-2 hover:bg-purple-50 transition flex items-center gap-2 bg-purple-100 text-purple-700 font-semibold"
                            >
                                <span>⚙️ Ajustes de Administrador</span>
                            </button>
                        )}

                        <button
                            onClick={() => handleNavigation('/orders')}
                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition flex items-center gap-2"
                        >
                            <span>Compras Realizadas</span>
                        </button>

                        <button
                            onClick={() => handleNavigation('/settings')}
                            className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition flex items-center gap-2"
                        >
                            <span>Ajustes</span>
                        </button>

                        <div className="border-t border-gray-200 my-2"></div>

                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 transition text-red-600 font-medium"
                        >
                            Cerrar Sesión
                        </button>
                    </nav>
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}
