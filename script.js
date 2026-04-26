// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const darkToggle = document.getElementById('darkToggle');
const loader = document.querySelector('.loader');
const backToTop = document.getElementById('backToTop');
const reveals = document.querySelectorAll('.reveal');

// Catalog page elements
let searchInput, catalogGrid, productModal, filterBtns;
const products = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initPage();
});

function initPage() {
    // Hide loader
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1500);

    // Navbar scroll effect
    window.addEventListener('scroll', handleScroll);
    
    // Navbar toggle
    if (navToggle) navToggle.addEventListener('click', toggleNav);
    
    // Dark mode toggle
    if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);
    
    // Back to top
    backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
    
    // Reveal animations
    window.addEventListener('scroll', checkReveal);
    
    // Page specific init
    if (document.querySelector('.catalog-grid')) {
        initCatalog();
    } else {
        initSlider();
    }
    
    // Smooth page transitions
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.hostname === window.location.hostname) {
                e.preventDefault();
                document.body.style.opacity = '0';
                setTimeout(() => window.location.href = link.href, 300);
            }
        });
    });
}

function handleScroll() {
    // Navbar background
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

function toggleNav() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

function toggleDarkMode() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        darkToggle.querySelector('.sun-icon').style.opacity = '0';
        darkToggle.querySelector('.moon-icon').style.opacity = '1';
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        darkToggle.querySelector('.sun-icon').style.opacity = '1';
        darkToggle.querySelector('.moon-icon').style.opacity = '0';
    }
}

// Load theme preference
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        darkToggle.querySelector('.sun-icon').style.opacity = '1';
        darkToggle.querySelector('.moon-icon').style.opacity = '0';
    }
}

// Reveal animations
function checkReveal() {
    const triggerBottom = window.innerHeight * 0.85;
    
    reveals.forEach(reveal => {
        const revealTop = reveal.getBoundingClientRect().top;
        
        if (revealTop < triggerBottom) {
            reveal.classList.add('active');
        }
    });
}

// Testimonial slider
function initSlider() {
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(autoSlideInterval);
            showSlide(index);
            startAutoSlide();
        });
    });

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    startAutoSlide();
}

// Catalog functionality
function initCatalog() {
    searchInput = document.getElementById('searchInput');
    catalogGrid = document.querySelector('.catalog-grid .container');
    productModal = document.getElementById('productModal');
    filterBtns = document.querySelectorAll('.filter-btn');
    
    // Product data
    productsData();
    
    // Event listeners
    searchInput.addEventListener('input', filterProducts);
    filterBtns.forEach(btn => btn.addEventListener('click', handleFilter));
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal();
    });
    
    renderProducts(products);
}

function productsData() {
    products.length = 0;
    products.push(
        {id: 1, name: 'Bouquet Mawar Abadi', price: 'Rp 250.000', category: 'bouquet', image: 'https://images.unsplash.com/photo-1608447246515-640f8d07ceca?w=400', badge: 'bestseller', description: 'Bouquet mawar crochet yang tahan lama dengan detail sempurna. Cocok untuk hadiah spesial.'},
        {id: 2, name: 'Amigurumi Bear', price: 'Rp 180.000', category: 'doll', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', badge: 'new', description: 'Boneka beruang amigurumi handmade dengan ekspresi menggemaskan.'},
        {id: 3, name: 'Gift Box Premium', price: 'Rp 350.000', category: 'gift', image: 'https://images.unsplash.com/photo-1582783238262-39b3d5da436f?w=400', description: 'Kotak hadiah premium berisi bouquet dan aksesoris crochet.'},
        {id: 4, name: 'Bouquet Baby', price: 'Rp 220.000', category: 'bouquet', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b32c43?w=400', description: 'Bouquet tema baby shower dengan warna pastel lembut.'},
        {id: 5, name: 'Crochet Bunny', price: 'Rp 160.000', category: 'doll', image: 'https://images.unsplash.com/photo-1617173434516-b1ee4f1395cd?w=400', badge: 'bestseller', description: 'Kelinci crochet mungil cocok untuk dekorasi atau hadiah anak.'},
        {id: 6, name: 'Custom Name Bouquet', price: 'Rp 300.000', category: 'custom', image: 'https://images.unsplash.com/photo-1558618047-3c8c76fddcada?w=400', description: 'Bouquet custom dengan nama personalisasi dan desain sesuai request.'},
        {id: 7, name: 'Floral Wreath', price: 'Rp 280.000', category: 'bouquet', image: 'https://images.unsplash.com/photo-1592036327027-9e9dbac6b781?w=400', description: 'Karangan bunga crochet untuk pintu atau dinding.'},
        {id: 8, name: 'Gift Set Couple', price: 'Rp 450.000', category: 'gift', image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400', description: 'Set hadiah couple berisi dua amigurumi dan bouquet mini.'},
        {id: 9, name: 'Unicorn Doll', price: 'Rp 200.000', category: 'doll', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', badge: 'new', description: 'Unicorn amigurumi dengan tanduk berkilau dan rainbow tail.'}
    );
}

function renderProducts(productList) {
    catalogGrid.innerHTML = `
        <div class="grid">
            ${productList.map(product => `
                <div class="product-card" data-category="${product.category}" data-name="${product.name.toLowerCase()}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        ${product.badge ? `<div class="badge ${product.badge}">${product.badge === 'bestseller' ? 'Best Seller' : 'New'}</div>` : ''}
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <span class="price">${product.price}</span>
                        <a href="#" class="btn btn-order" onclick="openModal(${product.id}); return false;">Order</a>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add click handlers to cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.addEventListener('click', () => openModal(index));
    });
}

function filterProducts() {
    const query = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    
    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(query);
        const matchesFilter = activeFilter === 'all' || product.category === activeFilter;
        return matchesSearch && matchesFilter;
    });
    
    renderProducts(filtered);
}

function handleFilter(e) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    filterProducts();
}

function openModal(index) {
    const product = products[index];
    if (!product) return;
    
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalImage').alt = product.name;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = product.price;
    document.getElementById('modalDescription').innerHTML = product.description;
    document.getElementById('modalOrder').href = `https://wa.me/6281234567890?text=Saya%20mau%20pesan%20${encodeURIComponent(product.name)}%20-%20${product.price}`;
    
    productModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    productModal.style.display = 'none';
    document.body.style.overflow = '';
}

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Load theme on init
loadTheme();

// Intersection Observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

reveals.forEach(reveal => observer.observe(reveal));

// Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
