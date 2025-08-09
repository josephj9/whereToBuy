"use client";
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SearchButtonProps = {
  displayName?: string;
};

export default function SearchButton({ displayName }: SearchButtonProps) {
  const router = useRouter();

  const handleSearch = () => {
    if (!displayName) return alert("No product name found");
    router.push(`/search?display_name=${encodeURIComponent(displayName)}`);
  };

  return (
    <button
      onClick={handleSearch}
      className="bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3 focus:outline-none focus:ring-4 focus:ring-emerald-300"
    >
      <Search className="w-5 h-5" />
      Find Where To Buy
    </button>
  );
}
