// server.js - Your backend server
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend')); // Serve your HTML file

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend server is working!' });
});

// Products route (temporary - we'll build this properly later)
app.get('/api/products', (req, res) => {
    // Sample data - later this will come from database
    const sampleProducts = [
        {
            id: 1,
            name: "Shirt-Short sleeved (Secondary) Plain(With badge)",
            price: 550,
            category: "Shirts",
            sizes: ["L", "M", "S"]
        },
        {
            id: 2,
            name: "Sweater Short-sleeved With badge",
            price: 950,
            category: "Sweaters",
            sizes: ["L", "M", "S"]
        },
        {
            id: 3,
            name: "Tunic (Light) Checked",
            price: 850,
            category: "Tunics",
            sizes: ["L", "M", "S"]
        }
    ];
    
    res.json(sampleProducts);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📱 Your website: http://localhost:${PORT}`);
    console.log(`🔧 API endpoint: http://localhost:${PORT}/api/test`);
});