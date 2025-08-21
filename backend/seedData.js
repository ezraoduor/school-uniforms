const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config() 

const products = [
    { id: 1, name: "Badge", price: 60, category: "school", description: "Size: All", inStock: true, image: "images/badge.jpg" },
    { id: 2, name: "Bedcover", price: 650, category: "school", description: "Size: School-size", inStock: true, image: "images/bedcover.jpg" },
    { id: 3, name: "Bedsheet", price: 250, category: "school", description: "Size: School-size", inStock: true, image: "images/bedsheet.jpg" },
    { id: 4, name: "Duster", price: 150, category: "school", description: "Size: Fair", inStock: true, image: "images/duster.jpg" },
    { id: 5, name: "Blanket", price: 850, category: "school", description: "Size: Light", inStock: true, image: "images/blanket.jpg" },
    { id: 7, name: "Blazer", price: 2400, category: "secondary", description: "Size: All (Secondary schools)", inStock: true, image: "images/blazer.jpg" },
    { id: 8, name: "Boottop", price: 150, category: "school", description: "Size: —", inStock: true, image: "images/boottop.jpg" },
    { id: 9, name: "Fleece Jacket/Jumper", price: 2100, category: "secondary", description: "Size: Secondary (with logo)", inStock: true, image: "images/fleece-jacket.jpg" },
    { id: 10, name: "Same Skirt", price: 2100, category: "school", description: "Size: 36-40", inStock: true, image: "images/skirt-large.jpg" },
    { id: 11, name: "Same Skirt", price: 1850, category: "school", description: "Size: 30-34", inStock: true, image: "images/skirt-medium.jpg" },
    { id: 12, name: "Same Skirt", price: 1700, category: "school", description: "Size: 24-28", inStock: true, image: "images/skirt-small.jpg" },
    { id: 13, name: "Slacks", price: 1200, category: "school", description: "Size: All types", inStock: true, image: "images/slacks.jpg" },
    { id: 14, name: "Shirt (Secondary)", price: 500, category: "secondary", description: "Size: Plain (Without badge)", inStock: true, image: "images/shirt-secondary-plain.jpg"  },
    { id: 15, name: "Shirt (Secondary)", price: 600, category: "secondary", description: "Size: With badge", inStock: true, image: "images/shirt-secondary-badge.jpg" },
    { id: 16, name: "Shirt (ECD)", price: 450, category: "ecd", description: "Size: Plain", inStock: true, image: "images/shirt-ecd-plain.jpg" },
    { id: 17, name: "Shirt (Primary)", price: 450, category: "primary", description: "Size: Checked", inStock: true, image: "images/shirt-primary-checked.jpg" },
    { id: 18, name: "Shirt (ECD)", price: 450, category: "ecd", description: "Size: Checked", inStock: true, image: "images/shirt-ecd-checked.jpg" },
    { id: 19, name: "Shirt (Primary)", price: 500, category: "primary", description: "Size: Checked", inStock: true, image: "images/shirt-primary-checked-alt.jpg" },
    { id: 20, name: "Shirt (Secondary)", price: 550, category: "secondary", description: "Size: Without badge", inStock: true, image: "images/shirt-secondary-no-badge.jpg" },
    { id: 21, name: "Shirt (Secondary)", price: 600, category: "secondary", description: "Size: With badge", inStock: true, image: "images/shirt-secondary-with-badge.jpg" },
    { id: 22, name: "Shorts", price: 700, category: "secondary", description: "Size: Secondary", inStock: true, image: "images/shorts-secondary.jpg" },
    { id: 23, name: "Shorts", price: 600, category: "secondary", description: "Size: L (waist 30-33)", inStock: true, image: "images/shorts-large.jpg" },
    { id: 24, name: "Shorts", price: 500, category: "secondary", description: "Size: M (waist 26-29)", inStock: true, image: "images/shorts-medium.jpg" },
    { id: 25, name: "Shorts", price: 450, category: "secondary", description: "Size: S (waist 18-25)", inStock: true, image: "images/shorts-small.jpg" },
    { id: 26, name: "Sweater (Short-sleeved)", price: 900, category: "school", description: "Size: Without badge", inStock: true, image: "images/sweater-short-no-badge.jpg" },
    { id: 27, name: "Sweater (Short-sleeved)", price: 950, category: "school", description: "Size: With badge", inStock: true, image: "images/sweater-short-badge.jpg" },
    { id: 28, name: "Sweater (Long-sleeved)", price: 650, category: "school", description: "Size: 22-24", inStock: true, image: "images/sweater-long26.jpg" },
    { id: 29, name: "Sweater (Long-sleeved)", price: 700, category: "school", description: "Size: 26", inStock: true, image: "images/sweater-long-26.jpg" },
    { id: 30, name: "Sweater (Long-sleeved)", price: 750, category: "school", description: "Size: 28", inStock: true, image: "images/sweater-long-26.jpg" },
    { id: 31, name: "Sweater (Long-sleeved)", price: 800, category: "school", description: "Size: 30", inStock: true, image: "images/sweater-long-26.jpg" },
    { id: 32, name: "Sweater (Long-sleeved)", price: 850, category: "school", description: "Size: 32", inStock: true, image: "images/sweater-long-26.jpg" },
    { id: 33, name: "Sweater (Long-sleeved)", price: 900, category: "school", description: "Size: 34", inStock: true, image: "images/sweater-long-26.jpg" },
    { id: 34, name: "Sweater (Long-sleeved)", price: 950, category: "school", description: "Size: 36", inStock: true, image: "images/sweater-long-26.jpg" },
    { id: 35, name: "Sweater (Long-sleeved)", price: 1000, category: "school", description: "Size: 38", inStock: true, image: "images/sweater-long-26.jpg" },
    { id: 36, name: "Tie", price: 150, category: "school", description: "Size: With badge", inStock: true, image: "images/tie.jpg" },
    { id: 37, name: "Tunic (Light)", price: 750, category: "school", description: "Size: Plain-coloured", inStock: true, image: "images/tunic-light-plain.jpg" },
    { id: 38, name: "Tunic (Light)", price: 800, category: "school", description: "Size: Checked", inStock: true, image: "images/tunic-light-checked.jpg" },
    { id: 39, name: "Tunic (Heavy)", price: 850, category: "school", description: "Size: Plain-coloured", inStock: true, image: "images/tunic-heavy-plain.jpg" },
    { id: 40, name: "Tunic (Heavy)", price: 850, category: "school", description: "Size: Checked", inStock: true, image: "images/tunic-heavy-checked.jpg" },
    { id: 41, name: "Trousers", price: 850, category: "secondary", description: "Size: Secondary", inStock: true, image: "images/trousers-secondary.jpg" },
    { id: 42, name: "Trousers", price: 750, category: "ecd", description: "Size: ECD", inStock: true, image: "images/trousers-ecd.jpg" },
    { id: 43, name: "Tracksuit", price: 950, category: "school", description: "Size: 42-46", inStock: true, image: "images/tracksuit-xlarge.jpg" },
    { id: 44, name: "Tracksuit", price: 900, category: "school", description: "Size: 38-40", inStock: true, image: "images/tracksuit-large.jpg" },
    { id: 45, name: "Tracksuit", price: 850, category: "school", description: "Size: 28-35", inStock: true, image: "images/tracksuit-medium.jpg" },
    { id: 46, name: "Tracksuit", price: 800, category: "school", description: "Size: 22-26", inStock: true, image: "images/tracksuit-small.jpg" },
    { id: 47, name: "T-Shirt (Secondary)", price: 450, category: "secondary", description: "Size: Plain", inStock: true, image: "images/tshirt-secondary-plain.jpg" },
    { id: 48, name: "T-Shirt (Secondary)", price: 500, category: "secondary", description: "Size: Printed", inStock: true, image: "images/tshirt-secondary-printed.jpg" },
    { id: 49, name: "T-Shirt (Primary/ECD)", price: 400, category: "primary", description: "Size: Plain-Unprinted", inStock: true, image: "images/tshirt-primary-plain.jpg" },
    { id: 50, name: "T-Shirt (Primary/ECD)", price: 450, category: "primary", description: "Size: Plain-Printed", inStock: true, image: "images/tshirt-primary-printed.jpg" },
    { id: 51, name: "T-Shirt (Primary/ECD)", price: 450, category: "primary", description: "Size: Dotted-Unprinted", inStock: true, image: "images/tshirt-primary-dotted.jpg" },
    { id: 52, name: "T-Shirt (Primary/ECD)", price: 500, category: "primary", description: "Size: Dotted-Printed", inStock: true, image: "images/tshirt-primary-dotted-printed.jpg" },
    { id: 53, name: "Towel", price: 350, category: "school", description: "Size: Heavy", inStock: true, image: "images/towel.jpg" },
    { id: 54, name: "Pajama/Nightdress", price: 600, category: "school", description: "Size: —", inStock: true, image: "images/pajama.jpg" },
    { id: 55, name: "Panty", price: 100, category: "school", description: "Size: —", inStock: true, image: "images/panty.jpg" },
    { id: 56, name: "Petticoat", price: 150, category: "school", description: "Size: Half", inStock: true, image: "images/petticoat-half.jpg" },
    { id: 57, name: "Petticoat", price: 200, category: "school", description: "Size: Full", inStock: true, image: "images/petticoat-full.jpg" },
    { id: 58, name: "Vest", price: 150, category: "school", description: "Size: —", inStock: true, image: "images/vest.jpg" },
    { id: 59, name: "Weekend Dress", price: 900, category: "female", description: "Size: Female", inStock: true, image: "images/weekend-dress.jpg" },
    { id: 60, name: "Staff Uniform", price: 1200, category: "female", description: "Size: Female", inStock: true, image: "images/staff-uniform-female.jpg" },
    { id: 61, name: "Staff Uniform", price: 1200, category: "male", description: "Size: Male", inStock: true, image: "images/staff-uniform-male.jpg" }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');
        
        // Add sample products with images
        await Product.insertMany(products);
        console.log('✅ Sample products with images added successfully!');
        
        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
}

seedDatabase();