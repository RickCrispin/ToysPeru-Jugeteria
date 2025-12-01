import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Body from '../components/Body'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Productos</h1>
      <Body />
    </div>
  )
}
