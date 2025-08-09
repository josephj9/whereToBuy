"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react" // Using Lucide React for icons

export default function ReturnButton() {
  return (
    <Link href="/">
      <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" /> {/* Lucide React ArrowLeft icon */}
        Return To Home
      </button>
    </Link>
  )
}
