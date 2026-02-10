/**
 * Sweet Cake House - Cart Management System
 * Handles all cart operations using localStorage
 */

// Cart Manager Object
const CartManager = {
    // Get cart from localStorage
    getCart: function() {
        const cart = localStorage.getItem('sweetCakeCart');
        return cart ? JSON.parse(cart) : [];
    },

    // Save cart to localStorage
    saveCart: function(cart) {
        localStorage.setItem('sweetCakeCart', JSON.stringify(cart));
        this.updateCartCount();
    },

    // Add item to cart
    addItem: function(item) {
        const cart = this.getCart();
        
        // Check if item already exists
        const existingItemIndex = cart.findIndex(cartItem => 
            cartItem.id === item.id && 
            cartItem.weight === item.weight &&
            cartItem.message === item.message
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item
            cart.push(item);
        }

        this.saveCart(cart);
        this.showNotification('Item added to cart! 🎉', 'success');
        return true;
    },

    // Remove item from cart
    removeItem: function(index) {
        const cart = this.getCart();
        cart.splice(index, 1);
        this.saveCart(cart);
        this.showNotification('Item removed from cart', 'info');
    },

    // Update item quantity
    updateQuantity: function(index, quantity) {
        const cart = this.getCart();
        if (quantity <= 0) {
            this.removeItem(index);
            return;
        }
        cart[index].quantity = quantity;
        this.saveCart(cart);
    },

    // Clear entire cart
    clearCart: function() {
        localStorage.removeItem('sweetCakeCart');
        this.updateCartCount();
    },

    // Get cart item count
    getCartCount: function() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Calculate cart total
    getCartTotal: function() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Calculate delivery fee
    getDeliveryFee: function() {
        const subtotal = this.getCartTotal();
        // Free delivery for orders above Rs 10,000
        return subtotal >= 10000 ? 0 : 300;
    },

    // Get grand total (including delivery)
    getGrandTotal: function() {
        return this.getCartTotal() + this.getDeliveryFee();
    },

    // Update cart count in navbar
    updateCartCount: function() {
        const countElements = document.querySelectorAll('#cart-count');
        const count = this.getCartCount();
        countElements.forEach(element => {
            element.textContent = count;
        });
    },

    // Format price
    formatPrice: function(price) {
        return `Rs ${price.toLocaleString()}`;
    },

    // Show notification
    showNotification: function(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-weight: 600;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Update cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    CartManager.updateCartCount();
});

// Export for use in other scripts
window.CartManager = CartManager;
