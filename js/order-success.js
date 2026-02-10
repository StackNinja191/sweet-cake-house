/**
 * Order Success Page - Display order confirmation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get order data from localStorage
    const orderData = JSON.parse(localStorage.getItem('lastOrder'));

    if (!orderData) {
        // No order data found, redirect to home
        alert('No order found!');
        window.location.href = 'index.html';
        return;
    }

    // Populate order details
    document.getElementById('order-id').textContent = orderData.orderId;
    document.getElementById('customer-name').textContent = orderData.customer.name;
    document.getElementById('customer-phone').textContent = orderData.customer.phone;
    document.getElementById('customer-email').textContent = orderData.customer.email;

    // Delivery information
    const fullAddress = `${orderData.delivery.address}, ${orderData.delivery.area}, ${orderData.delivery.city}`;
    document.getElementById('delivery-address').textContent = fullAddress;
    
    // Format delivery date
    const deliveryDate = new Date(orderData.delivery.date);
    const formattedDate = deliveryDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('delivery-date').textContent = formattedDate;
    
    // Delivery time
    const timeSlots = {
        'morning': 'Morning (9 AM - 12 PM)',
        'afternoon': 'Afternoon (12 PM - 4 PM)',
        'evening': 'Evening (4 PM - 8 PM)'
    };
    document.getElementById('delivery-time').textContent = timeSlots[orderData.delivery.time];

    // Order items
    const orderItemsList = document.getElementById('order-items-list');
    orderItemsList.innerHTML = '';
    
    orderData.items.forEach(item => {
        const itemHTML = `
            <div class="order-item">
                <div class="order-item-details">
                    <strong>${item.name}</strong>
                    <p>${item.weight} × ${item.quantity}</p>
                    ${item.message !== 'No message' ? `<p class="text-small" style="color: var(--text-light);">Message: "${item.message}"</p>` : ''}
                </div>
                <div class="order-item-price">
                    ${CartManager.formatPrice(item.price * item.quantity)}
                </div>
            </div>
        `;
        orderItemsList.innerHTML += itemHTML;
    });

    // Payment summary
    document.getElementById('summary-subtotal').textContent = CartManager.formatPrice(orderData.summary.subtotal);
    document.getElementById('summary-delivery').textContent = orderData.summary.deliveryFee === 0 ? 'FREE' : CartManager.formatPrice(orderData.summary.deliveryFee);
    document.getElementById('summary-total').textContent = CartManager.formatPrice(orderData.summary.total);

    // Payment method
    const paymentMethods = {
        'cod': 'Cash on Delivery 💵',
        'bank': 'Bank Transfer 🏦',
        'easypaisa': 'EasyPaisa / JazzCash 📱'
    };
    document.getElementById('payment-method').textContent = paymentMethods[orderData.payment.method];

    // Optional: Send order email (in real app, this would be done via backend)
    console.log('Order placed:', orderData);
});
