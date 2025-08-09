import React, { Suspense } from "react"

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="text-center p-8 text-gray-500">Loading...</div>}>
      {children}
    </Suspense>
  )
}
