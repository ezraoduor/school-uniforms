const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config() 

 const products = [
    { id: 1, name: "Badge", price: 60, category: "school", description: "Size: All", inStock: true, image: "images/badge.jpg" },
    { id: 2, name: "Bedcover", price: 650, category: "school", description: "Size: School-size", inStock: true, image: "images/bedcover.jpg" },
    { id: 3, name: "Bedsheet", price: 600, category: "school", description: "Size: School-size", inStock: true, image: "images/bedsheet.jpg" },
    { id: 4, name: "Blanket", price: 650, category: "school", description: "Size: Light", inStock: true, image: "images/blanket.jpg" },
    { id: 5, name: "Blanket", price: 850, category: "school", description: "Size: Heavy", inStock: true, image: "images/blanket.jpg" },
    { id: 6, name: "Blazer", price: 1500, category: "secondary", description: "Size: All (Secondary schools) without lining", inStock: true, image: "images/blazer.jpg" },
    { id: 7, name: "Blazer", price: 2100, category: "secondary", description: "Size: All (Secondary schools) with lining", inStock: true, image: "images/blazer.jpg" },
    { id: 8, name: "Fleece Jacket/Jumper", price: 2400, category: "secondary ", description: "Size: Secondary (with logo)", inStock: true, image: "images/fleece-jacket.jpg" },
    { id: 9, name: "Fleece Jacket", price: 2100, category: "school", description: "Size: 36-40", inStock: true, image: "images/download (1).jpeg" },
    { id: 10, name: "Fleece Jacket", price: 2000, category: "school", description: "Size: 30-34", inStock: true, image: "images/download.jpeg" },
    { id: 11, name: "Fleece Jacket", price: 1850, category: "school", description: "Size: 24-28", inStock: true, image: "images/images.jpeg" },
    { id: 12, name: "Shirt-short-sleeved (Secondary)", price: 500, category: "secondary", description: "Size: Plain (Without badge)", inStock: true, image: "images/shirt-secondary-plain.jpg"  },
    { id: 13, name: "Shirt-short-sleeved (Secondary)", price: 550, category: "secondary", description: "Size: With badge", inStock: true, image: "images/shirt-secondary-badge.jpg" },
    { id: 14, name: "Shirt-short-sleeved (ECD)", price: 450, category: "ecd", description: "Size: Plain", inStock: true, image: "images/shirt-ecd-plain.jpg" },
    { id: 15, name: "Shirt-short-sleeved (Primary)", price: 650, category: "primary", description: "Size: Checked(S)", inStock: true, image: "images/shirt-primary-checked.jpg" },
    { id: 16, name: "Shirt-short-sleeved (Primary)", price: 600, category: "primay", description: "Size: Checked(28-32)", inStock: true, image: "images/shirt-ecd-checked1.jpg" },
    { id: 17, name: "Shirt-short-sleeved (Primary)", price: 550, category: "primary", description: "Size: Checked(24-26)", inStock: true, image: "images/shirt-primary-checked-alt.jpg" },
    { id: 18, name: "Shirt long-sleeved (Secondary)", price: 600, category: "secondary", description: "Size: Without badge", inStock: true, image: "images/shirt-secondary-no-badge.jpg" },
    { id: 19, name: "Shirt long-sleeved (Secondary)", price: 650, category: "secondary", description: "Size: With badge", inStock: true, image: "images/shirt-secondary-with-badge.jpg" },
    { id: 20, name: "Shorts", price: 700, category: "secondary", description: "Size: Secondary", inStock: true, image: "images/shorts-secondary.jpg" },
    { id: 21, name: "Shorts", price: 600, category: "secondary", description: "Size: L (waist 30-33)", inStock: true, image: "images/shorts-large.jpg" },
    { id: 22, name: "Shorts", price: 500, category: "secondary", description: "Size: M (waist 26-29)", inStock: true, image: "images/shorts-medium.jpg" },
    { id: 23, name: "Shorts", price: 450, category: "secondary", description: "Size: S (waist 18-25)", inStock: true, image: "images/shorts-small.jpg" },
    { id: 24, name: "Windbreakers", price: 900, category: "school", description: "Size: Without badge", inStock: true, image: "images/sweater-short-no-badge.jpg" },
    { id: 25, name: "Windbreakers", price: 950, category: "school", description: "Size: With badge", inStock: true, image: "images/sweater-short-badge.jpg" },
    { id: 26, name: "Sweater (Long-sleeved)", price: 650, category: "school", description: "Size: 22-24", inStock: true, image: "images/sweater-long-22-24.jpg" },
    { id: 27, name: "Sweater (Long-sleeved)", price: 700, category: "school", description: "Size: 26", inStock: true, image: "images/download (4).jpeg" },
    { id: 28, name: "Sweater (Long-sleeved)", price: 750, category: "school", description: "Size: 28", inStock: true, image: "images/sweater-long-28.jpg" },
    { id: 29, name: "Sweater (Long-sleeved)", price: 800, category: "school", description: "Size: 30", inStock: true, image: "images/sweater-long-30.jpg" },
    { id: 30, name: "Sweater (Long-sleeved)", price: 850, category: "school", description: "Size: 32", inStock: true, image: "images/sweater-long-32.jpg" },
    { id: 31, name: "Sweater (Long-sleeved)", price: 900, category: "school", description: "Size: 34", inStock: true, image: "images/sweater-long-34.jpg" },
    { id: 32, name: "Sweater (Long-sleeved)", price: 950, category: "school", description: "Size: 36", inStock: true, image: "images/sweater-long-36.jpg" },
    { id: 33, name: "Sweater (Long-sleeved)", price: 1000, category: "school", description: "Size: 38", inStock: true, image: "images/sweater-long-38.jpg" },
    { id: 34, name: "Branded Sweater (Long-sleeved)", price: 1200, category: "school", description: "Size: 26", inStock: true, image: "images/sweater-long-26.jpg" },
    { id: 35, name: "Tie", price: 150, category: "school", description: "Size: With badge", inStock: true, image: "images/tie.jpg" },
    { id: 36, name: "Tunic (Light)", price: 800, category: "school", description: "Size: Plain-coloured(L)", inStock: true, image: "images/tunic-light-plain.jpg" },
    { id: 37, name: "Tunic (Light)", price: 750, category: "school", description: "Size: Plain-coloured(M)", inStock: true, image: "images/tunic-light-plain.jpg" },
    { id: 38, name: "Tunic (Light)", price: 700, category: "school", description: "Size: Plain-coloured(S)", inStock: true, image: "images/tunic-light-plain.jpg" },
    { id: 39, name: "Tunic (Light)", price: 900, category: "school", description: "Size: Checked(L)", inStock: true, image: "images/tunic-light-checked.jpg" },
    { id: 40, name: "Tunic (Light)", price: 850, category: "school", description: "Size: Checked(M)", inStock: true, image: "images/tunic-light-checked.jpg" },
    { id: 41, name: "Tunic (Light)", price: 800, category: "school", description: "Size: Checked(S)", inStock: true, image: "images/tunic-light-checked.jpg" },
    { id: 42, name: "Tunic (Heavy)", price: 900, category: "school", description: "Size: Plain-coloured(L)", inStock: true, image: "images/tunic-heavy-plain.jpg" },
    { id: 43, name: "Tunic (Heavy)", price: 850, category: "school", description: "Size: Plain-coloured(M)", inStock: true, image: "images/tunic-heavy-plain.jpg" },
    { id: 44, name: "Tunic (Heavy)", price: 800, category: "school", description: "Size: Plain-coloured(S)", inStock: true, image: "images/tunic-heavy-plain.jpg" },
    { id: 45, name: "Tunic (Heavy)", price: 950, category: "school", description: "Size: Checked(L)", inStock: true, image: "images/tunic-heavy-checked.jpg" },
    { id: 46, name: "Tunic (Heavy)", price: 900, category: "school", description: "Size: Checked(M)", inStock: true, image: "images/tunic-heavy-checked.jpg" },
    { id: 47, name: "Tunic (Heavy)", price: 850, category: "school", description: "Size: Checked(S)", inStock: true, image: "images/tunic-heavy-checked.jpg" },
    { id: 48, name: "Trousers", price: 850, category: "secondary", description: "Size: Secondary", inStock: true, image: "images/trousers-secondary.jpg" },
    { id: 49, name: "Trousers", price: 650, category: "ecd", description: "Size: ECD", inStock: true, image: "images/trousers-ecd.jpg" },
    { id: 50, name: "Tracksuit", price: 2300, category: "school", description: "Size: 42-46", inStock: true, image: "images/tracksuit-xlarge.jpg" },
    { id: 51, name: "Tracksuit", price: 2100, category: "school", description: "Size: 38-40", inStock: true, image: "images/tracksuit-large.jpg" },
    { id: 52, name: "Tracksuit", price: 1900, category: "school", description: "Size: 38-40", inStock: true, image: "images/tracksuit-large.jpg" },
    { id: 53, name: "Tracksuit", price: 1700, category: "school", description: "Size: 28-35", inStock: true, image: "images/tracksuit-medium.jpg" },
    { id: 54, name: "Tracksuit", price: 1500, category: "school", description: "Size: 22-26", inStock: true, image: "images/tracksuit-small.jpg" },
    { id: 55, name: "T-Shirt (Secondary)", price: 500, category: "secondary", description: "Size: Plain", inStock: true, image: "images/tshirt-secondary-printed.jpg" },
    { id: 56, name: "T-Shirt (Secondary)", price: 600, category: "secondary", description: "Size: Printed", inStock: true, image: "images/tshirt-secondary-printed.jpg" },
    { id: 57, name: "T-Shirt (Primary/ECD)", price: 450, category: "secondary", description: "Size: Printed", inStock: true, image: "images/tshirt-secondary-printed.jpg" },
    { id: 58, name: "T-Shirt (Primary/ECD)", price: 500, category: "secondary", description: "Size: Printed", inStock: true, image: "images/tshirt-secondary-printed.jpg" },
    { id: 59, name: "Vest", price: 200, category: "school", description: "", inStock: true, image: "images/vest.jpg" },
    { id: 60, name: "Towel", price: 550, category: "school", description: "Size: Heavy", inStock: true, image: "images/towel.jpg" },
    { id: 61, name: "Lab coats", price: 1500, category: "school", description: "", inStock: true, image: "images/labcoats.jpg" },
    { id: 62, name: "Dustcoats", price: 1500, category: "school", description: "", inStock: true, image: "images/dustcoats.jpg" },
    { id: 63, name: "Overalls", price: 2000, category: "school", description: "", inStock: true, image: "images/overalls.jpg" },
    { id: 64, name: "Chef coats", price: 1800, category: "school", description: "", inStock: true, image: "images/chefcoats.jpg" },
    { id: 65, name: "KMTC Dresses", price: 1800, category: "school", description: "", inStock: true, image: "images/KMTC dresses.jpg" },
    { id: 66, name: "KMTC Cardigans", price: 1600, category: "school", description: "", inStock: true, image: "images/KMTC cardigans.jpg" },
    { id: 67, name: "Scrubs", price: 2000, category: "school", description: "", inStock: true, image: "images/scrubs.jpg" },
   
    ];

// async function seedDatabase() {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log('Connected to MongoDB');
        
//         // Clear existing products
//         await Product.deleteMany({});
//         console.log('Cleared existing products');
        
//         // Add sample products with images
//         await Product.insertMany(products);
//         console.log('✅ Sample products with images added successfully!');
        
//         mongoose.disconnect();
//     } catch (error) {
//         console.error('❌ Error seeding database:', error);
//     }
// }

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        const inserted = await Product.insertMany(products);
        console.log(`✅ Inserted ${inserted.length} products successfully!`);
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
}

seedDatabase();


// seedDatabase();