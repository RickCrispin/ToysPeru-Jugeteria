import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'

const Body = ({ search = '' }) => {
    const [searchParams] = useSearchParams()
    const [productos, setProductos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showFilters, setShowFilters] = useState(false)
    
    // Obtener filtros iniciales desde URL
    const getInitialFilters = () => {
        return {
            categoria: searchParams.get('categoria') || 'todos',
            marca: searchParams.get('marca') || 'todos',
            precioMin: parseInt(searchParams.get('precioMin')) || 0,
            precioMax: parseInt(searchParams.get('precioMax')) || 1000,
            edadMinima: searchParams.get('edadMinima') || 'todas',
            material: searchParams.get('material') || 'todos',
            stock: searchParams.get('stock') || 'todos',
            destacado: searchParams.get('destacado') || 'todos',
            novedad: searchParams.get('novedad') || 'todos'
        }
    }
    
    // Filtros avanzados
    const [filters, setFilters] = useState(getInitialFilters())
    
    // Opciones para filtros
    const [categories, setCategories] = useState([])
    const [marcas, setMarcas] = useState([])
    const [materiales, setMateriales] = useState([])
    const [edades, setEdades] = useState([])
    const [maxPrecio, setMaxPrecio] = useState(1000)

    // Función para cargar productos
    const fetchProductos = async () => {
        try {
            console.log('Cargando productos desde Supabase...')
            
            if (!supabase) {
                throw new Error('Supabase no está configurado. Verifica tu archivo .env')
            }

            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error de Supabase:', error)
                throw new Error(`Error de base de datos: ${error.message}`)
            }
            
            console.log('Productos cargados desde Supabase:', data?.length || 0, 'productos')
            console.log('Datos recibidos:', data)
            
            setProductos(data || [])
            
            // Extraer filtros únicos
            const uniqueCategories = [...new Set(data?.map(p => p.categoria).filter(Boolean) || [])]
            const uniqueMarcas = [...new Set(data?.map(p => p.marca).filter(Boolean) || [])]
            const uniqueMateriales = [...new Set(data?.map(p => p.material).filter(Boolean) || [])]
            const uniqueEdades = [...new Set(data?.map(p => p.edad_minima).filter(Boolean) || [])]
            const precioMaximo = Math.max(...(data?.map(p => parseFloat(p.precio) || 0) || [0]))
            
            setCategories(uniqueCategories.sort())
            setMarcas(uniqueMarcas.sort())
            setMateriales(uniqueMateriales.sort())
            setEdades(uniqueEdades.sort((a, b) => a - b))
            setMaxPrecio(Math.ceil(precioMaximo))
            
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
        
        const matchesCategory = filters.categoria === 'todos' || p.categoria === filters.categoria
        const matchesMarca = filters.marca === 'todos' || p.marca === filters.marca
        const matchesPrecio = parseFloat(p.precio) >= filters.precioMin && parseFloat(p.precio) <= filters.precioMax
        const matchesEdad = filters.edadMinima === 'todas' || p.edad_minima === parseInt(filters.edadMinima)
        const matchesMaterial = filters.material === 'todos' || p.material === filters.material
        const matchesStock = filters.stock === 'todos' || 
            (filters.stock === 'disponible' && p.stock > 0) ||
            (filters.stock === 'agotado' && p.stock === 0)
        const matchesDestacado = filters.destacado === 'todos' || 
            (filters.destacado === 'si' && p.es_destacado) ||
            (filters.destacado === 'no' && !p.es_destacado)
        const matchesNovedad = filters.novedad === 'todos' || 
            (filters.novedad === 'si' && p.es_novedad) ||
            (filters.novedad === 'no' && !p.es_novedad)
        
        return matchesSearch && matchesCategory && matchesMarca && matchesPrecio && 
               matchesEdad && matchesMaterial && matchesStock && matchesDestacado && matchesNovedad
    })

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Productos</h2>

            {/* Botón para desplegar filtros avanzados */}
            {productos.length > 0 && (
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="mb-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                    {showFilters ? '▼ Ocultar Filtros' : '▶ Filtros Avanzados'}
                    <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{filtered.length} resultados</span>
                </button>
            )}

            {/* Panel de filtros avanzados - Modal Desplegable */}
            {productos.length > 0 && showFilters && (
                <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Filtros Avanzados</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Categoría */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                            <select 
                                value={filters.categoria} 
                                onChange={(e) => setFilters({...filters, categoria: e.target.value})}
                                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                            >
                                <option value="todos">Todas las categorías</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Marca */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Marca</label>
                            <select 
                                value={filters.marca} 
                                onChange={(e) => setFilters({...filters, marca: e.target.value})}
                                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                            >
                                <option value="todos">Todas las marcas</option>
                                {marcas.map(marca => (
                                    <option key={marca} value={marca}>{marca}</option>
                                ))}
                            </select>
                        </div>

                        {/* Material */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Material</label>
                            <select 
                                value={filters.material} 
                                onChange={(e) => setFilters({...filters, material: e.target.value})}
                                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                            >
                                <option value="todos">Todos los materiales</option>
                                {materiales.map(mat => (
                                    <option key={mat} value={mat}>{mat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Edad Mínima */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Edad Mínima</label>
                            <select 
                                value={filters.edadMinima} 
                                onChange={(e) => setFilters({...filters, edadMinima: e.target.value})}
                                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                            >
                                <option value="todas">Todas las edades</option>
                                {edades.map(edad => (
                                    <option key={edad} value={edad}>{edad}+ años</option>
                                ))}
                            </select>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Disponibilidad</label>
                            <select 
                                value={filters.stock} 
                                onChange={(e) => setFilters({...filters, stock: e.target.value})}
                                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                            >
                                <option value="todos">Todos</option>
                                <option value="disponible">Con stock</option>
                                <option value="agotado">Agotado</option>
                            </select>
                        </div>

                        {/* Destacado */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Destacados</label>
                            <select 
                                value={filters.destacado} 
                                onChange={(e) => setFilters({...filters, destacado: e.target.value})}
                                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                            >
                                <option value="todos">Mostrar todos</option>
                                <option value="si">Solo destacados</option>
                                <option value="no">Sin destacados</option>
                            </select>
                        </div>

                        {/* Novedad */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Novedades</label>
                            <select 
                                value={filters.novedad} 
                                onChange={(e) => setFilters({...filters, novedad: e.target.value})}
                                className="w-full px-4 py-2 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                            >
                                <option value="todos">Mostrar todos</option>
                                <option value="si">Solo novedades</option>
                                <option value="no">Sin novedades</option>
                            </select>
                        </div>

                        {/* Rango de Precio */}
                        <div className="lg:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Rango de Precio: S/. {filters.precioMin} - S/. {filters.precioMax}
                            </label>
                            <div className="flex gap-4 items-center">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max={maxPrecio}
                                    value={filters.precioMin}
                                    onChange={(e) => setFilters({...filters, precioMin: parseInt(e.target.value)})}
                                    className="flex-1 h-2 bg-indigo-300 rounded-lg appearance-none cursor-pointer"
                                />
                                <input 
                                    type="range" 
                                    min="0" 
                                    max={maxPrecio}
                                    value={filters.precioMax}
                                    onChange={(e) => setFilters({...filters, precioMax: parseInt(e.target.value)})}
                                    className="flex-1 h-2 bg-purple-300 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botón para limpiar filtros */}
                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={() => setFilters({
                                categoria: 'todos',
                                marca: 'todos',
                                precioMin: 0,
                                precioMax: maxPrecio,
                                edadMinima: 'todas',
                                material: 'todos',
                                stock: 'todos',
                                destacado: 'todos',
                                novedad: 'todos'
                            })}
                            className="px-4 py-2 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                        >
                            Limpiar Filtros
                        </button>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all ml-auto"
                        >
                            Aplicar Filtros
                        </button>
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
                <p className="text-center text-gray-500 text-lg py-8">No se encontraron productos con los filtros seleccionados.</p>
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
