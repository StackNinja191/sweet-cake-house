/**
 * Checkout Page - Handle checkout form and order placement
 */

document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const deliveryDateInput = document.getElementById('delivery-date');

    // Set minimum delivery date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    deliveryDateInput.min = tomorrow.toISOString().split('T')[0];

    // Load cart items in checkout
    function loadCheckoutItems() {
        const cart = CartManager.getCart();

        if (cart.length === 0) {
            alert('Your cart is empty!');
            window.location.href = 'cart.html';
            return;
        }

        // Clear container
        checkoutItemsContainer.innerHTML = '';

        // Render each item
        cart.forEach(item => {
            const itemHTML = `
                <div class="checkout-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="checkout-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.weight} × ${item.quantity}</p>
                        ${item.message !== 'No message' ? `<p class="item-message">Message: "${item.message}"</p>` : ''}
                    </div>
                    <div class="checkout-item-price">
                        ${CartManager.formatPrice(item.price * item.quantity)}
                    </div>
                </div>
            `;
            checkoutItemsContainer.innerHTML += itemHTML;
        });

        // Update summary
        updateCheckoutSummary();
    }

    // Update checkout summary
    function updateCheckoutSummary() {
        const subtotal = CartManager.getCartTotal();
        const deliveryFee = CartManager.getDeliveryFee();
        const total = CartManager.getGrandTotal();

        document.getElementById('checkout-subtotal').textContent = CartManager.formatPrice(subtotal);
        document.getElementById('checkout-delivery').textContent = deliveryFee === 0 ? 'FREE' : CartManager.formatPrice(deliveryFee);
        document.getElementById('checkout-total').textContent = CartManager.formatPrice(total);
    }

    // Form submission
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(checkoutForm);
        const orderData = {
            customer: {
                name: formData.get('customerName'),
                phone: formData.get('customerPhone'),
                email: formData.get('customerEmail')
            },
            delivery: {
                address: formData.get('deliveryAddress'),
                city: formData.get('deliveryCity'),
                area: formData.get('deliveryArea'),
                date: formData.get('deliveryDate'),
                time: formData.get('deliveryTime'),
                instructions: formData.get('deliveryInstructions') || 'None'
            },
            payment: {
                method: formData.get('paymentMethod')
            },
            items: CartManager.getCart(),
            summary: {
                subtotal: CartManager.getCartTotal(),
                deliveryFee: CartManager.getDeliveryFee(),
                total: CartManager.getGrandTotal()
            },
            notes: formData.get('orderNotes') || 'None',
            orderId: 'SCH-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
            orderDate: new Date().toISOString()
        };

        // Save order data to localStorage for confirmation page
        localStorage.setItem('lastOrder', JSON.stringify(orderData));

        // Clear cart
        CartManager.clearCart();

        // Show loading
        const submitBtn = document.getElementById('place-order-btn');
        submitBtn.textContent = 'Processing Order...';
        submitBtn.disabled = true;

        // Simulate order processing
        setTimeout(() => {
            // Redirect to success page
            window.location.href = 'order-success.html';
        }, 1500);
    });

    // Load items on page load
    loadCheckoutItems();
});
