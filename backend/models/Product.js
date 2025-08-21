const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String },
  inStock: { type: Boolean, default: true },
  image: { type: String } // this must exist for images to work
});

module.exports = mongoose.model('Product', productSchema);
