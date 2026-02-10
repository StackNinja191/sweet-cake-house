/**
 * Cart Page - Display and manage cart items
 */

document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartDiv = document.getElementById('empty-cart');
    const cartSummary = document.getElementById('cart-summary');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Load and display cart
    function loadCart() {
        const cart = CartManager.getCart();

        if (cart.length === 0) {
            // Show empty cart message
            cartItemsContainer.style.display = 'none';
            cartSummary.style.display = 'none';
            emptyCartDiv.style.display = 'block';
            return;
        }

        // Hide empty message and show cart
        emptyCartDiv.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        cartSummary.style.display = 'block';

        // Clear container
        cartItemsContainer.innerHTML = '';

        // Render each cart item
        cart.forEach((item, index) => {
            const cartItemHTML = `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-weight">Weight: ${item.weight}</p>
                        ${item.message !== 'No message' ? `<p class="cart-item-message">Message: "${item.message}"</p>` : ''}
                        <p class="cart-item-price">${CartManager.formatPrice(item.price)} each</p>
                    </div>
                    <div class="cart-item-quantity">
                        <label>Quantity:</label>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="updateItemQuantity(${index}, ${item.quantity - 1})">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="10" readonly class="qty-input">
                            <button class="qty-btn" onclick="updateItemQuantity(${index}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">
                        <p class="cart-item-subtotal">${CartManager.formatPrice(item.price * item.quantity)}</p>
                        <button class="btn-remove" onclick="removeCartItem(${index})">
                            <span>🗑️</span> Remove
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });

        // Update summary
        updateSummary();
    }

    // Update order summary
    function updateSummary() {
        const subtotal = CartManager.getCartTotal();
        const deliveryFee = CartManager.getDeliveryFee();
        const total = CartManager.getGrandTotal();

        document.getElementById('subtotal').textContent = CartManager.formatPrice(subtotal);
        document.getElementById('delivery-fee').textContent = deliveryFee === 0 ? 'FREE' : CartManager.formatPrice(deliveryFee);
        document.getElementById('total').textContent = CartManager.formatPrice(total);
    }

    // Global functions for cart operations
    window.updateItemQuantity = function(index, newQuantity) {
        if (newQuantity < 1 || newQuantity > 10) return;
        CartManager.updateQuantity(index, newQuantity);
        loadCart();
    };

    window.removeCartItem = function(index) {
        if (confirm('Are you sure you want to remove this item from cart?')) {
            CartManager.removeItem(index);
            loadCart();
        }
    };

    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        const cart = CartManager.getCart();
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        window.location.href = 'checkout.html';
    });

    // Initial load
    loadCart();
});
