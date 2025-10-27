// js/product-loader.js
class ProductLoader {
    constructor() {
        this.products = {};
        this.ofertas = [];
        this.destacados = [];
    }

    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            const data = await response.json();
            
            // Convertir array a objeto por ID para fácil acceso
            this.products = {};
            data.paquetes.forEach(product => {
                this.products[product.id] = product;
            });
            
            this.ofertas = data.ofertas;
            this.destacados = data.destacados;
            
            console.log('Productos cargados:', this.products);
            return true;
        } catch (error) {
            console.error('Error cargando productos:', error);
            return false;
        }
    }

    getProduct(id) {
        return this.products[id];
    }

    getProductsByCategory(category) {
        return Object.values(this.products).filter(product => 
            product.category === category
        );
    }

    getAllProducts() {
        return Object.values(this.products);
    }

    getOfertas() {
        return this.ofertas.map(id => this.products[id]).filter(Boolean);
    }

    getDestacados() {
        return this.destacados.map(id => this.products[id]).filter(Boolean);
    }

    // Renderizar productos en la página de paquetes
    renderPackagesGrid(container) {
        const products = this.getAllProducts();
        
        container.innerHTML = products.map(product => `
            <div class="package-card" data-category="${product.category}" data-id="${product.id}">
                <div class="package-tag tag-${product.category}">${product.tag}</div>
                <img src="${product.image}" alt="${product.title}" class="package-img">
                <div class="package-content">
                    <h4 class="package-title">${product.title}</h4>
                    <p class="package-location">${product.location}</p>
                    <p class="package-description">${product.description}</p>

                    <div class="package-details-info">
                        <p class="package-info">🗓️ <strong>${product.duration}</strong></p>
                        <p class="package-info">👥 <strong>Hasta ${product.max_personas} personas</strong></p>
                        <p class="package-info">Próxima salida: <strong>${product.nextDeparture}</strong></p>
                    </div>

                    <div class="package-footer">
                        <p class="package-price">
                            DESDE <strong>$${product.price}</strong> <span>por persona</span>
                        </p>
                        <div class="package-actions">
                            <button class="btn btn-details" data-package-id="${product.id}">
                                Detalles
                            </button>
                            <button class="btn btn-reserve" data-package-id="${product.id}">
                                Reservar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Renderizar ofertas en la página principal
    renderOfertas(container) {
        const ofertas = this.getOfertas();
        
        container.innerHTML = ofertas.map(product => `
            <div class="offer-card">
                <div class="offer-tag">20% OFF</div>
                <img src="${product.image}" alt="${product.title}" class="offer-img">
                <div class="offer-content">
                    <h3>${product.title}</h3>
                    <p class="offer-details">${product.description.substring(0, 100)}...</p>
                    <p class="offer-price">Desde <strong>$${product.price}</strong> <em>por persona</em></p>
                    <a href="paquetes.html#${product.id}" class="btn btn-reserve">Ver Oferta</a>
                </div>
            </div>
        `).join('');
    }

    // Renderizar destinos destacados
    renderDestacados(container) {
        const destacados = this.getDestacados();
        
        container.innerHTML = destacados.map(product => `
            <div class="destination-card small-card" style="background-image: url('${product.image}')">
                <div class="card-overlay">
                    <h2>${product.title.split(' ')[0]}</h2>
                    <p>${product.location}</p>
                    <a href="paquetes.html#${product.id}" class="btn card-btn">Ver Detalles</a>
                </div>
            </div>
        `).join('');
    }
}

// Instancia global
const productLoader = new ProductLoader();