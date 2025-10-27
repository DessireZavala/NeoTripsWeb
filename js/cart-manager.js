// js/cart-manager.js
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('neotrips_cart')) || [];
    }

    addToCart(productId, fechaSalida, numPersonas) {
        const product = productLoader.getProduct(productId);
        if (!product) {
            console.error('Producto no encontrado:', productId);
            return false;
        }

        const cartItem = {
            id: `${productId}-${Date.now()}`,
            productId: productId,
            title: product.title,
            location: product.location,
            image: product.image,
            price: parseInt(product.price),
            fechaSalida: fechaSalida,
            numPersonas: parseInt(numPersonas),
            subtotal: parseInt(product.price) * parseInt(numPersonas)
        };

        this.cart.push(cartItem);
        this.saveCart();
        this.updateCartUI();
        
        // Mostrar confirmación
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
        return this.getCartTotal() * 0.10; // 10% impuestos
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
                    <div class="item-price">$${item.subtotal}</div>
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

        cartSummary.innerHTML = `
            <p>Subtotal <span>$${this.getCartTotal()}</span></p>
            <p>Impuestos y tasas <span>$${this.getTaxes().toFixed(2)}</span></p>
            <p class="total">Total <span>$${this.getGrandTotal().toFixed(2)}</span></p>
            <button class="btn btn-checkout" ${this.cart.length === 0 ? 'disabled' : ''}>
                Proceder al Pago
            </button>
        `;
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const openCartBtn = document.getElementById('open-cart-btn');
        
        if (this.cart.length > 0) {
            if (!cartCount && openCartBtn) {
                const countElement = document.createElement('span');
                countElement.className = 'cart-count';
                countElement.textContent = this.cart.length;
                openCartBtn.style.position = 'relative';
                openCartBtn.appendChild(countElement);
            } else if (cartCount) {
                cartCount.textContent = this.cart.length;
            }
        } else {
            const existingCount = document.querySelector('.cart-count');
            if (existingCount) {
                existingCount.remove();
            }
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

    showConfirmationMessage(message) {
        const confirmationMessage = document.getElementById("reservation-confirmation");
        if (confirmationMessage) {
            confirmationMessage.querySelector("p").textContent = message;
            confirmationMessage.style.display = "block";
            setTimeout(() => {
                confirmationMessage.style.display = "none";
            }, 5000);
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
    }
}

// Instancia global
const cartManager = new CartManager();