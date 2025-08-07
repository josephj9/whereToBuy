import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // adds createdAt, updatedAt

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
