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
           <div class="product-image">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     style="width: 100%; height: auto; border-radius: 8px;">
            </div>
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
    { id: 1, name: "Badge", price: 60, category: "school", description: "Size: All", inStock: true, image: "images/badge.jpg" },
    { id: 2, name: "Bedcover", price: 650, category: "school", description: "Size: School-size", inStock: true, image: "images/bedcover.jpg" },
    { id: 3, name: "Bedsheet", price: 600, category: "school", description: "Size: School-size", inStock: true, image: "images/bedsheet.jpg" },
   { id: 4, name: "Blanket", price: 650, category: "school", description: "Size: Light", inStock: true, image: "images/blanket.jpg" },
   { id: 5, name: "Blanket", price: 850, category: "school", description: "Size: Heavy", inStock: true, image: "images/blanket.jpg" },
   { id: 6, name: "Blazer", price: 1500, category: "secondary", description: "Size: All (Secondary schools) without lining", inStock: true, image: "images/blazer.jpg" },
    { id: 7, name: "Blazer", price: 2100, category: "secondary", description: "Size: All (Secondary schools) with lining", inStock: true, image: "images/blazer.jpg" },

    { id: 9, name: "Fleece Jacket/Jumper", price: 2400, category: "secondary ", description: "Size: Secondary (with logo)", inStock: true, image: "images/fleece-jacket.jpg" },
    { id: 10, name: "Fleece Jacket", price: 2100, category: "school", description: "Size: 36-40", inStock: true, image: "images/download (1).jpeg" },
    { id: 11, name: "Fleece Jacket", price: 2000, category: "school", description: "Size: 30-34", inStock: true, image: "images/download.jpeg" },
    { id: 12, name: "Fleece Jacket", price: 1850, category: "school", description: "Size: 24-28", inStock: true, image: "images/images.jpeg" },
   
    { id: 14, name: "Shirt-short-sleeved (Secondary)", price: 500, category: "secondary", description: "Size: Plain (Without badge)", inStock: true, image: "images/shirt-secondary-plain.jpg"  },
    { id: 15, name: "Shirt-short-sleeved (Secondary)", price: 550, category: "secondary", description: "Size: With badge", inStock: true, image: "images/shirt-secondary-badge.jpg" },
    { id: 16, name: "Shirt-short-sleeved (ECD)", price: 450, category: "ecd", description: "Size: Plain", inStock: true, image: "images/shirt-ecd-plain.jpg" },
    { id: 17, name: "Shirt-short-sleeved (Primary)", price: 650, category: "primary", description: "Size: Checked(S)", inStock: true, image: "images/shirt-primary-checked.jpg" },
    { id: 18, name: "Shirt-short-sleeved (Primary)", price: 600, category: "primay", description: "Size: Checked(28-32)", inStock: true, image: "images/shirt-ecd-checked1.jpg" },
    { id: 19, name: "Shirt-short-sleeved (Primary)", price: 550, category: "primary", description: "Size: Checked(24-26)", inStock: true, image: "images/shirt-primary-checked-alt.jpg" },
    { id: 20, name: "Shirt long-sleeved (Secondary)", price: 600, category: "secondary", description: "Size: Without badge", inStock: true, image: "images/shirt-secondary-no-badge.jpg" },
    { id: 21, name: "Shirt long-sleeved (Secondary)", price: 650, category: "secondary", description: "Size: With badge", inStock: true, image: "images/shirt-secondary-with-badge.jpg" },
    { id: 22, name: "Shorts", price: 700, category: "secondary", description: "Size: Secondary", inStock: true, image: "images/shorts-secondary.jpg" },
    { id: 23, name: "Shorts", price: 600, category: "secondary", description: "Size: L (waist 30-33)", inStock: true, image: "images/shorts-large.jpg" },
    { id: 24, name: "Shorts", price: 500, category: "secondary", description: "Size: M (waist 26-29)", inStock: true, image: "images/shorts-medium.jpg" },
    { id: 25, name: "Shorts", price: 450, category: "secondary", description: "Size: S (waist 18-25)", inStock: true, image: "images/shorts-small.jpg" },
    { id: 26, name: "Windbreakers", price: 900, category: "school", description: "Size: Without badge", inStock: true, image: "images/sweater-short-no-badge.jpg" },
    { id: 27, name: "Windbreakers", price: 950, category: "school", description: "Size: With badge", inStock: true, image: "images/sweater-short-badge.jpg" },
    { id: 28, name: "Sweater (Long-sleeved)", price: 650, category: "school", description: "Size: 22-24", inStock: true, image: "images/sweater-long-22-24.jpg" },
    { id: 29, name: "Sweater (Long-sleeved)", price: 700, category: "school", description: "Size: 26", inStock: true, image: "images/download (4).jpeg" },
   
    { id: 30, name: "Sweater (Long-sleeved)", price: 750, category: "school", description: "Size: 28", inStock: true, image: "images/sweater-long-28.jpg" },
    { id: 31, name: "Sweater (Long-sleeved)", price: 800, category: "school", description: "Size: 30", inStock: true, image: "images/sweater-long-30.jpg" },
    { id: 32, name: "Sweater (Long-sleeved)", price: 850, category: "school", description: "Size: 32", inStock: true, image: "images/sweater-long-32.jpg" },
    { id: 33, name: "Sweater (Long-sleeved)", price: 900, category: "school", description: "Size: 34", inStock: true, image: "images/sweater-long-34.jpg" },
    { id: 34, name: "Sweater (Long-sleeved)", price: 950, category: "school", description: "Size: 36", inStock: true, image: "images/sweater-long-36.jpg" },
    { id: 35, name: "Sweater (Long-sleeved)", price: 1000, category: "school", description: "Size: 38", inStock: true, image: "images/sweater-long-38.jpg" },
     { id: 69, name: "Branded Sweater (Long-sleeved)", price: 1200, category: "school", description: "Size: 26", inStock: true, image: "images/sweater-long-26.jpg" },
    { id: 36, name: "Tie", price: 150, category: "school", description: "Size: With badge", inStock: true, image: "images/tie.jpg" },
    { id: 37, name: "Tunic (Light)", price: 800, category: "school", description: "Size: Plain-coloured(L)", inStock: true, image: "images/tunic-light-plain.jpg" },
     { id: 50, name: "Tunic (Light)", price: 750, category: "school", description: "Size: Plain-coloured(M)", inStock: true, image: "images/tunic-light-plain.jpg" },
      { id: 51, name: "Tunic (Light)", price: 700, category: "school", description: "Size: Plain-coloured(S)", inStock: true, image: "images/tunic-light-plain.jpg" },
    { id: 38, name: "Tunic (Light)", price: 900, category: "school", description: "Size: Checked(L)", inStock: true, image: "images/tunic-light-checked.jpg" },
    { id: 52, name: "Tunic (Light)", price: 850, category: "school", description: "Size: Checked(M)", inStock: true, image: "images/tunic-light-checked.jpg" },
    { id: 58, name: "Tunic (Light)", price: 800, category: "school", description: "Size: Checked(S)", inStock: true, image: "images/tunic-light-checked.jpg" },
   
     { id: 39, name: "Tunic (Heavy)", price: 900, category: "school", description: "Size: Plain-coloured(L)", inStock: true, image: "images/tunic-heavy-plain.jpg" },
      { id: 54, name: "Tunic (Heavy)", price: 850, category: "school", description: "Size: Plain-coloured(M)", inStock: true, image: "images/tunic-heavy-plain.jpg" },
       { id: 55, name: "Tunic (Heavy)", price: 800, category: "school", description: "Size: Plain-coloured(S)", inStock: true, image: "images/tunic-heavy-plain.jpg" },
   
        { id: 40, name: "Tunic (Heavy)", price: 950, category: "school", description: "Size: Checked(L)", inStock: true, image: "images/tunic-heavy-checked.jpg" },
         { id: 56, name: "Tunic (Heavy)", price: 900, category: "school", description: "Size: Checked(M)", inStock: true, image: "images/tunic-heavy-checked.jpg" },
          { id: 57, name: "Tunic (Heavy)", price: 850, category: "school", description: "Size: Checked(S)", inStock: true, image: "images/tunic-heavy-checked.jpg" },
    { id: 41, name: "Trousers", price: 850, category: "secondary", description: "Size: Secondary", inStock: true, image: "images/trousers-secondary.jpg" },
    { id: 42, name: "Trousers", price: 650, category: "ecd", description: "Size: ECD", inStock: true, image: "images/trousers-ecd.jpg" },
    { id: 43, name: "Tracksuit", price: 2300, category: "school", description: "Size: 42-46", inStock: true, image: "images/tracksuit-xlarge.jpg" },
    { id: 44, name: "Tracksuit", price: 2100, category: "school", description: "Size: 38-40", inStock: true, image: "images/tracksuit-large.jpg" },
    { id: 58, name: "Tracksuit", price: 1900, category: "school", description: "Size: 38-40", inStock: true, image: "images/tracksuit-large.jpg" },
    { id: 45, name: "Tracksuit", price: 1700, category: "school", description: "Size: 28-35", inStock: true, image: "images/tracksuit-medium.jpg" },
    { id: 46, name: "Tracksuit", price: 1500, category: "school", description: "Size: 22-26", inStock: true, image: "images/tracksuit-small.jpg" },
    { id: 47, name: "T-Shirt (Secondary)", price: 500, category: "secondary", description: "Size: Plain", inStock: true, image: "images/tshirt-secondary-printed.jpg" },
    { id: 48, name: "T-Shirt (Secondary)", price: 600, category: "secondary", description: "Size: Printed", inStock: true, image: "images/tshirt-secondary-printed.jpg" },
    { id: 59, name: "T-Shirt (Primary/ECD)", price: 450, category: "secondary", description: "Size: Printed", inStock: true, image: "images/tshirt-secondary-printed.jpg" },
    { id: 60, name: "T-Shirt (Primary/ECD)", price: 500, category: "secondary", description: "Size: Printed", inStock: true, image: "images/tshirt-secondary-printed.jpg" },

    
    { id: 61, name: "Vest", price: 200, category: "school", description: "", inStock: true, image: "images/vest.jpg" },
    { id: 53, name: "Towel", price: 550, category: "school", description: "Size: Heavy", inStock: true, image: "images/towel.jpg" },
    { id: 62, name: "Lab coats", price: 1500, category: "school", description: "", inStock: true, image: "images/labcoats.jpg" },
    { id: 63, name: "Dustcoats", price: 1500, category: "school", description: "", inStock: true, image: "images/dustcoats.jpg" },
    { id: 64, name: "Overalls", price: 1800-2500, category: "school", description: "", inStock: true, image: "images/overalls.jpg" },
    { id: 65, name: "Chef coats", price: 1800, category: "school", description: "", inStock: true, image: "images/chefcoats.jpg" },
    { id: 66, name: "KMTC Dresses", price: 1800, category: "school", description: "", inStock: true, image: "images/KMTC dresses.jpg" },
    { id: 67, name: "KMTC Cardigans", price: 1600, category: "school", description: "", inStock: true, image: "images/KMTC cardigans.jpg" },
    { id: 68, name: "Scrubs", price: 2000, category: "school", description: "", inStock: true, image: "images/scrubs.jpg" },
   
    ];


    displayProducts(products);
}
