import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const PAISES_LATAM = [
    'Argentina',
    'Bolivia',
    'Brasil',
    'Chile',
    'Colombia',
    'Costa Rica',
    'Cuba',
    'Ecuador',
    'El Salvador',
    'Guatemala',
    'Guyana',
    'Haití',
    'Honduras',
    'Jamaica',
    'México',
    'Nicaragua',
    'Panamá',
    'Paraguay',
    'Perú',
    'Puerto Rico',
    'República Dominicana',
    'Surinam',
    'Uruguay',
    'Venezuela'
]

export default function AccountPage() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [profile, setProfile] = useState({
        email: '',
        nombre: '',
        apellidos: '',
        telefono: '',
        ciudad: '',
        pais: '',
        role: 'user'
    })

    useEffect(() => {
        loadProfile()
    }, [user?.id])

    async function loadProfile() {
        try {
            // Primero intentar buscar por ID del usuario
            let { data, error: err } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single()

            // Si no encuentra por ID, buscar por email
            if (err && err.code === 'PGRST116' && user?.email) {
                console.log('No perfil por ID, buscando por email...')
                const { data: profileByEmail, error: emailErr } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('email', user.email)
                    .single()
                
                if (!emailErr && profileByEmail) {
                    console.log('Perfil encontrado por email, sincronizando datos...')
                    
                    // Sincronizar los datos: copiar el ID correcto y actualizar el perfil
                    try {
                        const { error: updateError } = await supabase
                            .from('profiles')
                            .update({
                                id: user.id,  // Usar el ID correcto del usuario autenticado
                                email: user.email,
                                updated_at: new Date().toISOString()
                            })
                            .eq('email', user.email)
                        
                        if (updateError) {
                            console.error('Error al sincronizar perfil:', updateError)
                        } else {
                            console.log('Datos sincronizados correctamente')
                        }
                    } catch (e) {
                        console.error('Error en sincronización:', e)
                    }
                    
                    data = profileByEmail
                    err = null
                }
            }

            if (err && err.code !== 'PGRST116') throw err

            if (data) {
                setProfile({
                    email: data.email || user?.email || '',
                    nombre: data.nombre || '',
                    apellidos: data.apellidos || '',
                    telefono: data.telefono || '',
                    ciudad: data.ciudad || '',
                    pais: data.pais || '',
                    role: data.role || 'user'
                })
            }
        } catch (err) {
            console.error('Error cargando perfil:', err)
        }
    }

    async function handleSave() {
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const { error: err } = await supabase
                .from('profiles')
                .upsert({
                    id: user?.id,
                    email: profile.email,
                    nombre: profile.nombre,
                    apellidos: profile.apellidos,
                    telefono: profile.telefono,
                    ciudad: profile.ciudad,
                    pais: profile.pais,
                    role: profile.role,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'id'
                })

            if (err) {
                console.error('Error en profiles:', err)
                setError('Error al guardar el perfil. Asegúrate de que el SQL se ejecutó correctamente.')
                setLoading(false)
                return
            }

            setSuccess('Perfil actualizado correctamente')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error('Error guardando perfil:', err)
            setError(err.message || 'Error al guardar el perfil')
        } finally {
            setLoading(false)
        }
    }
    function handleChange(e) {
        const { name, value } = e.target
        setProfile(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-purple-50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Mi Cuenta
                    </h1>
                    <p className="text-gray-600 mb-8">Gestiona tu información personal</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                            {success}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Información Personal</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">El email se sincroniza automáticamente desde tu cuenta</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={profile.nombre}
                                            onChange={handleChange}
                                            placeholder="Juan"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                                        <input
                                            type="text"
                                            name="apellidos"
                                            value={profile.apellidos}
                                            onChange={handleChange}
                                            placeholder="Pérez García"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={profile.telefono}
                                        onChange={handleChange}
                                        placeholder="+51 999 999 999"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-b pb-6">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Ubicación</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                                        <select
                                            name="pais"
                                            value={profile.pais}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        >
                                            <option value="">Selecciona un país</option>
                                            {PAISES_LATAM.map(pais => (
                                                <option key={pais} value={pais}>{pais}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            value={profile.ciudad}
                                            onChange={handleChange}
                                            placeholder="Lima"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                disabled={loading}
                                onClick={handleSave}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50"
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
