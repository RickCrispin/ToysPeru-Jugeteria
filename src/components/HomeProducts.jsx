import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'

export default function HomeProducts() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data, error } = await supabase
          .from('productos')
          .select('id, nombre, precio, imagen_url, descripcion, stock, es_destacado, categoria, marca')
          .order('stock', { ascending: false })
          .limit(6)

        if (error) throw error

        setProductos(data || [])
        setError(null)
      } catch (err) {
        console.error('Error al cargar productos:', err)
        setError(err.message)
        setProductos([])
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos destacados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Error al cargar productos: {error}</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Productos Destacados</h2>
      {productos.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No hay productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
