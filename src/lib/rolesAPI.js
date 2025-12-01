import { supabase } from './supabase'

// ========== ROLES ==========

export async function getAllRoles() {
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('nombre', { ascending: true })
  
  if (error) throw error
  return data
}

export async function getRoleWithPermissions(roleId) {
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('*')
    .eq('id', roleId)
    .single()
  
  if (roleError) throw roleError
  
  const { data: permisos, error: permisosError } = await supabase
    .from('rol_permisos')
    .select('permiso_id')
    .eq('rol_id', roleId)
  
  if (permisosError) throw permisosError
  
  return {
    ...role,
    permiso_ids: permisos.map(p => p.permiso_id)
  }
}

export async function createRole(rol) {
  const { data, error } = await supabase
    .from('roles')
    .insert([{
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      es_sistema: false
    }])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function updateRole(id, rol) {
  const { data, error } = await supabase
    .from('roles')
    .update({
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function deleteRole(id) {
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// ========== PERMISOS ==========

export async function getAllPermisos() {
  const { data, error } = await supabase
    .from('permisos')
    .select('*')
    .order('categoria', { ascending: true })
    .order('nombre', { ascending: true })
  
  if (error) throw error
  return data
}

export async function getPermisosByCategoria() {
  const permisos = await getAllPermisos()
  
  const grouped = {}
  permisos.forEach(p => {
    if (!grouped[p.categoria]) {
      grouped[p.categoria] = []
    }
    grouped[p.categoria].push(p)
  })
  
  return grouped
}

// ========== ROL-PERMISOS ==========

export async function assignPermissionsToRole(roleId, permisoIds) {
  // Primero eliminar todos los permisos actuales del rol
  const { error: deleteError } = await supabase
    .from('rol_permisos')
    .delete()
    .eq('rol_id', roleId)
  
  if (deleteError) throw deleteError
  
  // Luego insertar los nuevos
  if (permisoIds.length === 0) return
  
  const { error: insertError } = await supabase
    .from('rol_permisos')
    .insert(
      permisoIds.map(permisoId => ({
        rol_id: roleId,
        permiso_id: permisoId
      }))
    )
  
  if (insertError) throw insertError
}

export async function getRolPermisosGrouped(roleId) {
  const { data, error } = await supabase
    .from('rol_permisos')
    .select(`
      permiso_id,
      permisos (
        id,
        nombre,
        descripcion,
        categoria
      )
    `)
    .eq('rol_id', roleId)
  
  if (error) throw error
  
  const grouped = {}
  data.forEach(rp => {
    const p = rp.permisos
    if (!grouped[p.categoria]) {
      grouped[p.categoria] = []
    }
    grouped[p.categoria].push(p)
  })
  
  return grouped
}
