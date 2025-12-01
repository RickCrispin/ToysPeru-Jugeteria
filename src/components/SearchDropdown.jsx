import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const USD_TO_PEN = 3.80
const convertToPen = (priceInUsd) => (Number.parseFloat(priceInUsd ?? 0) * USD_TO_PEN).toFixed(2)

export default function SearchDropdown({ searchTerm, onSelectProduct, onDetailClose }) {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([])
            return
        }

        async function fetchResults() {
            setLoading(true)
            setError(null)
            try {
                if (!supabase) {
                    console.error('Supabase no está inicializado')
                    setError('Supabase no configurado')
                    setLoading(false)
                    return
                }

                const { data, error } = await supabase
                    .from('productos')
                    .select('id, nombre, precio, imagen_url, descripcion, stock, categoria')
                    .or(
                        `nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%,categoria.ilike.%${searchTerm}%,marca.ilike.%${searchTerm}%`
                    )
                    .limit(8)

                if (error) {
                    console.error('Error en búsqueda:', error)
                    setError(error.message)
                    setResults([])
                } else {
                    setResults(data || [])
                }
            } catch (err) {
                console.error('Error capturado:', err)
                setError(err.message)
                setResults([])
            } finally {
                setLoading(false)
            }
        }

        // Debounce: esperar 300ms después de que deje de escribir
        const timer = setTimeout(fetchResults, 300)
        return () => clearTimeout(timer)
    }, [searchTerm])

    function handleProductClick(product) {
        onSelectProduct?.(product)
    }

    if (!searchTerm.trim()) {
        return null
    }

    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto border border-gray-200">
            {error && (
                <div className="p-4 text-center text-red-500">
                    Error: {error}
                </div>
            )}

            {loading && !error && (
                <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full mr-2"></div>
                    Buscando...
                </div>
            )}

            {!loading && !error && results.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                    No se encontraron productos
                </div>
            )}

            {!loading && !error && results.length > 0 && (
                <div className="divide-y">
                    {results.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="w-full text-left p-3 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                        >
                            {/* Imagen */}
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0 overflow-hidden flex items-center justify-center group-hover:shadow-md transition-shadow">
                                {product.imagen_url ? (
                                    <img 
                                        src={product.imagen_url} 
                                        alt={product.nombre}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-lg">Categoría</span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 truncate group-hover:text-indigo-600">
                                    {product.nombre}
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-500 truncate">
                                        {product.categoria || 'Sin categoría'}
                                    </p>
                                    <p className="text-indigo-600 font-bold text-sm ml-2">
                                        S/ {convertToPen(product.precio)}
                                    </p>
                                </div>
                                {product.stock <= 0 && (
                                    <p className="text-xs text-red-600 font-semibold">Sin stock</p>
                                )}
                            </div>

                            {/* Arrow */}
                            <span className="text-gray-400 group-hover:text-indigo-600 transition-colors">→</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
