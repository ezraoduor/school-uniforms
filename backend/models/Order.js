const mongoose = require('mongoose');


app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        console.log('New order saved:', order);

        // Send email notification
        await sendOrderEmail(order);

        res.json({ 
            success: true, 
            message: 'Order received successfully!',
            orderId: order._id
        });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(400).json({ error: error.message });
    }
});


const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    items: [{
        id: Number,
        name: String,
        price: Number,
        quantity: Number
    }],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);