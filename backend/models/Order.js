const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    school: { type: String },
    address: { type: String },
    notes: { type: String },
    items: [{
        id: Number,
        name: String,
        price: Number,
        quantity: Number
    }],
    subtotal: { type: Number },
    deliveryFee: { type: Number },
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
