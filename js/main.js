// js/main.js - VERSIÓN COMPLETA Y CORREGIDA
document.addEventListener("DOMContentLoaded", async function () {
    console.log('🚀 Inicializando Neo Trips...');
    
    try {
        // Cargar productos primero
        await productLoader.loadProducts();
        console.log('✅ Productos cargados exitosamente');
        
        // Inicializar carrito
        cartManager.updateCartUI();
        console.log('✅ Carrito inicializado');

        // Configurar según la página
        if (document.getElementById('paquetes-turisticos')) {
            console.log('📄 Inicializando página de paquetes...');
            initPaquetesPage();
        } else {
            console.log('🏠 Inicializando página de inicio...');
            initHomePage();
        }

        initCommonFunctionality();
        console.log('✅ Todas las funcionalidades inicializadas');
        
    } catch (error) {
        console.error('❌ Error durante la inicialización:', error);
    }
});

function initCommonFunctionality() {
    console.log('🔧 Inicializando funcionalidades comunes...');
    
    initCartFunctionality();
    initReserveButtons();
    initCheckout();
    initFAQ();
    initPrivacyModal();
    initSmoothScroll();
    initModalCloseButtons();
}

// FUNCIÓN ESPECÍFICA PARA EL CARRITO
function initCartFunctionality() {
    const openCartBtn = document.getElementById("open-cart-btn");
    const closeCartBtn = document.querySelector(".close-cart-btn");
    const reservationCart = document.getElementById("reservation-cart");

    if (openCartBtn && reservationCart) {
        openCartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            reservationCart.classList.add("open");
            console.log('🛒 Carrito abierto');
        });
    }

    if (closeCartBtn && reservationCart) {
        closeCartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            reservationCart.classList.remove("open");
            console.log('🛒 Carrito cerrado');
        });
    }

    // Cerrar al hacer click fuera del carrito
    document.addEventListener('click', (e) => {
        if (reservationCart && 
            !reservationCart.contains(e.target) && 
            openCartBtn && 
            !openCartBtn.contains(e.target) &&
            reservationCart.classList.contains("open")) {
            reservationCart.classList.remove("open");
        }
    });
}

// FUNCIÓN ESPECÍFICA PARA BOTONES RESERVAR
function initReserveButtons() {
    console.log('🔄 Inicializando botones de reserva...');
    
    // Para botones en tarjetas de paquetes
    document.addEventListener('click', function(e) {
        const reserveBtn = e.target.closest('.btn-reserve');
        
        if (reserveBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            let packageId = reserveBtn.getAttribute('data-package-id');
            
            // Si no tiene data-package-id, buscar en el padre
            if (!packageId) {
                const packageCard = reserveBtn.closest('.package-card');
                if (packageCard) {
                    packageId = packageCard.getAttribute('data-id');
                }
            }
            
            console.log('📦 Reservando paquete:', packageId);
            
            if (packageId && productLoader.getProduct(packageId)) {
                // Agregar directamente al carrito con valores por defecto
                const success = cartManager.addToCart(packageId);
                
                if (success) {
                    // Abrir el carrito automáticamente después de agregar
                    const reservationCart = document.getElementById("reservation-cart");
                    if (reservationCart) {
                        reservationCart.classList.add("open");
                    }
                }
            } else {
                console.error('❌ No se pudo encontrar el producto:', packageId);
                alert('Error: Producto no disponible. Por favor intenta más tarde.');
            }
        }
    });

    // Para botones en ofertas
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-reserve') && e.target.href) {
            const href = e.target.getAttribute('href');
            if (href.includes('paquetes.html#')) {
                e.preventDefault();
                const packageId = href.split('#')[1];
                console.log('🎯 Navegando a paquete:', packageId);
                window.location.href = `paquetes.html#${packageId}`;
            }
        }
    });
}

// FUNCIÓN ESPECÍFICA PARA CHECKOUT
function initCheckout() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-checkout')) {
            e.preventDefault();
            e.stopPropagation();
            
            if (cartManager.cart.length === 0) {
                alert('🛒 Tu carrito está vacío');
                return;
            }
            
            console.log('💳 Procediendo al pago...');
            openModal("privacy-policy-modal");
        }
    });
}

// FUNCIONES AUXILIARES PARA MODALES
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
        console.log('📱 Modal abierto:', modalId);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        console.log('📱 Modal cerrado:', modalId);
    }
}

function initModalCloseButtons() {
    // Cerrar modales al hacer click fuera
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="display: block"]');
            openModals.forEach(modal => closeModal(modal.id));
        }
    });
}

// CARGAR CONTENIDO DEL MODAL DE DETALLES
function loadModalContent(packageId) {
    const modalContent = document.getElementById("modal-body-content");
    const product = productLoader.getProduct(packageId);
    
    if (!product) {
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3>❌ Producto no disponible</h3>
                <p>Lo sentimos, este paquete no está disponible en este momento.</p>
            </div>
        `;
        return;
    }

    const inclusionsList = product.inclusions ? 
        product.inclusions.map(item => `<li>${item}</li>`).join("") : 
        '<li>Detalles no disponibles</li>';

    const disponibilidadOptions = product.disponibilidad && product.disponibilidad.length > 0 ? 
        product.disponibilidad.map(date => `<option value="${date}">${date}</option>`).join('') : 
        `<option value="${product.nextDeparture}">${product.nextDeparture}</option>`;

    modalContent.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="modal-header-img">
        <div class="modal-details">
            <h4>${product.title}</h4>
            <p class="package-location">${product.location}</p>
            <p class="package-description">${product.description}</p>
            
            <div class="package-details-info modal-details-grid">
                <p class="package-info"><strong>${product.duration || 'No especificado'}</strong></p>
                <p class="package-info"><strong>Hasta ${product.max_personas || 2} personas</strong></p>
                <p class="package-info">Próxima salida: <strong>${product.nextDeparture || 'Por confirmar'}</strong></p>
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
                    ${disponibilidadOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="num-personas">Número de personas:</label>
                <input type="number" id="num-personas" name="num-personas" value="1" min="1" max="${product.max_personas || 10}">
            </div>
            
            <div class="modal-price-total">
                <p class="package-price">Precio por persona: <strong>$${product.price}</strong></p>
                <p class="total-price">Total: <strong id="modal-total-price">$${product.price}</strong></p>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-details close-modal-btn-inner">Cancelar</button>
                <button class="btn btn-reserve add-to-cart-btn" data-package-id="${packageId}">
                    🛒 Agregar al Carrito
                </button>
            </div>
        </div>
    `;

    // Actualizar precio total cuando cambia el número de personas
    const numPersonasInput = document.getElementById('num-personas');
    const totalPriceElement = document.getElementById('modal-total-price');
    
    if (numPersonasInput && totalPriceElement) {
        numPersonasInput.addEventListener('change', function() {
            const total = parseInt(product.price) * parseInt(this.value);
            totalPriceElement.textContent = `$${total}`;
        });
    }

    // Event listeners para los botones del modal
    const closeBtn = modalContent.querySelector(".close-modal-btn-inner");
    const addToCartBtn = modalContent.querySelector(".add-to-cart-btn");

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            closeModal("package-modal");
        });
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            const fechaSalida = document.getElementById('fecha-salida')?.value || product.nextDeparture;
            const numPersonas = document.getElementById('num-personas')?.value || 1;
            
            cartManager.addToCart(packageId, fechaSalida, numPersonas);
            closeModal("package-modal");
        });
    }
}

// FAQ ACCORDION
function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    
    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (question && answer) {
            question.addEventListener("click", () => {
                // Cerrar otras respuestas
                faqItems.forEach((otherItem) => {
                    const otherAnswer = otherItem.querySelector(".faq-answer");
                    const otherQuestion = otherItem.querySelector(".faq-question");

                    if (otherItem !== item && otherAnswer && otherQuestion) {
                        otherAnswer.classList.remove("show");
                        otherQuestion.classList.remove("active");
                    }
                });

                // Alternar respuesta actual
                answer.classList.toggle("show");
                question.classList.toggle("active");
            });
        }
    });
}

// MODAL DE POLÍTICAS DE PRIVACIDAD
function initPrivacyModal() {
    const privacyModal = document.getElementById("privacy-policy-modal");
    const closePrivacyBtn = document.querySelector(".close-privacy-btn");
    const acceptPrivacyBtn = document.getElementById("accept-privacy-btn");
    const declinePrivacyBtn = document.getElementById("decline-privacy-btn");
    const privacyLinkFooter = document.getElementById("privacy-link-footer");

    function handlePrivacyAccept() {
        closeModal("privacy-policy-modal");
        
        const reservationCart = document.getElementById("reservation-cart");
        if (reservationCart) {
            reservationCart.classList.remove("open");
        }
        
        cartManager.clearCart();
        cartManager.showConfirmationMessage("¡Pago procesado exitosamente! Recibirás un correo con los detalles de tu reserva.");
        
        console.log('💳 Pago procesado - Carrito limpiado');
    }

    // Abrir modal desde footer
    if (privacyLinkFooter) {
        privacyLinkFooter.addEventListener("click", (e) => {
            e.preventDefault();
            openModal("privacy-policy-modal");
        });
    }

    // Botones del modal de privacidad
    if (closePrivacyBtn) {
        closePrivacyBtn.addEventListener("click", () => closeModal("privacy-policy-modal"));
    }
    
    if (declinePrivacyBtn) {
        declinePrivacyBtn.addEventListener("click", () => closeModal("privacy-policy-modal"));
    }
    
    if (acceptPrivacyBtn) {
        acceptPrivacyBtn.addEventListener("click", handlePrivacyAccept);
    }
}

// SCROLL SUAVE
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: "smooth",
                });
            }
        });
    });
}

// INICIALIZACIÓN DE PÁGINA DE PAQUETES
function initPaquetesPage() {
    const packagesGrid = document.querySelector('.packages-grid');
    if (packagesGrid) {
        productLoader.renderPackagesGrid(packagesGrid);
        console.log('Grid de paquetes renderizado');
    }

    initFilters();
    initModals();
    
    // Scroll a un paquete específico si hay hash en la URL
    const hash = window.location.hash.substring(1);
    if (hash && productLoader.getProduct(hash)) {
        setTimeout(() => {
            const element = document.querySelector(`[data-id="${hash}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.style.boxShadow = '0 0 0 3px var(--amarillo-dorado)';
                setTimeout(() => element.style.boxShadow = '', 2000);
            }
        }, 500);
    }
}

// INICIALIZACIÓN DE PÁGINA DE INICIO
function initHomePage() {
    const offersGrid = document.querySelector('.offers-grid');
    if (offersGrid) {
        productLoader.renderOfertas(offersGrid);
        console.log('Ofertas renderizadas');
    }

    const destacadosGrid = document.querySelector('.featured-destinations-grid');
    if (destacadosGrid) {
        productLoader.renderDestacados(destacadosGrid);
        console.log('Destacados renderizados');
    }
}

// FILTROS DE CATEGORÍAS
function initFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    let packageCards = document.querySelectorAll(".package-card");

    filterButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const filter = this.getAttribute("data-filter");
            
            // Actualizar botones activos
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");

            // Re-seleccionar las tarjetas (pueden haber cambiado después del render)
            packageCards = document.querySelectorAll(".package-card");
            
            // Aplicar filtro
            packageCards.forEach((card) => {
                const categories = card.getAttribute("data-category").split(" ");
                if (filter === "todos" || categories.includes(filter)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
            
            console.log(`🔍 Filtro aplicado: ${filter}`);
        });
    });
}

// MODALES DE DETALLES
function initModals() {
    const modal = document.getElementById("package-modal");
    const closeModalBtn = document.querySelector(".close-modal-btn");

    // Event delegation para botones de detalles
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-details') || e.target.closest('.btn-details')) {
            const btn = e.target.classList.contains('btn-details') ? e.target : e.target.closest('.btn-details');
            const packageId = btn.getAttribute('data-package-id');
            
            if (packageId) {
                loadModalContent(packageId);
                openModal("package-modal");
            }
        }
    });

    // Cerrar modal con botón X
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            closeModal("package-modal");
        });
    }
}

// MANEJO DE ERRORES GLOBALES
window.addEventListener('error', function(e) {
    console.error('Error global capturado:', e.error);
});

// EXPORTAR FUNCIONES PARA USO GLOBAL (si es necesario)
window.openModal = openModal;
window.closeModal = closeModal;
window.loadModalContent = loadModalContent;