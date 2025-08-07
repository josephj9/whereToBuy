// app/products/page.tsx
'use client'

type Product = {
  _id: string;
  name: string;
  category: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="text-white p-4">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <ul className="space-y-2">
        {products.map((product, index) => (
          <li key={index} className="bg-gray-800 p-4 rounded">
          {product.description} 
          <button>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
