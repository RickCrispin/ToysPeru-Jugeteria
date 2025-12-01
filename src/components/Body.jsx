import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'

const Body = ({ search = '' }) => {
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState('todos')
    const [categories, setCategories] = useState([])
    const [showCategoryFilter, setShowCategoryFilter] = useState(false)

    // Función para cargar productos
    const fetchProductos = async () => {
        try {
            console.log('Cargando productos desde Supabase...')
            
            if (!supabase) {
                throw new Error('Supabase no está configurado. Verifica tu archivo .env')
            }

            const { data, error } = await supabase
                .from('productos')
                .select('id, nombre, precio, imagen_url, descripcion, stock, es_destacado, categoria, marca')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error de Supabase:', error)
                throw new Error(`Error de base de datos: ${error.message}`)
            }
            
            console.log('Productos cargados desde Supabase:', data?.length || 0, 'productos')
            console.log('Datos recibidos:', data)
            
            setProductos(data || [])
            
            // Extraer categorías únicas
            const uniqueCategories = [...new Set(data?.map(p => p.categoria).filter(Boolean) || [])]
            setCategories(uniqueCategories.sort())
            
            setError(null)
        } catch (err) {
            console.error('Error al cargar productos:', err)
            setError(err.message)
            setProductos([])
        } finally {
            setLoading(false)
        }
    }

    // Carga inicial de productos
    useEffect(() => {
        fetchProductos()
    }, [])

    // Escuchar evento de refresco desde CartDrawer después de compra
    useEffect(() => {
        function handleRefreshProducts(event) {
            console.log('Evento refreshProducts recibido, recargando stock...')
            fetchProductos()
        }
        
        globalThis.addEventListener('refreshProducts', handleRefreshProducts)
        return () => globalThis.removeEventListener('refreshProducts', handleRefreshProducts)
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando productos desde Supabase...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h3 className="text-xl font-bold text-red-800 mb-2">Error de Conexión</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <div className="bg-white rounded p-4 text-left text-sm">
                        <p className="font-semibold mb-2">Pasos para solucionar:</p>
                        <ol className="list-decimal ml-5 space-y-1 text-gray-700">
                            <li>Verifica que ejecutaste el script SQL en Supabase</li>
                            <li>Confirma que el archivo <code className="bg-gray-100 px-1">.env</code> tiene las variables correctas</li>
                            <li>Reinicia el servidor de desarrollo (Ctrl+C y luego <code className="bg-gray-100 px-1">npm run dev</code>)</li>
                            <li>Revisa la consola del navegador (F12) para más detalles</li>
                        </ol>
                    </div>
                </div>
            </div>
        )
    }

    const filtered = productos.filter((p) => {
        const matchesSearch = !search || 
            (p.nombre && p.nombre.toLowerCase().includes(search.toLowerCase())) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase())) ||
            (p.categoria && p.categoria.toLowerCase().includes(search.toLowerCase())) ||
            (p.marca && p.marca.toLowerCase().includes(search.toLowerCase()))
        
        const matchesCategory = selectedCategory === 'todos' || p.categoria === selectedCategory
        
        return matchesSearch && matchesCategory
    })

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Productos</h2>

            {/* Botón para desplegar filtro de categorías */}
            {categories.length > 0 && (
                <button
                    onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                    className="mb-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                >
                    {showCategoryFilter ? 'Ocultar' : 'Filtrar'}
                </button>
            )}

            {/* Filtro de categorías (desplegable) */}
            {categories.length > 0 && showCategoryFilter && (
                <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Filtrar por categoría</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('todos')}
                            className={`px-4 py-2 rounded-full font-semibold transition-all ${
                                selectedCategory === 'todos'
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                            }`}
                        >
                            Todos ({productos.length})
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                                }`}
                            >
                                {cat} ({productos.filter(p => p.categoria === cat).length})
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {productos.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">No hay productos</h3>
                    <p className="text-yellow-600 mb-4">La tabla de productos está vacía en Supabase.</p>
                    <p className="text-sm text-gray-600">
                        Ejecuta el script <code className="bg-white px-2 py-1 rounded">supabase-setup.sql</code> para insertar productos de prueba.
                    </p>
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-center text-gray-500">No se encontraron productos para "{search}".</p>
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
