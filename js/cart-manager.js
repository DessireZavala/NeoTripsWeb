// js/cart-manager.js - VERSIÓN COMPLETA Y CORREGIDA CON MERCADO PAGO BRICK

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
        // Solo re-asignar listeners de remoción (el checkout es dinámico)
        this.setupRemoveListeners();
    }

    addToCart(productId, fechaSalida = null, numPersonas = 1) {
        // Asumiendo que 'productLoader' está cargado globalmente
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
            // Precio debe ser un número limpio (ya validado en product-loader.js)
            price: product.price, 
            fechaSalida: fecha,
            numPersonas: personas,
            subtotal: product.price * personas
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
            
            <div id="walletBrick_container"></div> 
        `;

        // Llama a la función de renderizado del Brick DESPUÉS de actualizar el HTML
        this.renderMercadoPagoBrick(); 
    }

    updateCartCount() {
        const openCartBtn = document.getElementById('open-cart-btn');
        if (!openCartBtn) return;

        // Limpiar el contador existente primero
        const existingCount = openCartBtn.querySelector('.cart-count');
        if (existingCount) {
            existingCount.remove();
        }

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

    // 🛑 MÉTODO PARA RENDERIZAR EL WALLET BRICK DE MERCADO PAGO
    async renderMercadoPagoBrick() {
        // Asegura que el SDK está disponible globalmente
        if (typeof mp === 'undefined' || typeof bricksBuilder === 'undefined') {
            console.error("SDK de Mercado Pago no inicializado (mp y bricksBuilder)");
            return;
        }

        const container = document.getElementById("walletBrick_container");
        if (!container) return;

        container.innerHTML = ''; // Limpiar el contenedor antes de renderizar
        
        if (this.cart.length === 0) {
            // Mostrar un botón deshabilitado si el carrito está vacío
            container.innerHTML = `<button class="btn btn-checkout" disabled>Proceder al Pago</button>`;
            return;
        }
        
        // 1. LLAMADA CRÍTICA AL BACKEND PARA GENERAR PREFERENCIA
        let preferenceId = null;
        try {
            // Envía los detalles de los ítems al servidor (puerto 3000)
            const response = await fetch('http://localhost:3000/create_preference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cart: this.cart })
            });
            
            const data = await response.json();

            if (response.ok) {
                preferenceId = data.preferenceId;
            } else {
                console.error('Error del servidor al crear preferencia:', data.error);
                // Muestra el error de Mercado Pago (ej: "Producto no disponible")
                container.innerHTML = `<p style="color: red; font-size: 0.9rem; text-align: center;">❌ Error: ${data.error}</p>`;
                return;
            }

        } catch (error) {
            console.error('Fallo en la conexión al backend:', error);
            // Muestra un error si Node.js no está corriendo
            container.innerHTML = `<p style="color: red; font-size: 0.9rem; text-align: center;">🔌 No se pudo conectar al servidor de pagos (¿Está corriendo en el puerto 3000?).</p>`;
            return;
        }
        
        // 2. RENDERIZAR EL BRICK CON EL ID OBTENIDO
        try {
            await bricksBuilder.create("wallet", "walletBrick_container", {
                initialization: {
                    preferenceId: preferenceId,
                },
                customization: {
                    texts: {
                        valueProp: 'smart_option' 
                    },
                    visual: {
                        buttonBackground: 'solid',
                        borderRadius: '8px'
                    }
                }
            });
        } catch (error) {
            console.error('Error al renderizar Wallet Brick:', error);
        }
    }

    showConfirmationMessage(message) {
        // ... (código para mostrar mensajes de confirmación) ...
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

    getCart() {
        return this.cart;
    }
}

// Instancia global del carrito
const cartManager = new CartManager();