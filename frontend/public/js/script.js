// API base URL
const API_URL = 'https://school-uniforms-backend.onrender.com';

let cart = [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromAPI();
    setupEventListeners();
});

// Load products from backend API
async function loadProductsFromAPI() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to sample data
        loadProducts();
    }
}

// Display products in the grid
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.name}</div>
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-description" style="color: #666; margin-bottom: 1rem;">${product.description}</div>
                <div class="product-price">KSH ${product.price.toLocaleString()}</div>
                <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    Add to Cart
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Add product to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCartUI();
    showNotification('Product added to cart!');
}

// Update cart display
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #00b894;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Open cart modal
function openCart() {
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    
    cartItems.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <span style="color: #666;">KSH ${item.price.toLocaleString()} x ${item.quantity}</span>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button>
            `;
            cartItems.appendChild(div);
        });
    }
    
    document.getElementById('cartTotal').textContent = `Total: KSH ${total.toLocaleString()}`;
    modal.style.display = 'block';
}

// Close cart modal
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    openCart(); // Refresh cart display
}

// Checkout function
async function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const customerName = prompt('Enter your full name:');
    if (!customerName) return;
    
    const phone = prompt('Enter your phone number:');
    if (!phone) return;
    
    const email = prompt('Enter your email (optional):') || '';
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData = {
        customerName,
        phone,
        email,
        items: cart,
        total
    };
    
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`Order placed successfully!\nOrder ID: ${result.orderId}\nTotal: KSH ${total.toLocaleString()}\n\nWe will contact you shortly!`);
            cart = [];
            updateCartUI();
            closeCart();
        } else {
            alert('Error placing order. Please try again.');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order. Please check your connection.');
    }
}

// Scroll to products section
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Handle contact form
function setupEventListeners() {
    document.getElementById('contactForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const contactData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            uniformType: formData.get('uniformType'),
            message: formData.get('message')
        };
        
        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(contactData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showNotification('Thank you for your inquiry! We will contact you soon.');
                this.reset();
            } else {
                alert('Error sending message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending contact form:', error);
            alert('Error sending message. Please check your connection.');
        }
    });
}

// Fallback function (same as before)
function loadProducts() {
    const products = [
    { id: 1, name: "Badge", price: 60, category: "school", description: "Size: All", inStock: true },
    { id: 2, name: "Bedcover", price: 650, category: "school", description: "Size: School-size", inStock: true },
    { id: 3, name: "Bedsheet", price: 250, category: "school", description: "Size: School-size", inStock: true },
    { id: 4, name: "Duster", price: 150, category: "school", description: "Size: Fair", inStock: true },
    { id: 5, name: "Blanket", price: 850, category: "school", description: "Size: Light", inStock: true},
    { id: 6, name: "Blanket", price: 1250, category: "school", description: "Size: Heavy", inStock: true },
    { id: 7, name: "Blazer", price: 2400, category: "secondary", description: "Size: All (Secondary schools)", inStock: true },
    { id: 8, name: "Boottop", price: 150, category: "school", description: "Size: —", inStock: true },
    { id: 9, name: "Fleece Jacket/Jumper", price: 2100, category: "secondary", description: "Size: Secondary (with logo)", inStock: true },
    { id: 10, name: "Same Skirt", price: 2100, category: "school", description: "Size: 36-40", inStock: true },
    { id: 11, name: "Same Skirt", price: 1850, category: "school", description: "Size: 30-34", inStock: true },
    { id: 12, name: "Same Skirt", price: 1700, category: "school", description: "Size: 24-28", inStock: true },
    { id: 13, name: "Slacks", price: 1200, category: "school", description: "Size: All types", inStock: true },
    { id: 14, name: "Shirt (Secondary)", price: 500, category: "secondary", description: "Size: Plain (Without badge)", inStock: true },
    { id: 15, name: "Shirt (Secondary)", price: 600, category: "secondary", description: "Size: With badge", inStock: true },
    { id: 16, name: "Shirt (ECD)", price: 450, category: "ecd", description: "Size: Plain", inStock: true },
    { id: 17, name: "Shirt (Primary)", price: 450, category: "primary", description: "Size: Checked", inStock: true },
    { id: 18, name: "Shirt (ECD)", price: 450, category: "ecd", description: "Size: Checked", inStock: true },
    { id: 19, name: "Shirt (Primary)", price: 500, category: "primary", description: "Size: Checked", inStock: true },
    { id: 20, name: "Shirt (Secondary)", price: 550, category: "secondary", description: "Size: Without badge", inStock: true },
    { id: 21, name: "Shirt (Secondary)", price: 600, category: "secondary", description: "Size: With badge", inStock: true },
    { id: 22, name: "Shorts", price: 700, category: "secondary", description: "Size: Secondary", inStock: true },
    { id: 23, name: "Shorts", price: 600, category: "secondary", description: "Size: L (waist 30-33)", inStock: true },
    { id: 24, name: "Shorts", price: 500, category: "secondary", description: "Size: M (waist 26-29)", inStock: true },
    { id: 25, name: "Shorts", price: 450, category: "secondary", description: "Size: S (waist 18-25)", inStock: true },
    { id: 26, name: "Sweater (Short-sleeved)", price: 900, category: "school", description: "Size: Without badge", inStock: true },
    { id: 27, name: "Sweater (Short-sleeved)", price: 950, category: "school", description: "Size: With badge", inStock: true },
    { id: 28, name: "Sweater (Long-sleeved)", price: 650, category: "school", description: "Size: 22-24", inStock: true },
    { id: 29, name: "Sweater (Long-sleeved)", price: 700, category: "school", description: "Size: 26", inStock: true },
    { id: 30, name: "Sweater (Long-sleeved)", price: 750, category: "school", description: "Size: 28", inStock: true },
    { id: 31, name: "Sweater (Long-sleeved)", price: 800, category: "school", description: "Size: 30", inStock: true },
    { id: 32, name: "Sweater (Long-sleeved)", price: 850, category: "school", description: "Size: 32", inStock: true },
    { id: 33, name: "Sweater (Long-sleeved)", price: 900, category: "school", description: "Size: 34", inStock: true },
    { id: 34, name: "Sweater (Long-sleeved)", price: 950, category: "school", description: "Size: 36", inStock: true },
    { id: 35, name: "Sweater (Long-sleeved)", price: 1000, category: "school", description: "Size: 38", inStock: true },
    { id: 36, name: "Tie", price: 150, category: "school", description: "Size: With badge", inStock: true },
    { id: 37, name: "Tunic (Light)", price: 750, category: "school", description: "Size: Plain-coloured", inStock: true },
    { id: 38, name: "Tunic (Light)", price: 800, category: "school", description: "Size: Checked", inStock: true },
    { id: 39, name: "Tunic (Heavy)", price: 850, category: "school", description: "Size: Plain-coloured", inStock: true },
    { id: 40, name: "Tunic (Heavy)", price: 850, category: "school", description: "Size: Checked", inStock: true },
    { id: 41, name: "Trousers", price: 850, category: "secondary", description: "Size: Secondary", inStock: true },
    { id: 42, name: "Trousers", price: 750, category: "ecd", description: "Size: ECD", inStock: true },
    { id: 43, name: "Tracksuit", price: 950, category: "school", description: "Size: 42-46", inStock: true },
    { id: 44, name: "Tracksuit", price: 900, category: "school", description: "Size: 38-40", inStock: true },
    { id: 45, name: "Tracksuit", price: 850, category: "school", description: "Size: 28-35", inStock: true },
    { id: 46, name: "Tracksuit", price: 800, category: "school", description: "Size: 22-26", inStock: true },
    { id: 47, name: "T-Shirt (Secondary)", price: 450, category: "secondary", description: "Size: Plain", inStock: true },
    { id: 48, name: "T-Shirt (Secondary)", price: 500, category: "secondary", description: "Size: Printed", inStock: true },
    { id: 49, name: "T-Shirt (Primary/ECD)", price: 400, category: "primary", description: "Size: Plain-Unprinted", inStock: true },
    { id: 50, name: "T-Shirt (Primary/ECD)", price: 450, category: "primary", description: "Size: Plain-Printed", inStock: true },
    { id: 51, name: "T-Shirt (Primary/ECD)", price: 450, category: "primary", description: "Size: Dotted-Unprinted", inStock: true },
    { id: 52, name: "T-Shirt (Primary/ECD)", price: 500, category: "primary", description: "Size: Dotted-Printed", inStock: true },
    { id: 53, name: "Towel", price: 350, category: "school", description: "Size: Heavy", inStock: true },
    { id: 54, name: "Pajama/Nightdress", price: 600, category: "school", description: "Size: —", inStock: true },
    { id: 55, name: "Panty", price: 100, category: "school", description: "Size: —", inStock: true },
    { id: 56, name: "Petticoat", price: 150, category: "school", description: "Size: Half", inStock: true },
    { id: 57, name: "Petticoat", price: 200, category: "school", description: "Size: Full", inStock: true },
    { id: 58, name: "Vest", price: 150, category: "school", description: "Size: —", inStock: true },
    { id: 59, name: "Weekend Dress", price: 900, category: "female", description: "Size: Female", inStock: true },
    { id: 60, name: "Staff Uniform", price: 1200, category: "female", description: "Size: Female", inStock: true },
    { id: 61, name: "Staff Uniform", price: 1200, category: "male", description: "Size: Male", inStock: true }
];

    displayProducts(products);
}
