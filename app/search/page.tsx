"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ReturnButton from "@/app/components/returnButton"

interface Product {
  position?: number
  title: string
  product_link: string
  source: string
  price: string
  extracted_price?: number
  old_price?: string
  extracted_old_price?: number
  rating?: number
  reviews?: number
  snippet?: string
  thumbnail: string
  tag?: string
  delivery?: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const displayName = searchParams.get("display_name")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true) // Loading state managed within this component

  useEffect(() => {
    if (!displayName) {
      setIsLoading(false)
      return
    }
    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/buy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ display_name: displayName }),
        })
        if (!res.ok) throw new Error(`Error: ${res.status}`)
        const json = await res.json()
        setProducts(json.shopping_results || [])
      } catch (error) {
        console.error("Failed to fetch:", error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchResults()
  }, [displayName])

return (
    <div className="min-h-screen bg-darkBackground text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <ReturnButton /> {/* Using your ReturnButton component */}
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-gradientPink via-gradientGreen to-gradientBlue text-transparent bg-clip-text flex-grow">
            Search Results for "{displayName}"
          </h1>
          {/* Placeholder to balance the header if needed, or remove if not */}
          <div className="w-[150px]"></div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-400 text-lg">Loading products...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <a
                key={index}
                href={product.product_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cardBackground rounded-lg p-4 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 flex flex-col items-center text-center"
              >
                <img
                  src={product.thumbnail || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-48 object-contain rounded mb-4"
                />
                <h2 className="mt-2 font-semibold text-lg text-white line-clamp-2">{product.title}</h2>
                <p className="text-gradientGreen font-bold text-xl mt-2">{product.price}</p>
                <p className="text-gray-400 text-sm mt-1">{product.source}</p>
                {product.rating && (
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <span className="mr-1">{product.rating}</span>
                    <svg
                      className="w-4 h-4 fill-current text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 18.896l-7.416 3.817 1.48-8.279L.001 9.306l8.332-1.151L12 .587z" />
                    </svg>
                    {product.reviews && <span className="ml-1">({product.reviews})</span>}
                  </div>
                )}
                {product.delivery && <p className="text-gray-300 text-xs mt-1">{product.delivery}</p>}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg">No products found for "{displayName}".</p>
        )}
      </div>
    </div>
  )
}
