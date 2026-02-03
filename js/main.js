// 1. REGISTRO E SINCRONIZAÇÃO
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. ANIMAÇÃO DO HERO (Aparecimento sofisticado)
const tlHero = gsap.timeline();

// Efeito de entrada da Imagem de Fundo
tlHero.from(".hero-bg", {
    scale: 1.2,           // Começa com zoom
    duration: 3,          // Uma transição longa e elegante
    ease: "power2.out"
}, 0) // O '0' faz ela começar junto com o h1
.from(".hero-content h1", {
    y: 50,
    opacity: 0,
    duration: 2,
    ease: "power4.out"
}, 0.5) 
.from(".hero-content p, .hero-content .gold-subtitle", {
    y: 30,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.2
}, "-=1.2");

// 3. NOVO: PARALLAX SUAVE NA IMAGEM DA HERO (Ao scrollar)
gsap.to(".hero-bg", {
    yPercent: 15, // A imagem desce suavemente enquanto você sobe o scroll
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true // Segue a velocidade do scroll perfeitamente
    }
});

// 3. PARALLAX SUAVE NAS IMAGENS DA COLEÇÃO
const portfolioImages = document.querySelectorAll('.portfolio-item img');

portfolioImages.forEach(img => {
    gsap.to(img, {
        yPercent: 20, 
        ease: "none",
        scrollTrigger: {
            trigger: img.parentElement, // O gatilho é o card (<a>)
            start: "top bottom", 
            end: "bottom top",
            scrub: 1.5 // O valor 1.5 dá aquela suavidade extra no movimento
        }
    });
});

// 4. REFRESH
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});

// 5. LÓGICA DO MENU HAMBURGER (LUXO)
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const icon = menuToggle.querySelector('i');

    function toggleMenu() {
        // Alterna a classe 'active' no menu
        navMenu.classList.toggle('active');
        
        // Alterna o ícone entre menu e fechar
        if (navMenu.classList.contains('active')) {
            icon.classList.replace('lni-menu', 'lni-close');
            document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
        } else {
            icon.classList.replace('lni-close', 'lni-menu');
            document.body.style.overflow = ''; // Libera o scroll
        }
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Fecha o menu ao clicar em qualquer link (UX)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) toggleMenu();
        });
    });
});

animarHeaderNoScroll();

window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        // Limpa as propriedades que o GSAP injetou
        gsap.set(navMenu, { clearProps: "all" });
        gsap.set(navLinks, { clearProps: "all" });
        menuToggle.innerHTML = '<i class="lni lni-menu"></i>';
        menuOpen = false;
    }
});