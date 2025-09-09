// Sample product data
const products = [
    {
        id: 1,
        name: "Modern 3-Seater Sofa",
        type: "Living Room",
        price: 24999,
        image: "https://via.placeholder.com/300x220/f5f5f5/666666?text=Modern+Sofa",
        tags: ["Top Seller"],
        stock: 15
    },
    {
        id: 2,
        name: "Minimalist Dining Table",
        type: "6-Seater",
        price: 18999,
        image: "https://via.placeholder.com/300x220/f5f5f5/666666?text=Dining+Table",
        tags: ["New Arrival"],
        stock: 8
    },
    {
        id: 3,
        name: "Storage Wardrobe",
        type: "4-Door",
        price: 32999,
        image: "https://via.placeholder.com/300x220/f5f5f5/666666?text=Wardrobe",
        tags: ["Best Value"],
        stock: 5
    },
    {
        id: 4,
        name: "Ergonomic Office Chair",
        type: "Adjustable",
        price: 8999,
        image: "https://via.placeholder.com/300x220/f5f5f5/666666?text=Office+Chair",
        tags: ["Top Seller", "Ergonomic"],
        stock: 20
    }
];

// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('livoraCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('livoraWishlist')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartDisplay();
    updateWishlistDisplay();
    setupSearchFunctionality();
});

// Load products into grid
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Create product card HTML
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-type">${product.type}</p>
            <div class="product-price">₹${product.price.toLocaleString()}</div>
            <div class="product-tags">
                ${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    return card;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('livoraCart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('livoraCart', JSON.stringify(cart));
    updateCartDisplay();
    renderCartItems();
}

// Update quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        localStorage.setItem('livoraCart', JSON.stringify(cart));
        updateCartDisplay();
        renderCartItems();
    }
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    if (cartTotal) {
        cartTotal.textContent = totalPrice.toLocaleString();
    }
}

// Update wishlist display
function updateWishlistDisplay() {
    const wishlistCount = document.getElementById('wishlistCount');
    wishlistCount.textContent = wishlist.length;
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
    
    if (cartSidebar.classList.contains('open')) {
        renderCartItems();
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Render cart items in sidebar
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; margin-top: 50px;">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeFromCart(${item.id})" style="margin-left: 15px; color: #ff4444; background: none; border: none; cursor: pointer;">Remove</button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // For demo purposes - redirect to checkout page
    window.location.href = 'checkout.html';
}

// Search functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchSuggestions.style.display = 'none';
            return;
        }
        
        const suggestions = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.type.toLowerCase().includes(query)
        ).slice(0, 5);
        
        if (suggestions.length > 0) {
            searchSuggestions.innerHTML = suggestions.map(product => `
                <div class="suggestion-item" onclick="selectProduct(${product.id})">
                    <img src="${product.image}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                    <div>
                        <div style="font-weight: 500;">${product.name}</div>
                        <div style="font-size: 14px; color: #666;">₹${product.price.toLocaleString()}</div>
                    </div>
                </div>
            `).join('');
            searchSuggestions.style.display = 'block';
        } else {
            searchSuggestions.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
    });
}

// Select product from search
function selectProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Scroll to product or open product detail page
        const productCards = document.querySelectorAll('.product-card');
        productCards[productId - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('searchSuggestions').style.display = 'none';
    }
}

// Offer tabs functionality
function showOfferTab(tabType) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    event.target.classList.add('active');
    
    // Filter and display products based on tab type
    let filteredProducts;
    if (tabType === 'lowest') {
        filteredProducts = [...products].sort((a, b) => a.price - b.price);
    } else if (tabType === 'lastchance') {
        filteredProducts = products.filter(p => p.stock < 10);
    }
    
    // Update product grid with filtered products
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Show notification
function showNotification(message) {
    // Create simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-yellow);
        color: var(--black);
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1002;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartButton = document.querySelector('.cart-item');
    
    if (cartSidebar.classList.contains('open') && 
        !cartSidebar.contains(e.target) && 
        !cartButton.contains(e.target)) {
        toggleCart();
    }
});
