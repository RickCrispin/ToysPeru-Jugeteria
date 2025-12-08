import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Solo mostrar logs detallados en desarrollo
if (import.meta.env.DEV) {
    console.log('Configuración Supabase:', {
        url: supabaseUrl ? '✓ Configurado' : '✗ Faltante',
        key: supabaseKey ? '✓ Configurado' : '✗ Faltante'
    })
}

if (!supabaseUrl || !supabaseKey) {
    const errorMsg = 'Faltan variables de entorno de Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY)'
    console.error(errorMsg)
    
    if (import.meta.env.DEV) {
        console.error('Asegúrate de definir las variables en un archivo .env y reiniciar el servidor')
    } else {
        console.error('Verifica la configuración de variables de entorno en Vercel')
    }
    
    throw new Error(errorMsg)
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    }
})