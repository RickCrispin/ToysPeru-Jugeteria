import { supabase } from './supabase'

export const productosAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async create(producto) {
    const { data, error } = await supabase
      .from('productos')
      .insert([producto])
    return { data, error }
  },

  async update(id, producto) {
    const { data, error } = await supabase
      .from('productos')
      .update(producto)
      .eq('id', id)
    return { data, error }
  },

  async delete(id) {
    const { data, error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id)
    return { data, error }
  }
}
