const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Nodemailer transporter (shared for orders & contact form)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// Send order email
async function sendOrderEmail(order) {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.NOTIFY_EMAIL,
            subject: `New Order from ${order.customerName}`,
            text: `
New order received!

Customer: ${order.customerName}
Phone: ${order.phone}
Email: ${order.email || 'N/A'}
School: ${order.school || 'N/A'}
Address: ${order.address || 'N/A'}
Notes: ${order.notes || 'N/A'}

Items:
${order.items.map(item => `- ${item.name} x ${item.quantity}`).join('\n')}

Total: KSH ${order.total}
Order Date: ${order.createdAt}
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Order email sent!');
    } catch (error) {
        console.error('❌ Failed to send order email:', error);
    }
}

// Send contact inquiry email
async function sendContactEmail(contact) {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: process.env.NOTIFY_EMAIL,
            subject: `New Inquiry from ${contact.name}`,
            text: `
New contact form submission:

Name: ${contact.name}
Phone: ${contact.phone}
Email: ${contact.email || 'N/A'}
Uniform Type: ${contact.uniformType || 'N/A'}
Message: ${contact.message || 'N/A'}

Submitted At: ${new Date().toLocaleString()}
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Contact form email sent!');
    } catch (error) {
        console.error('❌ Failed to send contact form email:', error);
    }
}

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Siaya School Uniforms API is running!' });
});

// Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Orders
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        console.log('New order saved:', order);

        // Send order email
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

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Contact form
app.post('/api/contact', async (req, res) => {
    try {
        console.log('New contact submission:', req.body);

        // Send contact email
        await sendContactEmail(req.body);

        res.json({ 
            success: true, 
            message: 'Thank you for your inquiry! We will contact you soon.' 
        });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send your message. Please try again.' 
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
