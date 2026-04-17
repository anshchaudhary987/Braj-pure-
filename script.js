// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Sticky Header
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    // Initial check on load
    revealOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close mobile menu if open
            if(menuToggle && menuToggle.querySelector('i').classList.contains('fa-times')){
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Cart Modal Logic
    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    const cartModal = document.getElementById('cartModal');
    const closeModal = document.getElementById('closeModal');
    
    const cartProductName = document.getElementById('cartProductName');
    const cartMonthlyCalc = document.getElementById('cartMonthlyCalc');
    const cartTotal = document.getElementById('cartTotal');
    const confirmSubscriptionBtn = document.getElementById('confirmSubscriptionBtn');

    const cartVolume = document.getElementById('cartVolume');
    const cartQuantity = document.getElementById('cartQuantity');
    
    let currentBasePricePerLiter = 0;

    const updateCartCalculation = () => {
        const volume = parseFloat(cartVolume.value);
        const qty = parseInt(cartQuantity.value);
        
        // Calculate daily price based on volume
        // We'll charge 50% for 500ml (0.5), or we can just multiply
        const dailyPrice = (currentBasePricePerLiter * volume) * qty;
        const monthlyTotal = dailyPrice * 30;

        const volumeText = volume === 1 ? '1 Liter' : '500 ml';
        
        cartMonthlyCalc.textContent = `₹${dailyPrice} x 30 days`;
        cartTotal.textContent = `₹${monthlyTotal}`;
    };

    if (cartModal) {
        cartVolume.addEventListener('change', updateCartCalculation);
        cartQuantity.addEventListener('input', updateCartCalculation);

        subscribeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const product = btn.getAttribute('data-product');
                currentBasePricePerLiter = parseInt(btn.getAttribute('data-price'));
                
                // Reset inputs
                cartVolume.value = "1";
                cartQuantity.value = "1";

                // Update Modal Content
                cartProductName.textContent = product;
                updateCartCalculation();

                // Show Modal
                cartModal.classList.add('active');
            });
        });

        // Close Modal
        closeModal.addEventListener('click', () => {
            cartModal.classList.remove('active');
        });

        // Close when clicking outside the modal
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('active');
            }
        });

        // Confirm Subscription
        confirmSubscriptionBtn.addEventListener('click', () => {
            // Save to localStorage to display on checkout page
            const product = cartProductName.textContent;
            const priceText = cartMonthlyCalc.textContent;
            const total = cartTotal.textContent;
            
            const volumeText = cartVolume.options[cartVolume.selectedIndex].text;
            const qty = cartQuantity.value;
            
            localStorage.setItem('brajpure_cart_product', product);
            localStorage.setItem('brajpure_cart_price', priceText);
            localStorage.setItem('brajpure_cart_total', total);
            localStorage.setItem('brajpure_cart_volume', volumeText);
            localStorage.setItem('brajpure_cart_qty', qty);

            // Redirect to checkout page
            window.location.href = 'checkout.html';
        });
    }
});
