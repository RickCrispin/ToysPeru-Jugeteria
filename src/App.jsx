import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import FloatingCartButton from './components/FloatingCartButton'
import ProductDetail from './components/ProductDetail'
import HomePage from './pages/Home'
import ProductsPage from './pages/Products'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/Login'
import AdminProductsPage from './pages/AdminProducts'
import AdminDiagnosticPage from './pages/AdminDiagnostic'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminSales from './pages/AdminSales'
import AccountPage from './pages/Account'
import OrdersPage from './pages/Orders'
import SettingsPage from './pages/Settings'
import { AuthProvider } from './context/AuthContext'

function App() {
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    let scrollTimeout

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
            setIsScrolling(true)
            
            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false)
            }, 150)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-purple-50">
                    <Header onCartClick={() => setIsCartOpen(true)} onSelectProduct={setSelectedProduct} />
                    <main className="flex-1 pb-8">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/productos" element={<ProductsPage />} />
                            <Route path="/contacto" element={<ContactPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/account" element={<AccountPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<AdminUsers />} />
                            <Route path="/admin/products" element={<AdminProductsPage />} />
                            <Route path="/admin/sales" element={<AdminSales />} />
                            <Route path="/admin/diagnostic" element={<AdminDiagnosticPage />} />
                        </Routes>
                    </main>
                    <Footer />
                    
                    {/* Botón Flotante del Carrito */}
                    <FloatingCartButton 
                        scrollY={scrollY} 
                        isScrolling={isScrolling}
                        isCartOpen={isCartOpen}
                        onCartClick={() => setIsCartOpen(true)}
                    />
                    
                    <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                    
                    {selectedProduct && (
                        <ProductDetail 
                            product={selectedProduct}
                            onClose={() => setSelectedProduct(null)}
                        />
                    )}
                </div>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App