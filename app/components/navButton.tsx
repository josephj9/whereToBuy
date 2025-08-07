// components/NavButton.tsx
import Link from 'next/link';

export default function NavButton() {
  return (
    <Link href="/products">
      <button>Go to Products</button>
    </Link>
  );
}