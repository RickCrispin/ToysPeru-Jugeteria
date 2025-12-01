import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const { user, role, signOut } = useAuth()
    const [showConfirm, setShowConfirm] = useState(false)

    // Proteger acceso solo a admins
    if (role !== 'admin') {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-elevated p-8 text-center">
                    <h2 className="text-2xl font-bold mb-2 text-red-600">Acceso Denegado</h2>
                    <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta página.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold"
                    >Ir al inicio</button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Panel de Administración</h1>
                    <p className="text-purple-200">Gestión completa del sistema</p>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Gestor de Usuarios */}
                    <div
                        onClick={() => navigate('/admin/users')}
                        className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform"
                    >
                        <div className="text-5xl mb-4">👥</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestor de Usuarios</h2>
                        <p className="text-gray-600 mb-4">Ver, modificar y eliminar usuarios</p>
                        <div className="text-sm text-indigo-600 font-semibold">→ Acceder</div>
                    </div>

                    {/* Gestor de Productos */}
                    <div
                        onClick={() => navigate('/admin/products')}
                        className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform"
                    >
                        <div className="text-5xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestor de Productos</h2>
                        <p className="text-gray-600 mb-4">Crear, editar y eliminar productos</p>
                        <div className="text-sm text-indigo-600 font-semibold">→ Acceder</div>
                    </div>

                    {/* Gestor de Roles */}
                    <div
                        onClick={() => navigate('/admin/roles')}
                        className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform"
                    >
                        <div className="text-5xl mb-4">🔐</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestor de Roles</h2>
                        <p className="text-gray-600 mb-4">Administrar roles y permisos</p>
                        <div className="text-sm text-indigo-600 font-semibold">→ Acceder</div>
                    </div>

                    {/* Resumen de Ventas */}
                    <div
                        onClick={() => navigate('/admin/sales')}
                        className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform"
                    >
                        <div className="text-5xl mb-4">📊</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Resumen de Ventas</h2>
                        <p className="text-gray-600 mb-4">Análisis gerencial de ventas</p>
                        <div className="text-sm text-indigo-600 font-semibold">→ Acceder</div>
                    </div>
                </div>

                {/* Usuario Actual */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                    <p className="text-white">
                        <span className="text-purple-200">Admin conectado:</span> {user?.email}
                    </p>
                </div>

                {/* Botón de salir */}
                <button
                    onClick={() => setShowConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                    Salir del Panel
                </button>

                {/* Confirmación */}
                {showConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 shadow-2xl">
                            <h3 className="text-xl font-bold mb-4">¿Regresar a la tienda?</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700"
                                >
                                    Sí, ir a inicio
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
