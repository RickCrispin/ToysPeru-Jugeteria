import React, { useState } from 'react'

export default function Contact() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState(null)

    function validateEmail(e) {
        return /\S+@\S+\.\S+/.test(e)
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (!name.trim() || !email.trim() || !message.trim()) {
            setStatus({ ok: false, msg: 'Por favor complete todos los campos.' })
            return
        }
        if (!validateEmail(email)) {
            setStatus({ ok: false, msg: 'Ingrese un correo válido.' })
            return
        }

        try {
            const key = 'toy_store_contacts'
            const raw = localStorage.getItem(key)
            const list = raw ? JSON.parse(raw) : []
            list.push({ name, email, phone, message, createdAt: new Date().toISOString() })
            localStorage.setItem(key, JSON.stringify(list))
            setName('')
            setEmail('')
            setPhone('')
            setMessage('')
            setStatus({ ok: true, msg: 'Mensaje enviado. Gracias! Nos contactaremos pronto.' })
            setTimeout(() => setStatus(null), 5000)
        } catch (err) {
            setStatus({ ok: false, msg: 'Ocurrió un error, intente nuevamente.' })
        }
    }

    return (
        <section id="contacto" className="mt-12">
            {/* Encabezado */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4 text-gray-800">Contáctanos</h1>
                <p className="text-lg text-gray-700">Estamos aquí para ayudarte. ¿Tienes preguntas o sugerencias? No dudes en comunicarte con nosotros.</p>
            </div>

            {/* Grid de 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                {/* Formulario */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8 shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Envíanos un Mensaje</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                            <input
                                id="name"
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Tu nombre completo"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Teléfono (Opcional)</label>
                            <input
                                id="phone"
                                type="tel"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+51 999 999 999"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">Mensaje</label>
                            <textarea
                                id="message"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tu mensaje aquí..."
                            />
                        </div>

                        {status && (
                            <div className={`p-3 rounded-lg font-semibold ${
                                status.ok 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {status.msg}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
                        >
                            Enviar Mensaje
                        </button>
                    </form>
                </div>

                {/* Información de Contacto */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-indigo-600">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">📍</span> Ubicación
                        </h3>
                        <p className="text-gray-700">Toys Perú, Perú</p>
                        <p className="text-gray-600 text-sm mt-1">Disponible en todo el país con envío a domicilio</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-600">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">📞</span> Teléfono
                        </h3>
                        <p className="text-gray-700 font-semibold">+51 (1) 2345-6789</p>
                        <p className="text-gray-600 text-sm mt-1">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                        <p className="text-gray-600 text-sm">Sábados: 10:00 AM - 4:00 PM</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-pink-600">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">📧</span> Email
                        </h3>
                        <p className="text-gray-700 font-semibold">info@toysperú.com</p>
                        <p className="text-gray-700 font-semibold">soporte@toysperú.com</p>
                        <p className="text-gray-600 text-sm mt-1">Respuesta en máximo 24 horas</p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-yellow-600">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">⏰</span> Horario
                        </h3>
                        <ul className="text-gray-700 space-y-1 text-sm">
                            <li><strong>Lunes - Viernes:</strong> 9:00 AM - 6:00 PM</li>
                            <li><strong>Sábado:</strong> 10:00 AM - 4:00 PM</li>
                            <li><strong>Domingo:</strong> Cerrado</li>
                            <li><strong>Delivery 24/7:</strong> Disponible</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-600">
                        <h3 className="text-xl font-bold mb-2 text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">🔗</span> Redes Sociales
                        </h3>
                        <div className="flex gap-4">
                            <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold">Facebook</a>
                            <a href="#" className="text-pink-600 hover:text-pink-800 font-semibold">Instagram</a>
                            <a href="#" className="text-blue-400 hover:text-blue-600 font-semibold">Twitter</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Maps */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Encuentranos en el Mapa</h2>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden h-96">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.6522155047893!2d-77.03193!3d-12.04693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sPerú!2s!5e0!3m2!1ses!2spe!4v1701345600000"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación Toys Perú"
                        className="w-full h-full"
                    ></iframe>
                </div>
            </div>

            {/* Sección de Preguntas Frecuentes */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Preguntas Frecuentes</h2>
                <div className="space-y-4">
                    <details className="bg-white p-4 rounded-lg shadow-sm cursor-pointer">
                        <summary className="font-semibold text-gray-800 hover:text-indigo-600">¿Cuál es el tiempo de entrega?</summary>
                        <p className="text-gray-700 mt-3">Ofrecemos entregas en 24-48 horas en Lima y 3-5 días en provincias. También disponemos de servicio express.</p>
                    </details>

                    <details className="bg-white p-4 rounded-lg shadow-sm cursor-pointer">
                        <summary className="font-semibold text-gray-800 hover:text-indigo-600">¿Qué métodos de pago aceptan?</summary>
                        <p className="text-gray-700 mt-3">Aceptamos tarjeta de crédito/débito, transferencia bancaria, Yape, Plin y pago contra entrega.</p>
                    </details>

                    <details className="bg-white p-4 rounded-lg shadow-sm cursor-pointer">
                        <summary className="font-semibold text-gray-800 hover:text-indigo-600">¿Tienen política de devoluciones?</summary>
                        <p className="text-gray-700 mt-3">Sí, aceptamos devoluciones en 30 días desde la compra si el producto está sin usar y en condiciones originales.</p>
                    </details>

                    <details className="bg-white p-4 rounded-lg shadow-sm cursor-pointer">
                        <summary className="font-semibold text-gray-800 hover:text-indigo-600">¿Son todos los productos seguros para niños?</summary>
                        <p className="text-gray-700 mt-3">Todos nuestros productos cumplen con normas de seguridad internacional y están recomendados por edad.</p>
                    </details>

                    <details className="bg-white p-4 rounded-lg shadow-sm cursor-pointer">
                        <summary className="font-semibold text-gray-800 hover:text-indigo-600">¿Ofrecen garantía en los productos?</summary>
                        <p className="text-gray-700 mt-3">Sí, todos los productos tienen garantía de 1 año contra defectos de fabricación.</p>
                    </details>
                </div>
            </div>
        </section>
    )
}