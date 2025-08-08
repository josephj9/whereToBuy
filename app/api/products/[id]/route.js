// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Product from '@/app/models/Product';

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = params; 

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
