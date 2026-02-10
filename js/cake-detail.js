/**
 * Cake Detail Page - Interactive Order Form
 * Updated to handle Dynamic Cake Loading & Breadcrumbs
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- PART 1: DYNAMIC CAKE DATA LOAD ---

    // Cake Database
    const cakesDatabase = {
        'chocolate-dream': {
            name: 'Chocolate Dream Cake',
            image: 'assets/dreamcake.jpg',
            basePrice: 5000,
            desc: 'Rich chocolate layers with creamy frosting. A chocolate lover\'s paradise!'
        },
        'vanilla': {
            name: 'Classic Vanilla Cake',
            image: 'assets/vanilla.jpg',
            basePrice: 6500,
            desc: 'Light and fluffy vanilla sponge with smooth buttercream.'
        },
        'strawberry': {
            name: 'Strawberry Delight',
            image: 'assets/starbery.jpg',
            basePrice: 5000,
            desc: 'Fresh strawberries and cream with vanilla sponge.'
        },
        'red-velvet': {
            name: 'Red Velvet Cake',
            image: 'assets/redwelvet.jpg',
            basePrice: 7000,
            desc: 'Velvety smooth with tangy cream cheese frosting.'
        },
        'wedding': {
            name: 'Wedding Cake',
            image: 'assets/wedding.jpg',
            basePrice: 25000,
            desc: 'Elegant multi-tier design perfect for your special day.'
        },
        'birthday': {
            name: 'Birthday Celebration',
            image: 'assets/birthday.jpg',
            basePrice: 4500,
            desc: 'Colorful and fun designs for birthday celebrations.'
        }
    };

    // URL se parameter uthana
    const urlParams = new URLSearchParams(window.location.search);
    const cakeId = urlParams.get('cake');

    let currentBasePrice = 5000; // Default fallback

    if (cakeId && cakesDatabase[cakeId]) {
        const cakeData = cakesDatabase[cakeId];
        
        // 1. Page Content Update karein
        const nameElement = document.getElementById('cake-name');
        const imgElement = document.getElementById('cake-image');
        const descElement = document.querySelector('.cake-detail-description');
        
        // --- YE NEW LINE HAI JO BREADCRUMB UPDATE KAREGI ---
        const breadcrumbElement = document.getElementById('breadcrumb-name');
        
        if(nameElement) nameElement.textContent = cakeData.name;
        if(imgElement) imgElement.src = cakeData.image;
        if(descElement) descElement.textContent = cakeData.desc;
        if(breadcrumbElement) breadcrumbElement.textContent = cakeData.name; // New Update

        // 2. Base Price Set karein
        currentBasePrice = cakeData.basePrice;

        // 3. Dropdown Menu ki prices update karein
        const weightSelectElement = document.getElementById('cake-weight');
        if (weightSelectElement) {
            const price1lb = currentBasePrice;
            const price2lb = currentBasePrice * 1.8; 
            const price3lb = currentBasePrice * 2.6;

            weightSelectElement.options[0].dataset.price = price1lb;
            weightSelectElement.options[0].text = `1 lb (6-8 servings) - Rs ${price1lb.toLocaleString()}`;
            
            weightSelectElement.options[1].dataset.price = price2lb;
            weightSelectElement.options[1].text = `2 lbs (10-15 servings) - Rs ${price2lb.toLocaleString()}`;

            weightSelectElement.options[2].dataset.price = price3lb;
            weightSelectElement.options[2].text = `3 lbs (20-25 servings) - Rs ${price3lb.toLocaleString()}`;
        }
    }

    // --- PART 2: EXISTING INTERACTIVE LOGIC ---

    const weightSelect = document.getElementById('cake-weight');
    const quantityInput = document.getElementById('cake-quantity');
    const qtyMinusBtn = document.getElementById('qty-minus');
    const qtyPlusBtn = document.getElementById('qty-plus');
    const messageInput = document.getElementById('cake-message');
    const totalPriceDisplay = document.getElementById('total-price');
    const addToCartBtn = document.getElementById('add-to-cart-btn');

    let currentPrice = currentBasePrice; 
    let currentQuantity = 1;

    function formatPrice(price) {
        return "Rs " + Math.round(price).toLocaleString();
    }

    function updateTotalPrice() {
        const total = currentPrice * currentQuantity;
        if (typeof CartManager !== 'undefined') {
            totalPriceDisplay.textContent = CartManager.formatPrice(total);
        } else {
            totalPriceDisplay.textContent = formatPrice(total);
        }
    }

    if (weightSelect) {
        weightSelect.addEventListener('change', function() {
            currentPrice = parseInt(this.selectedOptions[0].dataset.price);
            updateTotalPrice();
        });
    }

    if (qtyMinusBtn) {
        qtyMinusBtn.addEventListener('click', function() {
            if (currentQuantity > 1) {
                currentQuantity--;
                quantityInput.value = currentQuantity;
                updateTotalPrice();
            }
        });
    }

    if (qtyPlusBtn) {
        qtyPlusBtn.addEventListener('click', function() {
            if (currentQuantity < 10) {
                currentQuantity++;
                quantityInput.value = currentQuantity;
                updateTotalPrice();
            }
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                value = 1;
            } else if (value > 10) {
                value = 10;
            }
            currentQuantity = value;
            this.value = value;
            updateTotalPrice();
        });
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const cakeName = document.getElementById('cake-name').textContent;
            const cakeImage = document.getElementById('cake-image').src;
            const weight = weightSelect.selectedOptions[0].text.split(' - ')[0];
            const message = messageInput.value.trim();
            const finalID = cakeId || 'custom-cake';

            const cartItem = {
                id: finalID, 
                name: cakeName,
                image: cakeImage,
                weight: weight,
                price: currentPrice,
                quantity: currentQuantity,
                message: message || 'No message'
            };

            if (typeof CartManager !== 'undefined') {
                CartManager.addItem(cartItem);
                
                setTimeout(() => {
                    if (confirm('Item added to cart! Would you like to view your cart?')) {
                        window.location.href = 'cart.html';
                    }
                }, 500);
            } else {
                console.error("CartManager script is missing!");
                alert("Cart system not loaded properly.");
            }
        });
    }

    updateTotalPrice();
});