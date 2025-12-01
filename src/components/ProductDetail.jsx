import React, { useState } from 'react'
import { addToCart } from '../lib/cart'

export default function ProductDetail({ product, onClose }) {
    const [qty, setQty] = useState(1)
    const [added, setAdded] = useState(false)

    function handleIncrease() {
        const maxQty = product.stock ?? 0
        if (qty < maxQty) {
            setQty(q => q + 1)
        }
    }

    function handleDecrease() {
        if (qty > 1) setQty(q => q - 1)
    }

    function handleAddToCart() {
        for (let i = 0; i < qty; i++) {
            addToCart(product)
        }
        setAdded(true)
        setTimeout(() => {
            setAdded(false)
            onClose?.()
        }, 1500)
    }

    const unit = Number.parseFloat(product.precio ?? product.price ?? 0)
    const total = (unit * qty).toFixed(2)

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-gray-800">{product.nombre || product.name}</h2>
                    <button onClick={onClose} className="text-3xl font-bold text-gray-500 hover:text-gray-700">
                        X
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Producto */}
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 max-h-96 rounded-lg flex items-center justify-center overflow-hidden">
                        {(product.img || product.imagen_url) ? (
                            <img src={product.img || product.imagen_url} alt={product.nombre || product.name} className="h-auto w-full object-contain rounded-lg" />
                        ) : (
                            <span className="text-gray-400">Producto</span>
                        )}
                    </div>

                    {/* Categoría */}
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-gray-600 mb-1">Categoría</p>
                        <p className="text-lg font-bold text-blue-700">
                            {product.categoria ? product.categoria : 'Sin categoría'}
                        </p>
                    </div>

                    {/* Tags */}
                    {(product.es_destacado || product.es_novedad) && (
                        <div className="flex flex-wrap gap-2">
                            {product.es_destacado && (
                                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full border border-yellow-300">Destacado</span>
                            )}
                            {product.es_novedad && (
                                <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full border border-red-300">Novedad</span>
                            )}
                        </div>
                    )}

                    {/* Atributos del Producto */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {product.marca && (
                            <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Marca</p>
                                <p className="text-sm font-bold text-purple-700">{product.marca}</p>
                            </div>
                        )}
                        {product.material && (
                            <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Material</p>
                                <p className="text-sm font-bold text-orange-700">{product.material}</p>
                            </div>
                        )}
                        {product.edad_minima && (
                            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Edad Mínima</p>
                                <p className="text-sm font-bold text-green-700">{product.edad_minima} años</p>
                            </div>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h3>
                        <p className="text-gray-700">
                            {product.descripcion || 'Este es un juguete de alta calidad diseñado para niños de todas las edades. Cumple con los estándares de seguridad internacionales y proporciona diversión sin fin.'}
                        </p>
                    </div>

                    {/* Precio y Stock */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800">Precio unitario:</span>
                            <span className="text-3xl font-bold text-indigo-600">${unit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-indigo-200">
                            <span className="text-lg font-semibold text-gray-800">Stock disponible:</span>
                            <span className={`text-2xl font-bold ${(product.stock ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock ?? 0} unidades
                            </span>
                        </div>
                    </div>

                    {/* Cantidad */}
                    <div className="border-2 border-gray-300 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cantidad (máx: {product.stock ?? 0})</h3>
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={handleDecrease}
                                className="w-14 h-14 bg-red-500 text-white text-2xl font-bold rounded-lg hover:bg-red-600 transition-all"
                            >
                                -
                            </button>
                            <div className="text-4xl font-bold text-gray-800 min-w-[4rem] text-center">{qty}</div>
                            <button
                                onClick={handleIncrease}
                                disabled={qty >= (product.stock ?? 0)}
                                className={`w-14 h-14 text-white text-2xl font-bold rounded-lg transition-all ${
                                    qty >= (product.stock ?? 0) 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                                +
                            </button>
                        </div>
                        {(product.stock ?? 0) <= 0 && (
                            <p className="text-center text-red-600 font-semibold mt-3">Sin stock disponible</p>
                        )}
                    </div>

                    {/* Total */}
                    <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-semibold text-gray-800">Total:</span>
                            <span className="text-3xl font-bold text-indigo-600">${total}</span>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="space-y-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={(product.stock ?? 0) <= 0}
                            className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${added
                                    ? 'bg-green-500 text-white'
                                    : (product.stock ?? 0) <= 0
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                                }`}
                        >
                            {added ? 'Añadido al carrito' : (product.stock ?? 0) <= 0 ? 'Sin stock' : `Añadir ${qty} al carrito`}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-lg font-bold text-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
