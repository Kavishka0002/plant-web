/* ── Navbar scroll effect ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── Mobile hamburger ─── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── Phone slideshow ─── */
let currentSlide = 0;
const slides = document.querySelectorAll('.phone-screen');
const dots   = document.querySelectorAll('.dot');

function goSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

// Auto-advance every 3s
setInterval(() => {
  goSlide((currentSlide + 1) % slides.length);
}, 3000);

/* ── Scroll-triggered animations ─── */
const animEls = document.querySelectorAll('.feature-card, .role-card, .step');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
animEls.forEach(el => observer.observe(el));

