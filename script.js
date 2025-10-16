// --- DATOS DEL PAQUETE PARA EL MODAL (NUEVO) ---
const packageData = {
    'ny': {
        title: 'Nueva York Vibrante',
        location: 'Nueva York, USA',
        tag: 'Ciudad',
        image: 'assets/newyork.jpg', // Usamos el nombre de tu archivo
        description: 'La ciudad que nunca duerme te espera con sus rascacielos icónicos, Broadway y la Estatua de la Libertad. Un viaje lleno de arte, cultura y vida nocturna.',
        price: '2,199',
        duration: '6 días / 5 noches',
        group: 'Máx. 4 personas',
        nextDeparture: '8 Nov 2025',
        inclusions: [
            'Vuelos ida y vuelta',
            'Hotel en Manhattan',
            'City Pass NYC',
            'Tour contrastado',
            'Ferry a Estatua Libertad',
            'Show de Broadway'
        ]
    },
    'santorini': {
        title: 'Santorini al Atardecer',
        location: 'Santorini, Grecia',
        tag: 'Playa',
        image: 'assets/santorini.jpg',
        description: 'Vive la magia de las puestas de sol más espectaculares de las islas griegas con sus casas blancas y vistas al mar Egeo. Perfecto para una escapada romántica.',
        price: '1,799',
        duration: '7 días / 6 noches',
        group: 'Hasta 4 personas',
        nextDeparture: '14 Nov 2025',
        inclusions: [
            'Vuelos ida y vuelta',
            'Estancia en Oia con piscina privada',
            'Desayunos y cenas incluidos',
            'Paseo en barco por la caldera',
            'Tour de degustación de vinos locales'
        ]
    },
    'caribe': {
        title: 'Paraíso Caribeño',
        location: 'Caribe Mexicano',
        tag: 'Playa',
        image: 'assets/paraiso caribeño.jpg',
        description: 'Relájate en las playas de arena blanca y aguas turquesas del Caribe. Todo incluido en un resort de lujo.',
        price: '1,299',
        duration: '7 días / 6 noches',
        group: 'Hasta 4 personas',
        nextDeparture: '15 Nov 2025',
        inclusions: [
            'Vuelos y traslados',
            'Estancia en resort 5 estrellas todo incluido',
            'Actividades acuáticas no motorizadas',
            'Cenas temáticas ilimitadas'
        ]
    },
    'machu': {
        title: 'Machu Picchu Místico',
        location: 'Machu Picchu, Perú',
        tag: 'Aventura',
        image: 'assets/machupichu.jpg',
        description: 'Descubre la majestuosa ciudadela inca. Un recorrido cultural y de aventura por los Andes.',
        price: '1,599',
        duration: '8 días / 7 noches',
        group: 'Hasta 8 personas',
        nextDeparture: '12 Nov 2025',
        inclusions: [
            'Vuelos y tren a Aguas Calientes',
            'Guía bilingüe experto',
            'Entrada a Machu Picchu',
            'Alojamiento en Cusco y Aguas Calientes'
        ]
    },
    'dubai': {
        title: 'Dubai Lujoso',
        location: 'Dubai, UAE',
        tag: 'Ciudad',
        image: 'assets/dubai.jpg',
        description: 'Experimenta el lujo y la modernidad de Dubai. Visita rascacielos y explora el desierto dorado.',
        price: '2,299',
        duration: '6 días / 5 noches',
        group: 'Hasta 4 personas',
        nextDeparture: '18 Nov 2025',
        inclusions: [
            'Vuelos y hotel de lujo',
            'Tour por el Burj Khalifa',
            'Safari por el desierto',
            'Traslados privados'
        ]
    },
    'tokyo': {
        title: 'Tokyo Moderno',
        location: 'Tokyo, Japón',
        tag: 'Ciudad',
        image: 'assets/tokio.jpg',
        description: 'Sumérgete en la cultura japonesa, desde la tecnología de Shibuya hasta los templos de Kioto (simulado).',
        price: '2,499',
        duration: '10 días / 9 noches',
        group: 'Hasta 6 personas',
        nextDeparture: '5 Nov 2025',
        inclusions: [
            'Vuelos y Japan Rail Pass',
            'Alojamiento en hoteles boutique',
            'Tour guiado por barrios de Tokyo'
        ]
    }
    // Añade el resto de tus 8 paquetes aquí.
};

// --- Lógica de la Modal de Detalles (Útil para index.html y paquetes.html) ---
function loadModalContent(packageId) {
    const modalContent = document.getElementById('modal-body-content');
    const data = packageData[packageId];
    if (!data) {
        modalContent.innerHTML = '<p>Detalles del paquete no disponibles.</p>';
        return;
    }

    const inclusionsList = data.inclusions.map(item => `<li>${item}</li>`).join('');

    // Plantilla HTML del modal
    modalContent.innerHTML = `
        <img src="${data.image}" alt="${data.title}" class="modal-header-img">
        <div class="modal-details">
            <h4>${data.title}</h4>
            <p class="package-location">${data.location}</p>
            <p class="package-description">${data.description}</p>
            
            <div class="package-details-info modal-details-grid">
                <p class="package-info">Duración: <strong>${data.duration}</strong></p>
                <p class="package-info">Grupo: <strong>${data.group}</strong></p>
                <p class="package-info">Próxima salida: <strong>${data.nextDeparture}</strong></p>
            </div>

            <div class="package-inclusions">
                <h5>El paquete incluye:</h5>
                <ul>${inclusionsList}</ul>
            </div>
        </div>
        
        <div class="modal-reservation-section">
            <h5>Selecciona tu viaje</h5>
            <div class="form-group">
                <label for="fecha-salida">Fecha de salida:</label>
                <select id="fecha-salida" name="fecha-salida">
                    <option>Selecciona una fecha</option>
                    <option value="${data.nextDeparture}">${data.nextDeparture}</option>
                    <option value="1 Mar 2026">1 Mar 2026</option>
                </select>
            </div>
            <div class="form-group">
                <label for="num-personas">Número de personas:</label>
                <input type="number" id="num-personas" name="num-personas" value="1" min="1" max="10">
            </div>
            
            <div class="modal-price-total">
                <p class="package-price">Precio total **$${data.price}** <span>$${data.price} + 1 persona</span></p>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-details close-modal-btn-inner">Cancelar</button>
                <button class="btn btn-reserve reserve-modal-btn" data-package-id="${packageId}">Agregar al Carrito</button>
            </div>
        </div>
    `;
    
    // Vuelve a añadir el listener para cerrar el modal desde el botón interno
    document.querySelector('.close-modal-btn-inner').addEventListener('click', () => {
        document.getElementById('package-modal').style.display = 'none';
    });
    
    // Listener para el botón de reserva dentro del modal
    document.querySelector('.reserve-modal-btn').addEventListener('click', () => {
        // Lógica de simulación de añadir al carrito
        document.getElementById('package-modal').style.display = 'none';
        document.getElementById('reservation-cart').classList.add('open');
        showConfirmationMessage();
    });
}

// Función para mostrar el mensaje de confirmación
function showConfirmationMessage() {
    const confirmationMessage = document.getElementById('reservation-confirmation');
    if (confirmationMessage) {
        confirmationMessage.style.display = 'block';
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 5000); // Ocultar después de 5 segundos
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica de Filtros de Paquetes (SOLO EN paquetes.html) ---
    // Este código se ejecutará solo en paquetes.html (donde existe el .category-filters)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const packageCards = document.querySelectorAll('.package-card');

    if (filterButtons.length > 0 && packageCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                packageCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');
                    if (filter === 'todos' || categories.includes(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- Lógica del Carrito de Reservas (Común en ambos) ---
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.querySelector('.close-cart-btn');
    const reservationCart = document.getElementById('reservation-cart');
    const reserveBtns = document.querySelectorAll('.btn-reserve');
    const closeConfirmation = document.querySelector('.close-confirmation');
    const modal = document.getElementById('package-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const detailsBtns = document.querySelectorAll('.btn-details');

    // Abrir Carrito
    if (openCartBtn) {
        openCartBtn.addEventListener('click', () => {
            reservationCart.classList.add('open');
        });
    }

    // Cerrar Carrito
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            reservationCart.classList.remove('open');
        });
    }
    
    // Simular reserva y mostrar el mensaje de confirmación (Botones de la tarjeta)
    reserveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            reservationCart.classList.add('open');
            showConfirmationMessage();
        });
    });
    
    // Cierra el mensaje de confirmación al hacer clic en la 'x'
    if (closeConfirmation) {
        closeConfirmation.addEventListener('click', () => {
            document.getElementById('reservation-confirmation').style.display = 'none';
        });
    }

    // --- Lógica del Modal de Detalles (Común en ambos) ---
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const packageId = btn.getAttribute('data-package-id');
            loadModalContent(packageId);
            modal.style.display = 'block';
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Cerrar modal al hacer clic fuera
    if (modal) {
        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // --- Lógica del Acordeón FAQ (MANTENIDO) ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherQuestion = otherItem.querySelector('.faq-question');

                if (otherItem !== item) {
                    otherAnswer.classList.remove('show');
                    otherQuestion.classList.remove('active');
                }
            });

            answer.classList.toggle('show');
            question.classList.toggle('active');
        });
    });
    
    // --- Lógica de Animación (MANTENIDO) ---
    // Smooth scrolling para anchor links (Asegura que el scroll a #contact o #destinos-destacados funcione)
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
    
    // La lógica de IntersectionObserver para la animación fade-in se mantiene al final del archivo.
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