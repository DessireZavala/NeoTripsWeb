// Carousel functionality
const carousels = {
    beach: { currentIndex: 0, totalItems: 3 },
    nature: { currentIndex: 0, totalItems: 3 },
    city: { currentIndex: 0, totalItems: 3 }
};

// Function to move carousel
function moveCarousel(type, direction) {
    const carousel = carousels[type];
    carousel.currentIndex += direction;
    
    // Handle wrapping around
    if (carousel.currentIndex < 0) {
        carousel.currentIndex = carousel.totalItems - 1;
    } else if (carousel.currentIndex >= carousel.totalItems) {
        carousel.currentIndex = 0;
    }
    
    // Update carousel position
    const carouselElement = document.getElementById(`${type}-carousel`);
    const inner = carouselElement.querySelector('.carousel-inner');
    inner.style.transform = `translateX(-${carousel.currentIndex * 100}%)`;
}

// Initialize carousels
document.addEventListener('DOMContentLoaded', function() {
    // Set initial positions
    for (const type in carousels) {
        const carouselElement = document.getElementById(`${type}-carousel`);
        const inner = carouselElement.querySelector('.carousel-inner');
        inner.style.transform = `translateX(-${carousels[type].currentIndex * 100}%)`;
    }
    
    // Add event listeners to carousel buttons
    const carouselButtons = document.querySelectorAll('.carousel-btn');
    carouselButtons.forEach(button => {
        button.addEventListener('click', function() {
            const carouselType = this.getAttribute('data-carousel');
            const direction = parseInt(this.getAttribute('data-direction'));
            moveCarousel(carouselType, direction);
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add scroll animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .service-card, .category {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
`;
document.head.appendChild(style);

// Script para el acordeón de preguntas frecuentes
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            // Cierra todas las otras respuestas abiertas
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherQuestion = otherItem.querySelector('.faq-question');

                if (otherItem !== item) {
                    otherAnswer.classList.remove('show');
                    otherQuestion.classList.remove('active');
                }
            });

            // Muestra o esconde la respuesta clicada
            answer.classList.toggle('show');
            question.classList.toggle('active');
        });
    });
});