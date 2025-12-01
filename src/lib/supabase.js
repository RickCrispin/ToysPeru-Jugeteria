import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Configuración Supabase:', {
  url: supabaseUrl ? '✓ Configurado' : '✗ Faltante',
  key: supabaseKey ? '✓ Configurado' : '✗ Faltante'
})

if (!supabaseUrl || !supabaseKey) {
    console.error('Faltan variables de entorno de Supabase.')
    console.error('Asegúrate de definir VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en un archivo .env')
    console.error('Luego reinicia el servidor de desarrollo (npm run dev)')
}

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null

if (!supabase) {
  console.error('Cliente de Supabase NO inicializado. Verifica tu archivo .env')
}