import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Faltan variables de entorno de Supabase.')
    console.error('Asegúrate de definir VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en un archivo .env')
}

// Si faltan, igual creamos un cliente falso para que el import no rompa,
// pero tus consultas fallarán con error controlado.
export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : { from: () => ({ select: async () => ({ data: null, error: new Error('Supabase no está configurado') }) }) }