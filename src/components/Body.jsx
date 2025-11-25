import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'

const Body = ({ search = '' }) => {
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProductos = async () => {
            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .eq('es_destacado', true) // o quita esto si quieres todos

            if (error) {
                console.error('Error cargando juguetes:', error)
            } else {
                setProductos(data || [])
            }
            setLoading(false)
        }

        fetchProductos()
    }, [])

    if (loading) return <p className="text-center mt-10">Cargando juguetes...</p>

    const filtered = productos.filter((p) => {
        if (!search) return true
        const term = search.toLowerCase()
        return (
            (p.name && p.name.toLowerCase().includes(term)) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(term))
        )
    })

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Productos Destacados</h2>

            {filtered.length === 0 ? (
                <p className="text-center text-gray-500">No se encontraron productos para “{search}”.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filtered.map((producto) => (
                        <ProductCard key={producto.id} product={producto} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Body