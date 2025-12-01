import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Simple Auth context to expose session, user, role and helpers
const AuthContext = createContext({
  session: null,
  user: null,
  role: 'guest',
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('guest')
  const [loading, setLoading] = useState(true)

  // Load current session
  useEffect(() => {
    let mounted = true
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchRole(session.user.id)
      } else {
        setLoading(false)
      }
    }
    init()
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      if (newSession?.user) {
        fetchRole(newSession.user.id)
      } else {
        setRole('guest')
      }
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  async function fetchRole(userId) {
    // Profiles table expected: id uuid PK references auth.users, role text default 'user'
    console.log('Cargando rol para usuario:', userId)
    
    // Primero intentar buscar por ID
    let { data, error } = await supabase
      .from('profiles')
      .select('role, nombre, apellidos, requested_role, email, id')
      .eq('id', userId)
      .single()
    
    // Si no encuentra por ID, buscar por email
    if (error && error.code === 'PGRST116') {
      console.log('No perfil encontrado por ID, buscando por email...')
      const userEmail = user?.email
      if (userEmail) {
        const { data: profileByEmail, error: emailError } = await supabase
          .from('profiles')
          .select('role, nombre, apellidos, requested_role, email, id')
          .eq('email', userEmail)
          .single()
        
        if (!emailError && profileByEmail) {
          console.log('Perfil encontrado por email, sincronizando datos...')
          
          // Si encontró por email, hacer una superposición (overwrite) de los datos
          // Copiar los datos del usuario autenticado al perfil encontrado
          try {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                id: userId,  // Usar el ID correcto del usuario autenticado
                email: userEmail,
                role: profileByEmail.role || 'user',
                nombre: profileByEmail.nombre || null,
                apellidos: profileByEmail.apellidos || null,
                requested_role: profileByEmail.requested_role || 'user',
                updated_at: new Date().toISOString()
              })
              .eq('email', userEmail)
            
            if (updateError) {
              console.error('Error al sincronizar perfil:', updateError)
            } else {
              console.log('Datos sincronizados correctamente')
            }
          } catch (e) {
            console.error('Error en sincronización:', e)
          }
          
          data = profileByEmail
          error = null
        }
      }
    }
    
    if (error) {
      console.error('Error al cargar perfil:', error.message, error.code)
      console.warn('No profile found or RLS blocked, defaulting to user')
      setRole('user')
      setLoading(false)
    } else {
      const roleFromDB = data?.role || 'user'
      console.log('Profile loaded:', { 
        userId: userId.substring(0, 8) + '...', 
        role: roleFromDB, 
        requested: data?.requested_role,
        nombre: data?.nombre 
      })
      setRole(roleFromDB)
      setLoading(false)
    }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signUp({ email, password, nombre, apellidos, pais, ciudad, telefono }) {
    // Paso 1: Crear usuario en auth.users
    console.log('Paso 1: Registrando usuario en auth.users con email:', email?.trim())
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    
    if (!data.user?.id) {
      throw new Error('No se pudo obtener el ID del usuario después del registro')
    }
    
    const userId = data.user.id
    console.log('Usuario creado en auth.users con ID:', userId.substring(0, 8) + '...')

    // Paso 2: Preparar payload del perfil
    const safeRole = 'user' // Siempre se crea con rol usuario
    const profilePayload = {
      id: userId,
      email: email?.trim() || null,
      role: safeRole,
      nombre: nombre?.trim() || null,
      apellidos: apellidos?.trim() || null,
      pais: pais?.trim() || null,
      ciudad: ciudad?.trim() || null,
      telefono: telefono?.toString()?.trim() || null,
      requested_role: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('Paso 2: Payload a insertar:', {
      id: profilePayload.id.substring(0, 8) + '...',
      email: profilePayload.email,
      nombre: profilePayload.nombre,
      apellidos: profilePayload.apellidos,
      pais: profilePayload.pais,
      ciudad: profilePayload.ciudad,
      telefono: profilePayload.telefono,
      role: profilePayload.role
    })
    
    // Paso 3: Insertar perfil en la tabla profiles USANDO RPC
    try {
      console.log('🚀 Paso 3: Llamando función RPC create_profile_on_signup...')
      
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('create_profile_on_signup', {
          user_id: userId,
          user_email: email?.trim() || null,
          user_nombre: nombre?.trim() || null,
          user_apellidos: apellidos?.trim() || null,
          user_pais: pais?.trim() || null,
          user_ciudad: ciudad?.trim() || null,
          user_telefono: telefono?.toString()?.trim() || null
        })
      
      if (rpcError) {
        console.error('RPC falló:', rpcError.code, rpcError.message)
        throw new Error(`Error al guardar perfil (RPC): ${rpcError.message}`)
      }
      
      if (rpcResult?.success) {
        console.log('Perfil creado exitosamente con RPC:', rpcResult)
      } else {
        console.error('RPC retornó error:', rpcResult)
        throw new Error(`Error en RPC: ${rpcResult?.message || 'Error desconocido'}`)
      }
    } catch (e) {
      console.error('Error crítico al crear perfil:', e.message)
      console.error('Stack:', e.stack)
      throw e
    }
    
    console.log('Registro completado: usuario y perfil creados exitosamente')
    return data
  }

  async function signOut() {
    await supabase.auth.signOut()
    setRole('guest')
  }

  const value = { session, user, role, loading, signIn, signUp, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
