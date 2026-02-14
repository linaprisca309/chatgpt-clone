function showSection(id) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    const target = document.getElementById(id);
    if (!target) return;
    target.style.display = 'block';
    target.classList.add('animate-fade');
    // remove animation class after it finishes so it can be re-used
    target.addEventListener('animationend', () => target.classList.remove('animate-fade'), { once: true });
    // update URL hash without jumping
    history.replaceState(null, '', `#${id}`);
    // smooth scroll to top of page for a graceful transition
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { /* fallback */ }
    // mark active nav
    setActiveNav(id);
}

// handle nav link clicks (works with hashed links)
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const hash = link.hash ? link.hash.slice(1) : (link.getAttribute('href') || '').split('#')[1];
        if (hash) showSection(hash);
        // close mobile menu when a link is clicked
        document.querySelector('nav ul')?.classList.remove('open');
    });
});

// contact form: simple simulated send + inline message
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = document.createElement('div');
        msg.className = 'form-success';
        msg.textContent = 'Message sent — thank you!';
        contactForm.appendChild(msg);
        contactForm.reset();
        setTimeout(() => msg.remove(), 4000);
    });
}

// set active nav link based on section id
function setActiveNav(id){
    document.querySelectorAll('nav a').forEach(a => {
        const h = a.hash ? a.hash.slice(1) : (a.getAttribute('href') || '').split('#')[1];
        if (h === id) a.classList.add('active'); else a.classList.remove('active');
    });
}

// Add slide animation to cards on hover
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseover', () => card.classList.add('animate-slide'));
    card.addEventListener('mouseout', () => card.classList.remove('animate-slide'));
});

// mobile menu toggle + initial hash handling
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const navList = document.querySelector('nav ul');
    if (menuBtn && navList) {
        menuBtn.addEventListener('click', () => navList.classList.toggle('open'));
    }

    // show section based on URL hash, or home by default
    const initial = location.hash ? location.hash.slice(1) : 'home';
    showSection(initial);
});