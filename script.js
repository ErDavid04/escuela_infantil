// ----- MENÚ MÓVIL GLOBAL -----
(() => {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (!menuToggle || !navMenu) return;

    // Alternar menú
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = navMenu.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
    });

    // Cerrar al hacer clic en un enlace
    navMenu.addEventListener('click', (e) => {
        if (e.target.closest('.nav-link')) {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    });

    // Cerrar si se cambia a vista escritorio
    const mql = window.matchMedia('(min-width: 768px)');
    const handleResize = () => {
        if (mql.matches) {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
    };
    mql.addEventListener('change', handleResize);
})();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        }
    });
});

// Active link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 100)) {
            currentSection = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Sistema de Gestión de Cookies
class CookieManager {
    constructor() {
        this.banner = document.getElementById('cookieBanner');
        this.modal = document.getElementById('cookieModal');
        this.init();
    }

    init() {
        // Verificar si ya se han guardado preferencias
        const preferencesSet = this.getCookie('cookies_preferences_set');
        console.log('Cookies preferences set:', preferencesSet); // Para debug

        if (preferencesSet !== 'true') {
            setTimeout(() => {
                this.showBanner();
            }, 1000);
        } else {
            // Si ya hay preferencias, inicializar servicios según lo aceptado
            this.initializeServices();
        }

        this.bindEvents();
    }

    bindEvents() {
        // Banner events
        document.getElementById('acceptAllCookies').addEventListener('click', () => this.acceptAll());
        document.getElementById('configureCookies').addEventListener('click', () => this.showModal());
        document.getElementById('rejectCookies').addEventListener('click', () => this.rejectAll());

        // Modal events
        document.getElementById('closeCookieModal').addEventListener('click', () => this.hideModal());
        document.getElementById('saveCookiePreferences').addEventListener('click', () => this.savePreferences());
        document.getElementById('acceptAllInModal').addEventListener('click', () => this.acceptAll());
        document.getElementById('rejectAllInModal').addEventListener('click', () => this.rejectAll());

        // Cerrar modal al hacer clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }

    showBanner() {
        this.banner.classList.add('show');
    }

    hideBanner() {
        this.banner.classList.remove('show');
    }

    showModal() {
        this.hideBanner();
        this.modal.classList.add('show');
        this.loadCurrentPreferences();
    }

    hideModal() {
        this.modal.classList.remove('show');
    }

    loadCurrentPreferences() {
        const performance = this.getCookie('performance_cookies') === 'true';
        const functionality = this.getCookie('functionality_cookies') === 'true';
        const marketing = this.getCookie('marketing_cookies') === 'true';

        document.getElementById('performanceCookies').checked = performance;
        document.getElementById('functionalityCookies').checked = functionality;
        document.getElementById('marketingCookies').checked = marketing;
    }

    acceptAll() {
        console.log('Aceptando todas las cookies...'); // Debug
        this.setCookie('performance_cookies', 'true', 365);
        this.setCookie('functionality_cookies', 'true', 365);
        this.setCookie('marketing_cookies', 'true', 365);
        this.setCookie('cookies_preferences_set', 'true', 365);

        console.log('Cookies guardadas:', document.cookie); // Debug

        this.hideBanner();
        this.hideModal();
        this.initializeServices();

        // Mostrar confirmación
        this.showConfirmation('Todas las cookies han sido aceptadas');
    }

    rejectAll() {
        console.log('Rechazando cookies no esenciales...'); // Debug
        this.setCookie('performance_cookies', 'false', 365);
        this.setCookie('functionality_cookies', 'false', 365);
        this.setCookie('marketing_cookies', 'false', 365);
        this.setCookie('cookies_preferences_set', 'true', 365);

        console.log('Cookies guardadas:', document.cookie); // Debug

        this.hideBanner();
        this.hideModal();

        // Mostrar confirmación
        this.showConfirmation('Cookies no esenciales rechazadas');
    }

    savePreferences() {
        const performance = document.getElementById('performanceCookies').checked;
        const functionality = document.getElementById('functionalityCookies').checked;
        const marketing = document.getElementById('marketingCookies').checked;

        this.setCookie('performance_cookies', performance.toString(), 365);
        this.setCookie('functionality_cookies', functionality.toString(), 365);
        this.setCookie('marketing_cookies', marketing.toString(), 365);
        this.setCookie('cookies_preferences_set', 'true', 365);

        console.log('Preferencias guardadas:', document.cookie); // Debug

        this.hideModal();

        if (performance || functionality || marketing) {
            this.initializeServices();
        }

        // Mostrar confirmación
        this.showConfirmation('Preferencias de cookies guardadas');
    }

    initializeServices() {
        // Aquí inicializas Google Analytics, Facebook Pixel, etc.
        // según las preferencias del usuario

        const performance = this.getCookie('performance_cookies') === 'true';
        const marketing = this.getCookie('marketing_cookies') === 'true';

        if (performance) {
            // Inicializar Google Analytics
            console.log('Inicializando analytics...');
            this.loadGoogleAnalytics();
        }

        if (marketing) {
            // Inicializar Facebook Pixel
            console.log('Inicializando marketing...');
            this.loadFacebookPixel();
        }
    }

    loadGoogleAnalytics() {
        // Código de Google Analytics
        // Reemplaza con tu código real
        console.log('Google Analytics cargado');
    }

    loadFacebookPixel() {
        // Código de Facebook Pixel
        // Reemplaza con tu código real
        console.log('Facebook Pixel cargado');
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        const domain = "domain=" + window.location.hostname;
        const path = "path=/";
        const sameSite = "SameSite=Lax";

        document.cookie = `${name}=${value};${expires};${path};${sameSite}`;

        console.log(`Cookie ${name} establecida:`, value); // Debug
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                const value = c.substring(nameEQ.length, c.length);
                console.log(`Cookie ${name} encontrada:`, value); // Debug
                return value;
            }
        }
        console.log(`Cookie ${name} no encontrada`); // Debug
        return null;
    }

    showConfirmation(message) {
        // Crear un toast de confirmación
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-pink);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Inicializar el sistema de cookies cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para asegurar que todo esté cargado
    setTimeout(() => {
        new CookieManager();
    }, 100);
});

// Función adicional para resetear cookies (útil para testing)
function resetCookiePreferences() {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
    console.log('Todas las cookies han sido eliminadas');
    location.reload();
}

// Para testing: agregar un botón de reset en la consola
console.log('Para resetear cookies, ejecuta: resetCookiePreferences()');

// Manejo de formularios con Formspree
document.addEventListener('DOMContentLoaded', function () {
    // Configurar todos los formularios
    const forms = document.querySelectorAll('form[action*="formspree.io"]');

    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;

            // Mostrar estado de carga
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;

            // El envío real lo hace Formspree automáticamente
            // Solo mostramos feedback visual

            setTimeout(() => {
                showMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
                this.reset();

                // Restaurar botón después de un momento
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);

            }, 1000);
        });
    });

    function showMessage(message, type) {
        // Crear elemento de mensaje
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;

        // Estilos según el tipo
        if (type === 'success') {
            messageDiv.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } else {
            messageDiv.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        }

        messageDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(messageDiv);

        // Ocultar después de 5 segundos
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 5000);
    }
});

// Añadir estilos para las animaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    /* Mejoras visuales para formularios */
    .form-control:focus {
        border-color: var(--primary-pink);
        box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
    }
    
    .btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);

// Animaciones RÁPIDAS conservando los efectos del nav-menu
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.animateHeader();
        this.handleLoadAnimations();
        this.setupScrollObserver();
        this.handleNavigationProgress();
    }

    animateHeader() {
        const header = document.querySelector('header');
        if (header) {
            header.style.transform = 'translateY(-20px)';
            header.style.opacity = '0';

            setTimeout(() => {
                header.style.transition = 'all 0.4s ease';
                header.style.transform = 'translateY(0)';
                header.style.opacity = '1';
            }, 100);
        }
    }

    handleLoadAnimations() {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');

        if (heroContent) {
            heroContent.classList.add('animate-on-load');
            heroContent.style.animationDelay = '0.1s';
        }
        if (heroImage) {
            heroImage.classList.add('animate-on-load');
            heroImage.style.animationDelay = '0.2s';
        }

        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach((title, index) => {
            title.classList.add('animate-on-load');
            title.style.animationDelay = `${0.1 + (index * 0.05)}s`;
        });
    }

    setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.classList.add('animated');
                    observer.unobserve(element);
                }
            });
        }, {
            root: null,
            rootMargin: '10px',
            threshold: 0.05
        });

        const scrollElements = document.querySelectorAll(`
            .testimonial-card,
            .facility-card,
            .news-card,
            .about-content > div,
            .welcome-content > div,
            .admissions-content > div,
            .contact-content > div
        `);

        scrollElements.forEach(element => {
            element.classList.add('animate-on-scroll');
            observer.observe(element);
        });
    }

    handleNavigationProgress() {
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-link');

            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (pageYOffset >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Efectos Hover
class HoverEffects {
    constructor() {
        this.init();
    }

    init() {
        const cards = document.querySelectorAll('.testimonial-card, .facility-card, .news-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });

        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }
}

// Mobile menu toggle (SI YA LO TIENES, CONSERVARLO)
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.querySelector('i').className = navMenu.classList.contains('active')
                ? 'fas fa-times'
                : 'fas fa-bars';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.querySelector('i').className = 'fas fa-bars';
                }
            });
        });
    }
}

// Inicializar todo
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    new HoverEffects();
    initMobileMenu();
});

// ----- Modal Noticias -----
document.querySelectorAll('.news-read-more').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const eventType = btn.dataset.event;
        const modal = document.getElementById('newsModal');
        const title = document.getElementById('modalTitle');
        const text = document.getElementById('modalText');

        // Contenido personalizado por evento
        const info = {
            halloween: {
                title: "🎃🕸️ ¡Fiesta de Halloween en Mi Pequeño Ángel - El Molinillo! 👻🦇",
                text: `¡Llega el día más mágico y divertido del otoño! 🍁✨

En nuestra escuela infantil celebraremos Halloween con una mañana llena de alegría, color y muchas sorpresas:

🧙‍♀️ Talleres terroríficamente divertidos  
🎭 Desfile de disfraces  
🍭 Dulces y juegos encantados  
📸 ¡Y fotos para recordar este día tan especial!

👶 El alumnado vendrá con su mejor disfraz y se preparará para disfrutar junto a sus amigos y maestras de una jornada llena de risa, imaginación y diversión.

📅 Fecha: 31 de octubre de 2025  
📍 Lugar: Centro de Educación Infantil Mi Pequeño Ángel - El Molinillo

🧡 ¡Te esperamos para vivir una fiesta de miedo... pero de las buenas! ✨`
            },
            navidad: {
                title: "Festival de Navidad 🎄",
                text: "Muy pronto llegará uno de los momentos más mágicos del año. Cuando se acerque la fecha, compartiremos todos los detalles de nuestro Festival de Navidad, lleno de música, ilusión y espíritu navideño. 🎅✨"
            },
            proximo: {
                title: "Próximo Evento",
                text: "Aún no hay eventos programados, pero pronto anunciaremos nuevas actividades y talleres para toda la familia. ¡Mantente atento a nuestras noticias!"
            }
        };

        // Inserta contenido en el modal
        title.textContent = info[eventType].title;
        text.textContent = info[eventType].text;

        // Muestra el modal
        modal.style.display = 'block';
    });
});

// Cerrar modal con la X (solo si existe)
const closeBtn = document.querySelector('.close-btn');
const newsModal = document.getElementById('newsModal');

if (closeBtn && newsModal) {
    closeBtn.addEventListener('click', () => {
        newsModal.style.display = 'none';
    });
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', e => {
    const modal = document.getElementById('newsModal');
    if (e.target === modal) modal.style.display = 'none';
});

function saveCookiePreferences() {
    const performance = document.getElementById('performanceCookies').checked;
    const functionality = document.getElementById('functionalityCookies').checked;

    // Guardar preferencias en cookies
    document.cookie = `performance_cookies=${performance}; max-age=31536000; path=/`;
    document.cookie = `functionality_cookies=${functionality}; max-age=31536000; path=/`;
    document.cookie = `cookies_preferences_set=true; max-age=31536000; path=/`;

    alert('Preferencias de cookies guardadas correctamente');
}

// Cargar preferencias guardadas
document.addEventListener('DOMContentLoaded', function () {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name === 'performance_cookies') {
            document.getElementById('performanceCookies').checked = value === 'true';
        }
        if (name === 'functionality_cookies') {
            document.getElementById('functionalityCookies').checked = value === 'true';
        }
    });
});

// Mobile menu toggle
const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
menuToggle.setAttribute('aria-label', 'Abrir menú');

const headerContainer = document.querySelector('.header-container');
const navMenu = document.querySelector('.nav-menu');

headerContainer.appendChild(menuToggle);

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.querySelector('i').className = navMenu.classList.contains('active')
        ? 'fas fa-times'
        : 'fas fa-bars';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').className = 'fas fa-bars';
    });
});

// ====== GALERÍA DE INSTALACIONES ======
(() => {
    const modal = document.getElementById('galleryModal');
    const imgEl = document.getElementById('galleryImage');
    const titleEl = document.getElementById('galleryTitle');
    const btnPrev = document.getElementById('galleryPrev');
    const btnNext = document.getElementById('galleryNext');
    const closeBtn = document.querySelector('.gallery-close');

    // Si no está el modal, no hacemos nada (otra página)
    if (!modal || !imgEl || !titleEl) return;

    // Definimos las galerías (puedes añadir más fotos por cada una si las tienes)
    const galleries = {
        'aula-01': {
            title: 'Aula 0-1 años',
            images: [
                'img/aula01_1.jpg',
                'img/aula01_2.jpg',
                'img/aula01_3.jpg'
            ]
        },
        'aula-12': {
            title: 'Aula 1-2 años',
            images: [
                'img/aula12_1.jpg',
                'img/aula12_2.jpg',
                'img/aula12_3.jpg',
                'img/aula12_4.jpg'
            ]
        },
        'aula-23': {
            title: 'Aula 2-3 años',
            images: [
                'img/aula23_1.jpg',
                'img/aula23_2.jpg',
                'img/aula23_3.jpg',
                'img/aula23_4.jpg',
                'img/aula23_5.jpg'
            ]
        },
        'patio': {
            title: 'Patio',
            images: [
                'img/patio1.jpg',
                'img/patio2.jpg',
                'img/patio3.jpg'
            ]
        },
        'aseo': {
            title: 'Aseo',
            images: [
                'img/baño1.jpg',
                'img/baño2.jpg'
            ]
        }
    };

    let currentGallery = null;
    let currentIndex = 0;

    // Abrir galería
    document.querySelectorAll('.gallery-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.gallery;
            const gallery = galleries[key];
            if (!gallery) return;

            currentGallery = gallery;
            currentIndex = 0;
            showImage();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    function showImage() {
        if (!currentGallery) return;
        const imgSrc = currentGallery.images[currentIndex];
        imgEl.src = imgSrc;
        titleEl.textContent = `${currentGallery.title} (${currentIndex + 1}/${currentGallery.images.length})`;
    }

    // Navegación
    btnPrev.addEventListener('click', () => {
        if (!currentGallery) return;
        currentIndex = (currentIndex - 1 + currentGallery.images.length) % currentGallery.images.length;
        showImage();
    });

    btnNext.addEventListener('click', () => {
        if (!currentGallery) return;
        currentIndex = (currentIndex + 1) % currentGallery.images.length;
        showImage();
    });

    // Cerrar
    const closeModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') btnNext.click();
        if (e.key === 'ArrowLeft') btnPrev.click();
    });
})();

// ====== RESEÑAS DE GOOGLE EN TIEMPO REAL ======
// Las reseñas, la nota media y el número de opiniones se leen directamente de Google
// cada vez que se abre la página (y se refrescan cada `refreshMinutes`).
// Para activarlo hace falta una clave de API de Google Cloud con "Maps JavaScript API"
// y "Places API (New)" activadas, restringida al dominio de la web. Mientras `apiKey`
// esté vacía se muestran las reseñas que hay escritas en index.html.
const GOOGLE_REVIEWS = {
    apiKey: '',
    placeId: 'ChIJBeTVwCnQEQ0R8Xhczw9f96k', // Escuela Infantil MI Pequeño Ángel - El Molinillo
    minRating: 4,          // solo se muestran reseñas con esta nota o más
    refreshMinutes: 30
};

(() => {
    const grid = document.getElementById('reviewsGrid');
    if (!grid || !GOOGLE_REVIEWS.apiKey) return;

    const formatRating = (n) => n.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

    function renderStars(container, rating) {
        container.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            if (rating >= i) star.className = 'fas fa-star';
            else if (rating >= i - 0.5) star.className = 'fas fa-star-half-alt';
            else star.className = 'far fa-star';
            container.appendChild(star);
        }
    }

    function createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';

        const stars = document.createElement('div');
        stars.className = 'testimonial-stars';
        renderStars(stars, review.rating);

        const text = document.createElement('p');
        text.className = 'testimonial-text';
        text.textContent = `"${review.text}"`;

        const author = document.createElement('div');
        author.className = 'testimonial-author';
        const attribution = review.authorAttribution || {};
        const name = attribution.displayName || 'Usuario de Google';

        if (attribution.photoURI) {
            const avatar = document.createElement('img');
            avatar.className = 'testimonial-avatar';
            avatar.src = attribution.photoURI;
            avatar.alt = '';
            avatar.referrerPolicy = 'no-referrer';
            author.appendChild(avatar);
        } else {
            const avatar = document.createElement('span');
            avatar.className = 'testimonial-avatar';
            avatar.textContent = name.charAt(0).toUpperCase();
            author.appendChild(avatar);
        }

        const info = document.createElement('div');
        const nameEl = document.createElement(attribution.uri ? 'a' : 'span');
        nameEl.textContent = name;
        if (attribution.uri) {
            nameEl.href = attribution.uri;
            nameEl.target = '_blank';
            nameEl.rel = 'noopener';
        }
        const date = document.createElement('small');
        date.textContent = review.relativePublishTimeDescription || '';
        info.append(nameEl, date);
        author.appendChild(info);

        card.append(stars, text, author);
        return card;
    }

    async function loadReviews() {
        try {
            const { Place } = await google.maps.importLibrary('places');
            const place = new Place({ id: GOOGLE_REVIEWS.placeId, requestedLanguage: 'es' });
            await place.fetchFields({ fields: ['rating', 'userRatingCount', 'reviews'] });

            if (typeof place.rating === 'number') {
                document.querySelectorAll('[data-google-rating]').forEach(el => {
                    el.textContent = formatRating(place.rating);
                });
                document.querySelectorAll('[data-google-stars]').forEach(el => renderStars(el, place.rating));
            }
            if (typeof place.userRatingCount === 'number') {
                document.querySelectorAll('[data-google-count]').forEach(el => {
                    el.textContent = place.userRatingCount;
                });
            }

            const reviews = (place.reviews || []).filter(r => r.text && r.rating >= GOOGLE_REVIEWS.minRating);
            if (reviews.length) {
                grid.replaceChildren(...reviews.map(createReviewCard));
                const attributionEl = document.getElementById('reviewsAttribution');
                if (attributionEl) attributionEl.textContent = 'Reseñas obtenidas automáticamente de Google';
            }

            const liveBadge = document.getElementById('reviewsLiveBadge');
            if (liveBadge) liveBadge.hidden = false;
        } catch (error) {
            // Si Google no responde, se quedan las reseñas escritas en el HTML
            console.warn('No se pudieron cargar las reseñas de Google:', error);
        }
    }

    window.__initGoogleReviews = () => {
        loadReviews();
        setInterval(loadReviews, GOOGLE_REVIEWS.refreshMinutes * 60 * 1000);
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_REVIEWS.apiKey)}` +
        '&v=weekly&language=es&region=ES&loading=async&callback=__initGoogleReviews';
    script.async = true;
    document.head.appendChild(script);
})();
