// API base URL
const API_URL = 'https://school-uniforms-backend.onrender.com';
const DELIVERY_FEE = 200

let cart = [];


// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromAPI();
    setupEventListeners();
});

// Load products from backend API
async function loadProductsFromAPI() {
    try {
        const response = await fetch(`${API_URL}/api/products`);
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
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Show checkout section
    document.getElementById('checkout-section').style.display = 'block';
    
    // Populate checkout cart items and calculate total
    displayCheckoutItems();
    calculateCheckoutTotal();
    
    // Clear any previous messages
    document.getElementById('checkout-error').style.display = 'none';
    document.getElementById('checkout-success').style.display = 'none';
    
    // Reset form
    document.getElementById('checkout-form').reset();
    
    // Scroll to top
    document.getElementById('checkout-section').scrollTop = 0;
}

function closeCheckout() {
    document.getElementById('checkout-section').style.display = 'none';
}

function displayCheckoutItems() {
    const container = document.getElementById('checkout-cart-items');
    
    if (cart.length === 0) {
        container.innerHTML = '<p>No items in cart</p>';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="checkout-cart-item">
            <div class="item-info">
                <strong>${item.name}</strong>
                <br>
                <small>Size: ${item.size || 'N/A'} | Qty: ${item.quantity}</small>
            </div>
            <div class="item-price">
                KSH ${(item.price * item.quantity).toLocaleString()}
            </div>
        </div>
    `).join('');
}

function calculateCheckoutTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
    const total = subtotal + deliveryFee;

    document.getElementById('checkout-subtotal').textContent = `KSH ${subtotal.toLocaleString()}`;
    document.getElementById('checkout-delivery').textContent = `KSH ${deliveryFee.toLocaleString()}`;
    document.getElementById('checkout-total').textContent = `KSH ${total.toLocaleString()}`;
}

function showCheckoutError(message) {
    const errorDiv = document.getElementById('checkout-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Scroll to top to show error
    document.getElementById('checkout-section').scrollTop = 0;
    
    // Hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function showCheckoutSuccess(message) {
    const successDiv = document.getElementById('checkout-success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    
    // Scroll to top to show success
    document.getElementById('checkout-section').scrollTop = 0;
}

async function placeOrder() {
    console.log('Place order function called');
    
    // Validate form
    const form = document.getElementById('checkout-form');
    if (!form.checkValidity()) {
        console.log('Form validation failed');
        form.reportValidity();
        return;
    }

    // Get form data
    const formData = new FormData(form);
    const customerName = formData.get('customerName');
    const phone = formData.get('phone');
    const email = formData.get('email') || '';
    const school = formData.get('school') || '';
    const address = formData.get('address') || '';
    const notes = formData.get('notes') || '';

    console.log('Form data collected:', { customerName, phone, email, school, address, notes });

    // Check if cart exists and has items
    if (!cart || cart.length === 0) {
        showCheckoutError('Cart is empty or not defined');
        return;
    }

    console.log('Current cart:', cart);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = DELIVERY_FEE;
    const total = subtotal + deliveryFee;

    const orderData = {
        customerName,
        phone,
        email,
        school,
        address,
        notes,
        items: cart,
        subtotal,
        deliveryFee,
        total,
        orderDate: new Date().toISOString()
    };

    console.log('Order data prepared:', orderData);
    console.log('API URL:', API_URL);

    // Show loading state
    const placeOrderBtn = document.getElementById('place-order-btn');
    const btnText = document.getElementById('order-btn-text');
    const btnLoading = document.getElementById('order-btn-loading');
    
    if (placeOrderBtn) placeOrderBtn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';

    try {
        console.log('Sending request to:', `${API_URL}/orders`);
        console.log('Request body:', JSON.stringify(orderData));

        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        console.log('Response received:', response);
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        // Get response text first to see what we're getting
        const responseText = await response.text();
        console.log('Raw response text:', responseText);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
        }

        // Try to parse as JSON
        let result;
        try {
            result = JSON.parse(responseText);
            console.log('Parsed JSON result:', result);
        } catch (parseError) {
            console.error('Failed to parse JSON:', parseError);
            throw new Error(`Invalid JSON response: ${responseText}`);
        }

        if (result && result.success) {
            // Show success message
            showCheckoutSuccess(`Order placed successfully! Order ID: ${result.orderId || 'N/A'}. We will contact you shortly at ${phone}.`);
            
            // Clear cart
            cart = [];
            if (typeof updateCartUI === 'function') {
                updateCartUI(); // Your existing function to update cart display
            }
            
            // Hide the place order button and form
            if (placeOrderBtn) placeOrderBtn.style.display = 'none';
            form.style.display = 'none';
            
            // Auto-close checkout after 3 seconds
            setTimeout(() => {
                closeCheckout();
                // Reset everything for next order
                if (placeOrderBtn) placeOrderBtn.style.display = 'block';
                form.style.display = 'block';
                const successDiv = document.getElementById('checkout-success');
                if (successDiv) successDiv.style.display = 'none';
            }, 3000);
            
        } else {
            throw new Error(result?.message || 'Server returned success: false');
        }

    } catch (error) {
        console.error('Error placing order:', error);
        showCheckoutError(`Error: ${error.message}`);
    } finally {
        // Reset button state
        if (placeOrderBtn) placeOrderBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
    }
}
function testOrderSetup() {
    console.log('=== Order Setup Test ===');
    console.log('API_URL:', API_URL);
    console.log('DELIVERY_FEE:', DELIVERY_FEE);
    console.log('Cart exists:', typeof cart !== 'undefined');
    console.log('Cart contents:', cart);
    console.log('Checkout form exists:', !!document.getElementById('checkout-form'));
    console.log('Place order button exists:', !!document.getElementById('place-order-btn'));
    console.log('========================');
}
// Optional: Close checkout when clicking outside
document.addEventListener('click', function(event) {
    const checkoutSection = document.getElementById('checkout-section');
    const checkoutContainer = document.querySelector('.checkout-container');
    
    if (event.target === checkoutSection && !checkoutContainer.contains(event.target)) {
        closeCheckout();
    }
});
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

    displayProducts(products);
}
