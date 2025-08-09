import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongodb'
import Product from '@/app/models/Product'

export async function GET(request) {
    await connectDB();
      try {
        const items = await Product.find({});
        return NextResponse.json({ success: true, data: items}, { status: 200 });
      } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
      }
}


