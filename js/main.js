// js/main.js - FUNCIONES COMPLETAS
document.addEventListener("DOMContentLoaded", async function () {
  console.log("Inicializando Neo Trips...");

  // Cargar productos primero
  const success = await productLoader.loadProducts();
  if (!success) {
    console.error("No se pudieron cargar los productos");
    return;
  }

  // Inicializar carrito
  cartManager.updateCartUI();
  console.log("Carrito inicializado:", cartManager.cart);

  // Configurar según la página
  if (document.getElementById("paquetes-turisticos")) {
    console.log("Inicializando página de paquetes...");
    initPaquetesPage();
  } else {
    console.log("Inicializando página principal...");
    initHomePage();
  }

  initCommonFunctionality();
});

function initPaquetesPage() {
  // Renderizar grid de paquetes
  const packagesGrid = document.querySelector(".packages-grid");
  if (packagesGrid) {
    console.log("Renderizando paquetes...");
    productLoader.renderPackagesGrid(packagesGrid);
  } else {
    console.log("No se encontró packages-grid");
  }

  // Configurar filtros
  initFilters();

  // Configurar modales
  initModals();
}

function initHomePage() {
  // Renderizar ofertas
  const offersGrid = document.querySelector(".offers-grid");
  if (offersGrid) {
    console.log("Renderizando ofertas...");
    productLoader.renderOfertas(offersGrid);
  }

  // Renderizar destacados
  const destacadosGrid = document.querySelector(".featured-destinations-grid");
  if (destacadosGrid) {
    console.log("Renderizando destacados...");
    productLoader.renderDestacados(destacadosGrid);
  }
}

function initCommonFunctionality() {
  console.log("Inicializando funcionalidad común...");

  // Carrito
  const openCartBtn = document.getElementById("open-cart-btn");
  const closeCartBtn = document.querySelector(".close-cart-btn");
  const reservationCart = document.getElementById("reservation-cart");

  if (openCartBtn && reservationCart) {
    openCartBtn.addEventListener("click", () => {
      reservationCart.classList.add("open");
    });
  }

  if (closeCartBtn && reservationCart) {
    closeCartBtn.addEventListener("click", () => {
      reservationCart.classList.remove("open");
    });
  }

  // Botones de reserva directos 
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-reserve")) {
      e.preventDefault();
      const packageId = e.target.getAttribute("data-package-id");

      if (packageId) {
        const product = productLoader.getProduct(packageId);
        if (product) {
          cartManager.addToCart(packageId, product.nextDeparture, 1);
          console.log("Producto agregado al carrito:", product.title);
        } else {
          console.error("Producto no encontrado:", packageId);
        }
      }
    }
  });

  // Checkout
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-checkout")) {
      e.preventDefault();
      if (cartManager.cart.length === 0) {
        alert("Tu carrito está vacío");
        return;
      }
      openModal("privacy-policy-modal");
    }
  });

  // FAQ Accordion
  initFAQ();

  // Privacy Modal
  initPrivacyModal();

  // Smooth scrolling
  initSmoothScroll();
}

function initFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const packageCards = document.querySelectorAll(".package-card");

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

function initModals() {
  const detailsBtns = document.querySelectorAll(
    ".btn-details[data-package-id]"
  );
  const modal = document.getElementById("package-modal");
  const closeModalBtn = document.querySelector(".close-modal-btn");

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

  if (modal) {
    window.addEventListener("click", (event) => {
      if (event.target == modal) {
        closeModal("package-modal");
      }
    });
  }
}

// Funciones auxiliares (mantén las que ya tienes)
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

function loadModalContent(packageId) {
  const modalContent = document.getElementById("modal-body-content");
  const product = productLoader.getProduct(packageId);

  if (!product) {
    modalContent.innerHTML = "<p>Detalles del paquete no disponibles.</p>";
    return;
  }

  const inclusionsList = product.inclusions
    .map((item) => `<li>${item}</li>`)
    .join("");

  modalContent.innerHTML = `
        <img src="${product.image}" alt="${
    product.title
  }" class="modal-header-img">
        <div class="modal-details">
            <h4>${product.title}</h4>
            <p class="package-location">${product.location}</p>
            <p class="package-description">${product.description}</p>
            
            <div class="package-details-info modal-details-grid">
                <p class="package-info">Duración: <strong>${
                  product.duration
                }</strong></p>
                <p class="package-info">Grupo: <strong>Hasta ${
                  product.max_personas
                } personas</strong></p>
                <p class="package-info">Próxima salida: <strong>${
                  product.nextDeparture
                }</strong></p>
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
                    <option value="${product.nextDeparture}">${
    product.nextDeparture
  }</option>
                    ${product.disponibilidad
                      .slice(1)
                      .map((date) => `<option value="${date}">${date}</option>`)
                      .join("")}
                </select>
            </div>
            <div class="form-group">
                <label for="num-personas">Número de personas:</label>
                <input type="number" id="num-personas" name="num-personas" value="1" min="1" max="${
                  product.max_personas
                }">
            </div>
            
            <div class="modal-price-total">
                <p class="package-price">Precio por persona: <strong>$${
                  product.price
                }</strong></p>
                <p class="total-price">Total: <strong id="modal-total-price">$${
                  product.price
                }</strong></p>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-details close-modal-btn-inner">Cancelar</button>
                <button class="btn btn-reserve add-to-cart-btn" data-package-id="${packageId}">Agregar al Carrito</button>
            </div>
        </div>
    `;

  // Actualizar precio total cuando cambia el número de personas
  const numPersonasInput = document.getElementById("num-personas");
  const totalPriceElement = document.getElementById("modal-total-price");

  numPersonasInput.addEventListener("change", function () {
    const total = parseInt(product.price) * parseInt(this.value);
    totalPriceElement.textContent = `$${total}`;
  });

  document
    .querySelector(".close-modal-btn-inner")
    .addEventListener("click", () => {
      closeModal("package-modal");
    });

  document.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    const fechaSalida = document.getElementById("fecha-salida").value;
    const numPersonas = document.getElementById("num-personas").value;

    cartManager.addToCart(packageId, fechaSalida, numPersonas);
    closeModal("package-modal");
  });
}

function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (question && answer) {
      question.addEventListener("click", () => {
        faqItems.forEach((otherItem) => {
          const otherAnswer = otherItem.querySelector(".faq-answer");
          const otherQuestion = otherItem.querySelector(".faq-question");

          if (otherItem !== item && otherAnswer && otherQuestion) {
            otherAnswer.classList.remove("show");
            otherQuestion.classList.remove("active");
          }
        });

        answer.classList.toggle("show");
        question.classList.toggle("active");
      });
    }
  });
}

function initPrivacyModal() {
  const privacyModal = document.getElementById("privacy-policy-modal");
  const closePrivacyBtn = document.querySelector(".close-privacy-btn");
  const acceptPrivacyBtn = document.getElementById("accept-privacy-btn");
  const declinePrivacyBtn = document.getElementById("decline-privacy-btn");

  function handlePrivacyAccept() {
    closeModal("privacy-policy-modal");
    const reservationCart = document.getElementById("reservation-cart");
    if (reservationCart) {
      reservationCart.classList.remove("open");
    }

    // Limpiar carrito después del pago exitoso
    cartManager.clearCart();

    cartManager.showConfirmationMessage(
      "¡Pago procesado exitosamente! Recibirás un correo con los detalles de tu reserva."
    );
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
}

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
