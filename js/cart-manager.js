// js/cart-manager.js - VERSIÓN CORREGIDA
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('neotrips_cart')) || [];
        this.init();
    }

    init() {
        this.updateCartUI();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Re-asignar event listeners después de actualizar el UI
        this.setupRemoveListeners();
        
        // Configurar checkout
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-checkout')) {
                e.preventDefault();
                this.proceedToCheckout();
            }
        });
    }

    addToCart(productId, fechaSalida = null, numPersonas = 1) {
        const product = productLoader.getProduct(productId);
        if (!product) {
            console.error('Producto no encontrado:', productId);
            return false;
        }

        // Usar la fecha de salida por defecto si no se proporciona
        const fecha = fechaSalida || product.nextDeparture;
        const personas = parseInt(numPersonas) || 1;

        const cartItem = {
            id: `${productId}-${Date.now()}`,
            productId: productId,
            title: product.title,
            location: product.location,
            image: product.image,
            price: parseInt(product.price),
            fechaSalida: fecha,
            numPersonas: personas,
            subtotal: parseInt(product.price) * personas
        };

        this.cart.push(cartItem);
        this.saveCart();
        this.updateCartUI();
        
        this.showConfirmationMessage(`¡${product.title} agregado al carrito!`);
        return true;
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartUI();
    }

    saveCart() {
        localStorage.setItem('neotrips_cart', JSON.stringify(this.cart));
    }

    getCartTotal() {
        return this.cart.reduce((sum, item) => sum + item.subtotal, 0);
    }

    getTaxes() {
        return this.getCartTotal() * 0.10;
    }

    getGrandTotal() {
        return this.getCartTotal() + this.getTaxes();
    }

    updateCartUI() {
        const cartContent = document.querySelector('.cart-content');
        if (!cartContent) return;

        if (this.cart.length === 0) {
            cartContent.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        } else {
            cartContent.innerHTML = this.cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <p class="item-title">${item.title}</p>
                        <p class="item-info">${item.location}</p>
                        <p class="item-info">${item.fechaSalida}</p>
                        <p class="item-info">${item.numPersonas} persona(s)</p>
                    </div>
                    <div class="item-price">$${item.subtotal.toLocaleString()}</div>
                    <button class="remove-item-btn" data-id="${item.id}">🗑️</button>
                </div>
            `).join('');
        }

        this.updateCartSummary();
        this.updateCartCount();
        this.setupRemoveListeners();
    }

    updateCartSummary() {
        const cartSummary = document.querySelector('.cart-summary');
        if (!cartSummary) return;

        const subtotal = this.getCartTotal();
        const taxes = this.getTaxes();
        const total = this.getGrandTotal();

        cartSummary.innerHTML = `
            <p>Subtotal <span>$${subtotal.toLocaleString()}</span></p>
            <p>Impuestos y tasas <span>$${taxes.toFixed(2)}</span></p>
            <p class="total">Total <span>$${total.toFixed(2)}</span></p>
            <button class="btn btn-checkout" ${this.cart.length === 0 ? 'disabled' : ''}>
                Proceder al Pago
            </button>
        `;

        // Re-asignar event listener al nuevo botón
        const checkoutBtn = cartSummary.querySelector('.btn-checkout');
        if (checkoutBtn && !checkoutBtn.disabled) {
            checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.proceedToCheckout();
            });
        }
    }

    updateCartCount() {
        const openCartBtn = document.getElementById('open-cart-btn');
        if (!openCartBtn) return;

        // Remover contador existente
        const existingCount = openCartBtn.querySelector('.cart-count');
        if (existingCount) {
            existingCount.remove();
        }

        // Agregar nuevo contador si hay items
        if (this.cart.length > 0) {
            const countElement = document.createElement('span');
            countElement.className = 'cart-count';
            countElement.textContent = this.cart.length;
            openCartBtn.style.position = 'relative';
            openCartBtn.appendChild(countElement);
        }
    }

    setupRemoveListeners() {
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.getAttribute('data-id');
                this.removeFromCart(itemId);
            });
        });
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }

        // Mostrar modal de políticas de privacidad
        const privacyModal = document.getElementById('privacy-policy-modal');
        if (privacyModal) {
            privacyModal.style.display = 'block';
        }
    }

    showConfirmationMessage(message) {
        // Crear o actualizar el mensaje de confirmación
        let confirmationMessage = document.getElementById("reservation-confirmation");
        
        if (!confirmationMessage) {
            confirmationMessage = document.createElement('div');
            confirmationMessage.id = "reservation-confirmation";
            confirmationMessage.className = "reservation-confirmation";
            confirmationMessage.innerHTML = `
                <p>${message}</p>
                <div class="close-confirmation">✕</div>
            `;
            document.body.appendChild(confirmationMessage);
            
            // Agregar event listener para cerrar
            confirmationMessage.querySelector('.close-confirmation').addEventListener('click', () => {
                confirmationMessage.style.display = 'none';
            });
        } else {
            confirmationMessage.querySelector("p").textContent = message;
        }
        
        confirmationMessage.style.display = "block";
        setTimeout(() => {
            confirmationMessage.style.display = "none";
        }, 3000);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.showConfirmationMessage('¡Carrito vaciado!');
    }

    // Método para obtener el carrito actual
    getCart() {
        return this.cart;
    }
}

// Instancia global del carrito
const cartManager = new CartManager();