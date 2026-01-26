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
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

// Criamos a timeline, mas usaremos autoAlpha para lidar com a visibilidade
const menuTL = gsap.timeline({ paused: true });

menuTL.to(navMenu, {
    right: 0,
    autoAlpha: 1, 
    duration: 0.6,
    ease: "power4.inOut"
})
.from(navLinks, {
    x: 30,
    opacity: 1,
    stagger: 0.1,
    duration: 0.4,
    ease: "power2.out"
}, "-=0.3");

let menuOpen = false;

// Função para abrir/fechar apenas se for mobile/tablet
function toggleMenu() {
    if (window.innerWidth <= 1024) { // Só roda em Tablet e Mobile
        if (!menuOpen) {
            menuTL.play();
            menuToggle.innerHTML = '<i class="lni lni-close"></i>';
        } else {
            menuTL.reverse();
            menuToggle.innerHTML = '<i class="lni lni-menu"></i>';
        }
        menuOpen = !menuOpen;
    }
}

menuToggle.addEventListener('click', toggleMenu);

// Fechar ao clicar nos links (Apenas no Mobile)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            menuTL.reverse();
            menuToggle.innerHTML = '<i class="lni lni-menu"></i>';
            menuOpen = false;
        }
    });
});

// O SEGREDO PARA O PC: Resetar tudo se a tela aumentar
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        // Limpa as propriedades que o GSAP injetou
        gsap.set(navMenu, { clearProps: "all" });
        gsap.set(navLinks, { clearProps: "all" });
        menuToggle.innerHTML = '<i class="lni lni-menu"></i>';
        menuOpen = false;
    }
});