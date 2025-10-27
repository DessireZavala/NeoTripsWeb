// --- DATOS DEL PAQUETE PARA EL MODAL ---
const packageData = {
  ny: {
    title: "Nueva York Vibrante",
    location: "Nueva York, USA",
    tag: "Ciudad",
    image: "assets/newyork.jpg",
    description: "La ciudad que nunca duerme te espera con sus rascacielos icónicos, Broadway y la Estatua de la Libertad.",
    price: "2199",
    duration: "6 días / 5 noches",
    group: "Máx. 4 personas",
    nextDeparture: "8 Nov 2025",
    inclusions: ["Vuelos ida y vuelta", "Hotel en Manhattan", "City Pass NYC", "Tour contrastado", "Ferry a Estatua Libertad", "Show de Broadway"],
  },
  santorini: {
    title: "Santorini al Atardecer",
    location: "Santorini, Grecia",
    tag: "Playa",
    image: "assets/santorini.jpg",
    description: "Vive la magia de las puestas de sol más espectaculares de las islas griegas.",
    price: "1799",
    duration: "7 días / 6 noches",
    group: "Hasta 4 personas",
    nextDeparture: "14 Nov 2025",
    inclusions: ["Vuelos ida y vuelta", "Estancia en Oia con piscina privada", "Desayunos y cenas incluidos", "Paseo en barco por la caldera", "Tour de degustación de vinos locales"],
  },
  caribe: {
    title: "Paraíso Caribeño",
    location: "Caribe Mexicano",
    tag: "Playa",
    image: "assets/paraiso caribeño.jpg",
    description: "Relájate en las playas de arena blanca y aguas turquesas del Caribe.",
    price: "1299",
    duration: "7 días / 6 noches",
    group: "Hasta 4 personas",
    nextDeparture: "15 Nov 2025",
    inclusions: ["Vuelos y traslados", "Estancia en resort 5 estrellas todo incluido", "Actividades acuáticas no motorizadas", "Cenas temáticas ilimitadas"],
  },
  machu: {
    title: "Machu Picchu Místico",
    location: "Machu Picchu, Perú",
    tag: "Aventura",
    image: "assets/machupichu.jpg",
    description: "Descubre la majestuosa ciudadela inca.",
    price: "1599",
    duration: "8 días / 7 noches",
    group: "Hasta 8 personas",
    nextDeparture: "12 Nov 2025",
    inclusions: ["Vuelos y tren a Aguas Calientes", "Guía bilingüe experto", "Entrada a Machu Picchu", "Alojamiento en Cusco y Aguas Calientes"],
  },
  dubai: {
    title: "Dubai Lujoso",
    location: "Dubai, UAE",
    tag: "Ciudad",
    image: "assets/dubai.jpg",
    description: "Experimenta el lujo y la modernidad de Dubai.",
    price: "2299",
    duration: "6 días / 5 noches",
    group: "Hasta 4 personas",
    nextDeparture: "18 Nov 2025",
    inclusions: ["Vuelos y hotel de lujo", "Tour por el Burj Khalifa", "Safari por el desierto", "Traslados privados"],
  },
  tokyo: {
    title: "Tokyo Moderno",
    location: "Tokyo, Japón",
    tag: "Ciudad",
    image: "assets/tokio.jpg",
    description: "Sumérgete en la cultura japonesa.",
    price: "2499",
    duration: "10 días / 9 noches",
    group: "Hasta 6 personas",
    nextDeparture: "5 Nov 2025",
    inclusions: ["Vuelos y Japan Rail Pass", "Alojamiento en hoteles boutique", "Tour guiado por barrios de Tokyo"],
  },
  paris: {
    title: "París Romántico",
    location: "París, Francia",
    tag: "Ciudad",
    image: "assets/paris.jpg",
    description: "Descubre la Ciudad de la Luz.",
    price: "2399",
    duration: "7 días / 6 noches",
    group: "Hasta 4 personas",
    nextDeparture: "20 Nov 2025",
    inclusions: ["Vuelos ida y vuelta", "Hotel en el centro de París", "Paseo en barco por el Sena", "Entrada a la Torre Eiffel", "Tour guiado por Montmartre y Louvre", "Desayunos incluidos"],
  },
  bali: {
    title: "Bali Exótico",
    location: "Bali, Indonesia",
    tag: "Playa",
    image: "assets/bali.jpg",
    description: "Vive una experiencia única entre templos sagrados y playas paradisíacas.",
    price: "1899",
    duration: "8 días / 7 noches",
    group: "Hasta 4 personas",
    nextDeparture: "22 Nov 2025",
    inclusions: ["Vuelos y traslados", "Resort frente al mar con desayuno incluido", "Tour a templos y arrozales de Ubud", "Clase de yoga y spa tradicional", "Excursión en barco a islas cercanas"],
  }
};

// --- CARRITO DE COMPRAS ---
let cart = JSON.parse(localStorage.getItem('neotrips_cart')) || [];

// --- FUNCIONES DEL CARRITO ---
function addToCart(packageId, fechaSalida, numPersonas) {
  const package = packageData[packageId];
  if (!package) return;

  const cartItem = {
    id: `${packageId}-${Date.now()}`,
    packageId: packageId,
    title: package.title,
    location: package.location,
    image: package.image,
    price: parseInt(package.price),
    fechaSalida: fechaSalida,
    numPersonas: parseInt(numPersonas),
    subtotal: parseInt(package.price) * parseInt(numPersonas)
  };

  cart.push(cartItem);
  saveCart();
  updateCartUI();
  showConfirmationMessage(`¡${package.title} agregado al carrito!`);
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('neotrips_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartContent = document.querySelector('.cart-content');
  const cartSummary = document.querySelector('.cart-summary');
  
  if (!cartContent) return;

  // Actualizar contenido del carrito
  if (cart.length === 0) {
    cartContent.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
  } else {
    cartContent.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-details">
          <p class="item-title">${item.title}</p>
          <p class="item-info">${item.location}</p>
          <p class="item-info">${item.fechaSalida}</p>
          <p class="item-info">${item.numPersonas} persona(s)</p>
        </div>
        <div class="item-price">$${item.subtotal}</div>
        <button class="remove-item-btn" data-id="${item.id}">🗑️</button>
      </div>
    `).join('');
  }

  // Actualizar contador del carrito
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.textContent = cart.length;
  } else if (cart.length > 0) {
    // Crear contador si no existe
    const openCartBtn = document.getElementById('open-cart-btn');
    if (openCartBtn) {
      const countElement = document.createElement('span');
      countElement.className = 'cart-count';
      countElement.textContent = cart.length;
      openCartBtn.style.position = 'relative';
      openCartBtn.appendChild(countElement);
    }
  } else {
    // Eliminar contador si está vacío
    const existingCount = document.querySelector('.cart-count');
    if (existingCount) {
      existingCount.remove();
    }
  }

  // Actualizar resumen
  if (cartSummary) {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const taxes = subtotal * 0.10; // 10% de impuestos
    const total = subtotal + taxes;

    cartSummary.innerHTML = `
      <p>Subtotal <span>$${subtotal}</span></p>
      <p>Impuestos y tasas <span>$${taxes.toFixed(2)}</span></p>
      <p class="total">Total <span>$${total.toFixed(2)}</span></p>
      <button class="btn btn-checkout" ${cart.length === 0 ? 'disabled' : ''}>Proceder al Pago</button>
    `;
  }

  // Agregar event listeners a los botones de eliminar
  document.querySelectorAll('.remove-item-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.target.getAttribute('data-id');
      removeFromCart(itemId);
    });
  });
}

// --- FUNCIONES AUXILIARES ---
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

function showConfirmationMessage(message = "¡Reserva confirmada! Recibirás un correo con los detalles de tu viaje.") {
  const confirmationMessage = document.getElementById("reservation-confirmation");
  if (confirmationMessage) {
    confirmationMessage.querySelector("p").textContent = message;
    confirmationMessage.style.display = "block";
    setTimeout(() => {
      confirmationMessage.style.display = "none";
    }, 5000);
  }
}

// --- Lógica de la Modal de Detalles ---
function loadModalContent(packageId) {
  const modalContent = document.getElementById("modal-body-content");
  const data = packageData[packageId];
  if (!data) {
    modalContent.innerHTML = "<p>Detalles del paquete no disponibles.</p>";
    return;
  }

  const inclusionsList = data.inclusions.map(item => `<li>${item}</li>`).join("");

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
          <option value="${data.nextDeparture}">${data.nextDeparture}</option>
          <option value="1 Mar 2026">1 Mar 2026</option>
          <option value="15 Abr 2026">15 Abr 2026</option>
        </select>
      </div>
      <div class="form-group">
        <label for="num-personas">Número de personas:</label>
        <input type="number" id="num-personas" name="num-personas" value="1" min="1" max="10">
      </div>
      
      <div class="modal-price-total">
        <p class="package-price">Precio por persona: <strong>$${data.price}</strong></p>
        <p class="total-price">Total: <strong id="modal-total-price">$${data.price}</strong></p>
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-details close-modal-btn-inner">Cancelar</button>
        <button class="btn btn-reserve add-to-cart-btn" data-package-id="${packageId}">Agregar al Carrito</button>
      </div>
    </div>
  `;

  // Actualizar precio total cuando cambia el número de personas
  const numPersonasInput = document.getElementById('num-personas');
  const totalPriceElement = document.getElementById('modal-total-price');
  
  numPersonasInput.addEventListener('change', function() {
    const total = parseInt(data.price) * parseInt(this.value);
    totalPriceElement.textContent = `$${total}`;
  });

  document.querySelector(".close-modal-btn-inner").addEventListener("click", () => {
    closeModal("package-modal");
  });

  document.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    const fechaSalida = document.getElementById('fecha-salida').value;
    const numPersonas = document.getElementById('num-personas').value;
    
    addToCart(packageId, fechaSalida, numPersonas);
    closeModal("package-modal");
  });
}

// --- INICIALIZACIÓN AL CARGAR LA PÁGINA ---
document.addEventListener("DOMContentLoaded", function () {
  // Inicializar carrito
  updateCartUI();

  // --- Lógica de Filtros de Paquetes ---
  const filterButtons = document.querySelectorAll(".filter-btn");
  const packageCards = document.querySelectorAll(".package-card");

  if (filterButtons.length > 0 && packageCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const filter = this.getAttribute("data-filter");
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        packageCards.forEach((card) => {
          const categories = card.getAttribute("data-category").split(" ");
          if (filter === "todos" || categories.includes(filter)) {
            card.style.display = "block";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // --- Lógica del Carrito de Reservas ---
  const openCartBtn = document.getElementById("open-cart-btn");
  const closeCartBtn = document.querySelector(".close-cart-btn");
  const reservationCart = document.getElementById("reservation-cart");

  // Abrir Carrito
  if (openCartBtn) {
    openCartBtn.addEventListener("click", () => {
      reservationCart.classList.add("open");
    });
  }

  // Cerrar Carrito
  if (closeCartBtn) {
    closeCartBtn.addEventListener("click", () => {
      reservationCart.classList.remove("open");
    });
  }

  // Botones "Reservar" directos (sin modal)
  document.querySelectorAll('.btn-reserve:not([data-package-id])').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const packageCard = btn.closest('.package-card');
      const packageId = packageCard.getAttribute('data-id');
      const package = packageData[packageId];
      
      if (package) {
        addToCart(packageId, package.nextDeparture, 1);
      }
    });
  });

  // Cierra el mensaje de confirmación
  const closeConfirmation = document.querySelector(".close-confirmation");
  if (closeConfirmation) {
    closeConfirmation.addEventListener("click", () => {
      document.getElementById("reservation-confirmation").style.display = "none";
    });
  }

  // --- Lógica del Modal de Detalles ---
  const modal = document.getElementById("package-modal");
  const closeModalBtn = document.querySelector(".close-modal-btn");
  const detailsBtns = document.querySelectorAll(".btn-details[data-package-id]");

  detailsBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const packageId = btn.getAttribute("data-package-id");
      loadModalContent(packageId);
      openModal("package-modal");
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      closeModal("package-modal");
    });
  }

  // Cerrar modal al hacer clic fuera
  if (modal) {
    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        closeModal("package-modal");
      }
    });
  }

  // --- Botón de checkout del carrito ---
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-checkout')) {
      e.preventDefault();
      
      if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
      }

      // Determinar qué modal abrir según la página
      const isPaquetesPage = window.location.pathname.includes("paquetes.html");
      const modalId = isPaquetesPage ? "privacy-policy-modal" : "privacy-policy-modal";
      
      openModal(modalId);
    }
  });

  // --- Lógica del Acordeón FAQ ---
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      faqItems.forEach((otherItem) => {
        const otherAnswer = otherItem.querySelector(".faq-answer");
        const otherQuestion = otherItem.querySelector(".faq-question");

        if (otherItem !== item) {
          otherAnswer.classList.remove("show");
          otherQuestion.classList.remove("active");
        }
      });

      answer.classList.toggle("show");
      question.classList.toggle("active");
    });
  });

  // --- Lógica del Modal de Aviso de Privacidad ---
  const privacyModal = document.getElementById("privacy-policy-modal");
  const closePrivacyBtn = document.querySelector(".close-privacy-btn");
  const acceptPrivacyBtn = document.getElementById("accept-privacy-btn");
  const declinePrivacyBtn = document.getElementById("decline-privacy-btn");

  function handlePrivacyAccept() {
    closeModal("privacy-policy-modal");
    if (reservationCart) {
      reservationCart.classList.remove("open");
    }
    
    // Limpiar carrito después del pago exitoso
    cart = [];
    saveCart();
    updateCartUI();
    
    showConfirmationMessage("¡Pago procesado exitosamente! Recibirás un correo con los detalles de tu reserva.");
  }

  if (privacyModal) {
    const closePrivacyModal = () => closeModal("privacy-policy-modal");

    if (closePrivacyBtn) {
      closePrivacyBtn.addEventListener("click", closePrivacyModal);
    }
    if (declinePrivacyBtn) {
      declinePrivacyBtn.addEventListener("click", closePrivacyModal);
    }
    if (acceptPrivacyBtn) {
      acceptPrivacyBtn.addEventListener("click", handlePrivacyAccept);
    }

    window.addEventListener("click", (event) => {
      if (event.target == privacyModal) {
        closePrivacyModal();
      }
    });
  }

  // --- Enlaces del Footer ---
  const privacyLinkFooter = document.getElementById("privacy-link-footer");
  const termsLink = document.getElementById("terms-link-footer");
  const cancellationLink = document.getElementById("cancellation-link-footer");

  if (privacyLinkFooter) {
    privacyLinkFooter.addEventListener("click", function (e) {
      e.preventDefault();
      openModal("privacy-policy-modal");
    });
  }

  if (termsLink) {
    termsLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Sin alerta - funcionalidad futura
    });
  }

  if (cancellationLink) {
    cancellationLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Sin alerta - funcionalidad futura
    });
  }

  // --- Smooth scrolling ---
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

  // --- Animaciones ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.classList.add("fade-in");
    observer.observe(section);
  });
});