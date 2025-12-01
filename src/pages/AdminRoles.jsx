import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import {
  getAllRoles,
  getRoleWithPermissions,
  createRole,
  updateRole,
  deleteRole,
  getAllPermisos,
  assignPermissionsToRole,
  getPermisosByCategoria
} from '../lib/rolesAPI'

export default function AdminRolesPage() {
  const { role } = useAuth()
  const [roles, setRoles] = useState([])
  const [permisos, setPermisos] = useState({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    nombre: '',
    descripcion: ''
  })
  const [selectedPermisos, setSelectedPermisos] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchRoles()
    fetchPermisos()
  }, [])

  async function fetchRoles() {
    try {
      const data = await getAllRoles()
      setRoles(data)
      setLoading(false)
    } catch (err) {
      console.error('Error al cargar roles:', err)
      setError('Error al cargar roles')
      setLoading(false)
    }
  }

  async function fetchPermisos() {
    try {
      const data = await getPermisosByCategoria()
      setPermisos(data)
    } catch (err) {
      console.error('Error al cargar permisos:', err)
    }
  }

  function openNew() {
    setEditing(null)
    setIsEditMode(true)
    setForm({ nombre: '', descripcion: '' })
    setSelectedPermisos([])
    setShowModal(true)
    setError('')
  }

  async function openEdit(r) {
    try {
      const roleData = await getRoleWithPermissions(r.id)
      setEditing(r)
      setIsEditMode(false)
      setForm({ nombre: r.nombre, descripcion: r.descripcion })
      setSelectedPermisos(roleData.permiso_ids)
      setShowModal(true)
      setError('')
    } catch (err) {
      console.error('Error al cargar detalles del rol:', err)
      setError('Error al cargar detalles del rol')
    }
  }

  function enterEditMode() {
    setIsEditMode(true)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function togglePermiso(permisoId) {
    setSelectedPermisos(prev =>
      prev.includes(permisoId)
        ? prev.filter(id => id !== permisoId)
        : [...prev, permisoId]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.nombre.trim()) {
      setError('El nombre del rol es obligatorio')
      return
    }

    try {
      let result
      if (editing) {
        result = await updateRole(editing.id, form)
        await assignPermissionsToRole(editing.id, selectedPermisos)
        setSuccess('Rol actualizado correctamente')
      } else {
        result = await createRole(form)
        await assignPermissionsToRole(result.id, selectedPermisos)
        setSuccess('Rol creado correctamente')
      }

      setShowModal(false)
      fetchRoles()
    } catch (err) {
      console.error('Error al guardar rol:', err)
      setError(`Error: ${err.message}`)
    }
  }

  async function handleDelete(id, nombre, es_sistema) {
    if (es_sistema) {
      alert('No puedes eliminar roles del sistema')
      return
    }

    if (!confirm(`¿Eliminar rol "${nombre}"?`)) return

    try {
      await deleteRole(id)
      setSuccess('Rol eliminado correctamente')
      fetchRoles()
    } catch (err) {
      console.error('Error al eliminar rol:', err)
      setError(`Error al eliminar: ${err.message}`)
    }
  }

  if (role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-elevated p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Acceso restringido</h2>
          <p className="text-gray-600 mb-4">Necesitas rol administrador.</p>
            <Link 
            to="/admin/diagnostic" 
            className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Diagnosticar permisos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Gestión de Roles y Permisos
        </h1>
        <button 
          onClick={openNew} 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Nuevo Rol
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(r => (
            <div key={r.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className={`px-5 py-4 ${r.es_sistema ? 'bg-gradient-to-r from-indigo-100 to-purple-100' : 'bg-gray-50'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{r.nombre}</h3>
                    {r.es_sistema && (
                      <span className="text-xs font-semibold text-indigo-600">Sistema</span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{r.descripcion || 'Sin descripción'}</p>
              </div>

              <div className="px-5 py-4 border-t">
                <button 
                  onClick={() => openEdit(r)} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-semibold mb-2"
                >
                  Ver Detalles
                </button>
                {!r.es_sistema && (
                  <button 
                    onClick={() => handleDelete(r.id, r.nombre, r.es_sistema)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-sm font-semibold"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 max-h-[90vh] overflow-y-auto">
            
            {!isEditMode && editing ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold">{editing.nombre}</h2>
                    {editing.es_sistema && (
                      <p className="text-sm text-indigo-600 font-semibold">Rol del sistema</p>
                    )}
                  </div>
                  <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">X</button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-700">{editing.descripcion || 'Sin descripción'}</p>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold mb-4">Permisos Asignados</h3>
                  <div className="space-y-4">
                    {Object.entries(permisos).map(([categoria, items]) => (
                      <div key={categoria}>
                        <h4 className="font-semibold text-gray-700 mb-2 capitalize">{categoria}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-4">
                          {items.map(p => (
                            <div 
                              key={p.id}
                              className={`p-3 rounded-lg border ${
                                selectedPermisos.includes(p.id)
                                  ? 'bg-indigo-50 border-indigo-300'
                                  : 'bg-gray-50 border-gray-300'
                              }`}
                            >
                              <p className="font-semibold text-sm">{p.nombre}</p>
                              <p className="text-xs text-gray-600">{p.descripcion}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!editing.es_sistema && (
                  <div className="border-t pt-6 mt-6 flex gap-3">
                    <button 
                      type="button" 
                      onClick={enterEditMode} 
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                    >
                      Editar Rol
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)} 
                      className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                )}

                {editing.es_sistema && (
                  <div className="border-t pt-6 mt-6">
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)} 
                      className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-6">{editing ? 'Editar Rol' : 'Nuevo Rol'}</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Nombre del Rol *</label>
                    <input 
                      name="nombre" 
                      value={form.nombre} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="Ej: Moderador, Vendedor"
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Descripción</label>
                    <textarea 
                      name="descripcion" 
                      value={form.descripcion} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="Describe el propósito de este rol"
                      rows={3}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-bold mb-4">Asignar Permisos</h3>
                    <div className="space-y-4">
                      {Object.entries(permisos).map(([categoria, items]) => (
                        <div key={categoria} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-700 mb-3 capitalize">{categoria}</h4>
                          <div className="space-y-2">
                            {items.map(p => (
                              <label key={p.id} className="flex items-start gap-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                                <input 
                                  type="checkbox" 
                                  checked={selectedPermisos.includes(p.id)}
                                  onChange={() => togglePermiso(p.id)}
                                  className="mt-1 w-4 h-4 cursor-pointer"
                                />
                                <div>
                                  <p className="font-semibold text-sm text-gray-800">{p.nombre}</p>
                                  <p className="text-xs text-gray-600">{p.descripcion}</p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm font-semibold bg-red-50 p-4 rounded-lg border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="border-t pt-6 flex gap-3">
                    <button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                    >
                      Guardar Cambios
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)} 
                      className="flex-1 bg-gray-200 hover:bg-gray-300 py-3 rounded-lg font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
