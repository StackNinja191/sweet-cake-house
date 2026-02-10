/**
 * Customize Cake Page - Handle custom cake order form
 */

document.addEventListener('DOMContentLoaded', function() {
    const customizeForm = document.getElementById('customize-form');
    const eventDateInput = document.getElementById('cake-date');
    const fileInput = document.getElementById('cake-reference');

    // Set minimum event date (2 days from now for custom cakes)
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 2);
    eventDateInput.min = minDate.toISOString().split('T')[0];

    // File input validation
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                this.value = '';
                return;
            }

            // Check file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                alert('Only JPG and PNG images are allowed');
                this.value = '';
                return;
            }
        }
    });

    // Form submission
    customizeForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(customizeForm);
        
        const customOrderData = {
            type: 'custom',
            customer: {
                name: formData.get('customName'),
                phone: formData.get('customPhone'),
                email: formData.get('customEmail')
            },
            cake: {
                occasion: formData.get('cakeOccasion'),
                eventDate: formData.get('cakeDate'),
                flavor: formData.get('cakeFlavor'),
                size: formData.get('cakeSize'),
                shape: formData.get('cakeShape'),
                layers: formData.get('cakeLayers'),
                theme: formData.get('cakeTheme'),
                colors: formData.get('cakeColors'),
                text: formData.get('cakeText') || 'None',
                decorations: formData.get('cakeDecorations') || 'None',
                special: formData.get('cakeSpecial') || 'None',
                budget: formData.get('cakeBudget') || 'Not specified'
            },
            reference: fileInput.files[0] ? fileInput.files[0].name : 'No file uploaded',
            orderId: 'SCH-CUSTOM-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
            orderDate: new Date().toISOString(),
            status: 'pending_review'
        };

        // Save to localStorage (in real app, this would be sent to backend)
        const customOrders = JSON.parse(localStorage.getItem('customOrders') || '[]');
        customOrders.push(customOrderData);
        localStorage.setItem('customOrders', JSON.stringify(customOrders));

        // Show success message
        const submitBtn = customizeForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        // Simulate submission
        setTimeout(() => {
            alert(`✅ Custom Order Request Submitted Successfully!\n\nOrder ID: ${customOrderData.orderId}\n\nOur team will contact you within 24 hours to discuss your design and provide a detailed quote.\n\nThank you for choosing Sweet Cake House! 🎂`);
            
            // Reset form
            customizeForm.reset();
            submitBtn.textContent = '🎉 Submit Custom Order Request';
            submitBtn.disabled = false;

            // Optional: Redirect to home
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);

        // Log for debugging
        console.log('Custom Order Submitted:', customOrderData);
    });

    // Character counter for text input
    const textInput = document.getElementById('cake-text');
    if (textInput) {
        textInput.addEventListener('input', function() {
            const maxLength = this.maxLength;
            const currentLength = this.value.length;
            const hint = this.nextElementSibling;
            if (hint && hint.classList.contains('form-hint')) {
                hint.textContent = `${currentLength}/${maxLength} characters`;
            }
        });
    }
});
