import React, { createContext, useContext, useState } from 'react'

const SearchContext = createContext({
    selectedProduct: null,
    setSelectedProduct: () => {},
})

export function SearchProvider({ children }) {
    const [selectedProduct, setSelectedProduct] = useState(null)

    return (
        <SearchContext.Provider value={{ selectedProduct, setSelectedProduct }}>
            {children}
        </SearchContext.Provider>
    )
}

export function useSearch() {
    return useContext(SearchContext)
}
