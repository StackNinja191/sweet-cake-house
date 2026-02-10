const hb = document.getElementById('hamburger');
const mc = document.getElementById('menuCircle');
const cl = document.getElementById('closeMenu');

// Open Menu logic
hb.addEventListener('click', () => {
    mc.classList.add('active');
    document.body.style.overflow = 'hidden'; // Scroll rokne ke liye
});

// Close Menu logic
const closeMenu = () => {
    mc.classList.remove('active');
    document.body.style.overflow = 'auto'; // Scroll wapis lane ke liye
};

cl.addEventListener('click', closeMenu);

// Jab koi link dabaye tab bhi menu band ho jaye
document.querySelectorAll('.circle-nav-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
});

