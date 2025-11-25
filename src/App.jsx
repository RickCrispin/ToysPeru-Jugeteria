import { useState } from 'react'
import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'
import Contact from './components/Contact'
import CartDrawer from './components/CartDrawer'

function App() {
    const [search, setSearch] = useState('')
    const [isCartOpen, setIsCartOpen] = useState(false)

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-purple-50">
            <Header onCartClick={() => setIsCartOpen(true)} onSearch={setSearch} />

            <main className="flex-1 space-y-12 pb-8">
                <section id="nosotros" className="container mx-auto px-4 pt-8">
                    <div className="bg-white rounded-2xl shadow-elevated p-8 animate-fade-in">
                        <h2 className="text-3xl font-bold mb-3 text-gray-800">Nosotros</h2>
                        <p className="text-gray-700 leading-relaxed">
                            En <span className="font-semibold">Juguetería Alegre</span> creemos que cada juguete cuenta una historia.
                            Ofrecemos productos seleccionados con cariño para inspirar la creatividad, el aprendizaje y la diversión
                            segura de los más pequeños.
                        </p>
                    </div>
                </section>

                <section id="productos" className="container mx-auto px-4">
                    <Body search={search} />
                </section>

                <section className="container mx-auto px-4">
                    <Contact />
                </section>
            </main>

            <Footer />

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
    )
}

export default App