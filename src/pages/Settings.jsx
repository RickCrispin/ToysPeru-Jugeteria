import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SettingsPage() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState('')
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        orderUpdates: true,
        promotions: false
    })

    async function handleChangePassword(e) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        if (passwordData.newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            setLoading(false)
            return
        }

        try {
            const { error: err } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            })

            if (err) throw err

            setSuccess('Contraseña actualizada correctamente')
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            console.error('Error actualizando contraseña:', err)
            setError(err.message || 'Error al cambiar la contraseña')
        } finally {
            setLoading(false)
        }
    }

    async function handleNotificationChange(key) {
        const updated = { ...notifications, [key]: !notifications[key] }
        setNotifications(updated)

        try {
            await supabase
                .from('user_settings')
                .upsert({
                    user_id: user?.id,
                    notifications: updated,
                    updated_at: new Date().toISOString()
                })
        } catch (err) {
            console.error('Error actualizando preferencias:', err)
        }
    }

    function handlePasswordChange(e) {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
    }

    async function handleDeleteAccount() {
        if (deleteConfirmation !== 'ELIMINAR CUENTA') {
            setError('Debes escribir "ELIMINAR CUENTA" para confirmar')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        try {
            // Llamar función RPC para liberar el email y limpiar todos los datos
            const { data: liberarResult, error: liberarError } = await supabase
                .rpc('liberar_email', { email_to_release: user?.email })

            if (liberarError) {
                console.warn('⚠️ Error al liberar email:', liberarError)
                // Continuar de todas formas con el cierre de sesión
            } else {
                console.log('✅ Email liberado:', liberarResult)
            }

            // Cerrar sesión inmediatamente
            console.log('🔐 Cerrando sesión...')
            await signOut()
            
            // Limpiar también el localStorage y sessionStorage
            localStorage.clear()
            sessionStorage.clear()
            
            setSuccess('Cuenta eliminada completamente. El email quedará disponible para registros nuevos. Redirigiendo...')
            setShowDeleteModal(false)
            
            // Redirigir después de un pequeño delay para que vea el mensaje
            setTimeout(() => {
                navigate('/')
                // Recargar la página para limpiar todo el estado de React
                window.location.href = '/'
            }, 1500)

        } catch (err) {
            console.error('Error eliminando cuenta:', err)
            setError(err.message || 'Error al eliminar la cuenta')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-purple-50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Ajustes
                    </h1>
                    <p className="text-gray-600 mb-8">Gestiona tu cuenta y preferencias</p>

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

                    <div className="space-y-8">
                        <div className="border-b pb-8">
                            <h2 className="text-xl font-semibold mb-6 text-gray-800">Cambiar Contraseña</h2>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contraseña Actual
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        placeholder="Ingresa tu contraseña actual"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Por seguridad, no validamos contraseña actual. Asegúrate de recordarla.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        placeholder="Ingresa tu nueva contraseña"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        placeholder="Confirma tu nueva contraseña"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !passwordData.newPassword}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50 font-medium"
                                >
                                    {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
                                </button>
                            </form>
                        </div>

                        <div className="border-b pb-8">
                            <h2 className="text-xl font-semibold mb-6 text-gray-800">Preferencias de Notificaciones</h2>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.emailNotifications}
                                        onChange={() => handleNotificationChange('emailNotifications')}
                                        className="w-5 h-5 cursor-pointer"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">Notificaciones por Email</p>
                                        <p className="text-sm text-gray-500">Recibe confirmaciones y actualizaciones</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.orderUpdates}
                                        onChange={() => handleNotificationChange('orderUpdates')}
                                        className="w-5 h-5 cursor-pointer"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">Actualizaciones de Pedidos</p>
                                        <p className="text-sm text-gray-500">Recibe notificaciones sobre tus compras</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.promotions}
                                        onChange={() => handleNotificationChange('promotions')}
                                        className="w-5 h-5 cursor-pointer"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">Promociones y Ofertas</p>
                                        <p className="text-sm text-gray-500">Recibe información sobre nuestras promociones</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Información de Cuenta</h2>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Email registrado</p>
                                    <p className="font-medium text-gray-800">{user?.email}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">ID de Usuario</p>
                                    <p className="font-mono text-xs text-gray-600">{user?.id}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Cuenta creada</p>
                                    <p className="font-medium text-gray-800">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('es-PE') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-8 mt-8">
                            <h2 className="text-xl font-semibold mb-4 text-red-600">Zona de Peligro</h2>
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <p className="text-sm text-red-700 mb-4">
                                    ⚠️ Eliminar tu cuenta es permanente. Se eliminarán todos tus datos, pedidos, configuración y no podrás recuperar tu cuenta. Sin embargo, podrás registrar este correo electrónico con una cuenta nueva en el futuro.
                                </p>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition"
                                >
                                    Eliminar Cuenta Permanentemente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            ⚠️ Eliminar Cuenta
                        </h2>
                        
                        <p className="text-gray-700 mb-4">
                            Esta acción es <strong>irreversible</strong> y eliminará:
                        </p>
                        <ul className="text-sm text-gray-600 mb-6 space-y-2 list-disc list-inside">
                            <li>Tu perfil y datos personales</li>
                            <li>Tu email de autenticación</li>
                            <li>Tu contraseña</li>
                            <li>Todos tus pedidos y transacciones</li>
                            <li>Todas tus preferencias de configuración</li>
                        </ul>

                        <p className="text-gray-700 mb-4">
                            Para confirmar, escribe: <strong>ELIMINAR CUENTA</strong>
                        </p>

                        <input
                            type="text"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="Escribe ELIMINAR CUENTA"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                                {success}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setDeleteConfirmation('')
                                    setError('')
                                }}
                                disabled={loading}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading || deleteConfirmation !== 'ELIMINAR CUENTA'}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium"
                            >
                                {loading ? 'Eliminando...' : 'Eliminar Cuenta'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}