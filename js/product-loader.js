// js/product-loader.js - VERSIÓN COMPLETA Y CORREGIDA
class ProductLoader {
    constructor() {
        this.products = {};
        this.ofertas = [];
        this.destacados = [];
        this.isLoaded = false;
    }

    async loadProducts() {
        try {
            console.log('📥 Cargando productos desde data/products.json...');
            const response = await fetch('data/products.json');
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Validar estructura de datos
            if (!data.paquetes || !Array.isArray(data.paquetes)) {
                throw new Error('Estructura de datos inválida: falta array "paquetes"');
            }
            
            // Convertir array a objeto por ID para fácil acceso
            this.products = {};
            data.paquetes.forEach(product => {
                if (product.id && product.title) {
                    this.products[product.id] = this.validateProduct(product);
                } else {
                    console.warn('⚠️ Producto inválido omitido:', product);
                }
            });
            
            this.ofertas = data.ofertas || [];
            this.destacados = data.destacados || [];
            this.isLoaded = true;
            
            console.log(`✅ Productos cargados: ${Object.keys(this.products).length} paquetes, ${this.ofertas.length} ofertas, ${this.destacados.length} destacados`);
            return true;
            
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            this.loadFallbackData();
            return false;
        }
    }

    validateProduct(product) {
        // Asegurar que el producto tenga todos los campos necesarios
        return {
            id: product.id,
            title: product.title || 'Título no disponible',
            location: product.location || 'Ubicación no especificada',
            category: product.category || 'general',
            price: parseInt(product.price) || 0,
            image: product.image || 'assets/placeholder.jpg',
            duration: product.duration || 'Duración no especificada',
            max_personas: parseInt(product.max_personas) || 2,
            description: product.description || 'Descripción no disponible.',
            inclusions: Array.isArray(product.inclusions) ? product.inclusions : ['Servicios no especificados'],
            disponibilidad: Array.isArray(product.disponibilidad) ? product.disponibilidad : [product.nextDeparture || 'Fecha por confirmar'],
            tag: product.tag || this.getTagFromCategory(product.category),
            nextDeparture: product.nextDeparture || 'Por confirmar'
        };
    }

    getTagFromCategory(category) {
        const tagMap = {
            'playa': 'Playa',
            'ciudad': 'Ciudad', 
            'aventura': 'Aventura',
            'cultural': 'Cultural'
        };
        return tagMap[category] || 'Viaje';
    }

    loadFallbackData() {
        console.log('🔄 Cargando datos de respaldo...');
        
        // Datos básicos de respaldo para que la aplicación funcione
        this.products = {
            "caribe": {
                id: "caribe",
                title: "Paraíso Caribeño",
                location: "Caribe Mexicano",
                category: "playa",
                price: 1299,
                image: "assets/paraiso caribeño.jpg",
                duration: "7 días / 6 noches",
                max_personas: 4,
                description: "Disfruta de las playas más hermosas del Caribe mexicano con todo incluido. Resort de lujo con acceso privado a la playa.",
                inclusions: ["Vuelos redondos", "Hotel 5 estrellas", "Alimentación todo incluido", "Tours y actividades", "Transporte aeropuerto-hotel"],
                disponibilidad: ["2025-11-15", "2025-12-18"],
                tag: "Playa",
                nextDeparture: "15 Nov 2025"
            },
            "santorini": {
                id: "santorini",
                title: "Santorini al Atardecer",
                location: "Santorini, Grecia", 
                category: "playa",
                price: 1799,
                image: "assets/santorini.jpg",
                duration: "7 días / 6 noches",
                max_personas: 4,
                description: "Vive la magia de las puestas de sol más espectaculares de las islas griegas con sus casas blancas y vistas al mar Egeo.",
                inclusions: ["Vuelos ida y vuelta", "Estancia en Oia", "Desayunos incluidos", "Paseo en barco", "Tour de degustación de vinos"],
                disponibilidad: ["2025-11-14", "2025-12-20"],
                tag: "Playa",
                nextDeparture: "14 Nov 2025"
            },
            "machu": {
                id: "machu",
                title: "Machu Picchu Místico",
                location: "Machu Picchu, Perú",
                category: "aventura", 
                price: 1599,
                image: "assets/machupichu.jpg",
                duration: "8 días / 7 noches",
                max_personas: 8,
                description: "Descubre la majestuosa ciudadela inca y los misterios de la civilización más fascinante de los Andes.",
                inclusions: ["Vuelos y tren", "Guía bilingüe experto", "Entrada a Machu Picchu", "Alojamiento en Cusco"],
                disponibilidad: ["2025-11-12", "2025-12-15"],
                tag: "Aventura",
                nextDeparture: "12 Nov 2025"
            }
        };

        this.ofertas = ["caribe", "santorini"];
        this.destacados = ["santorini", "machu"];
        this.isLoaded = true;
        
        console.log('✅ Datos de respaldo cargados');
    }

    getProduct(id) {
        if (!this.isLoaded) {
            console.warn('⚠️ Productos no cargados aún, intentando obtener:', id);
        }
        
        const product = this.products[id];
        if (!product) {
            console.warn(`❌ Producto no encontrado: ${id}`);
            return null;
        }
        return product;
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

    // RENDERIZAR PRODUCTOS EN LA PÁGINA DE PAQUETES
    renderPackagesGrid(container) {
        if (!container) {
            console.error('❌ Contenedor no encontrado para renderizar paquetes');
            return;
        }

        const products = this.getAllProducts();
        
        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <h3> No hay paquetes disponibles</h3>
                    <p>Lo sentimos, no hay paquetes turísticos disponibles en este momento.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="package-card" data-category="${product.category}" data-id="${product.id}">
                <div class="package-tag tag-${product.category}">${product.tag}</div>
                <img src="${product.image}" alt="${product.title}" class="package-img" 
                     onerror="this.src='assets/placeholder.jpg'">
                <div class="package-content">
                    <h4 class="package-title">${product.title}</h4>
                    <p class="package-location">${product.location}</p>
                    <p class="package-description">${product.description}</p>

                    <div class="package-details-info">
                        <p class="package-info"><strong>${product.duration}</strong></p>
                        <p class="package-info"><strong>Hasta ${product.max_personas} personas</strong></p>
                        <p class="package-info">Próxima salida: <strong>${product.nextDeparture}</strong></p>
                    </div>

                    <div class="package-footer">
                        <p class="package-price">
                            DESDE <strong>$${product.price.toLocaleString()}</strong> <span>por persona</span>
                        </p>
                        <div class="package-actions">
                            <button class="btn btn-details" data-package-id="${product.id}">
                                👀 Detalles
                            </button>
                            <button class="btn btn-reserve" data-package-id="${product.id}">
                                🛒 Reservar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        console.log(` Renderizados ${products.length} paquetes en el grid`);
    }

    // RENDERIZAR OFERTAS EN LA PÁGINA PRINCIPAL
    renderOfertas(container) {
        if (!container) {
            console.error('❌ Contenedor no encontrado para renderizar ofertas');
            return;
        }

        const ofertas = this.getOfertas();
        
        if (ofertas.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 2rem;">
                    <p>No hay ofertas disponibles en este momento.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = ofertas.map(product => `
            <div class="offer-card">
                <div class="offer-tag"> 20% OFF</div>
                <img src="${product.image}" alt="${product.title}" class="offer-img"
                     onerror="this.src='assets/placeholder.jpg'">
                <div class="offer-content">
                    <h3>${product.title}</h3>
                    <p class="offer-details">${product.description.substring(0, 100)}...</p>
                    <p class="offer-price">
                        Desde <strong>$${product.price.toLocaleString()}</strong> <em>por persona</em>
                    </p>
                    <a href="paquetes.html#${product.id}" class="btn btn-reserve">
                         Ver Oferta
                    </a>
                </div>
            </div>
        `).join('');

        console.log(` Renderizadas ${ofertas.length} ofertas`);
    }

    // RENDERIZAR DESTINOS DESTACADOS
    renderDestacados(container) {
        if (!container) {
            console.error('❌ Contenedor no encontrado para renderizar destacados');
            return;
        }

        const destacados = this.getDestacados();
        
        if (destacados.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <p>No hay destinos destacados disponibles.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = destacados.map(product => `
            <div class="destination-card small-card" style="background-image: url('${product.image}')">
                <div class="card-overlay">
                    <h2>${product.title.split(' ')[0]}</h2>
                    <p>${product.location}</p>
                    <a href="paquetes.html#${product.id}" class="btn card-btn">
                         Ver Detalles
                    </a>
                </div>
            </div>
        `).join('');

        console.log(`Renderizados ${destacados.length} destinos destacados`);
    }

    // MÉTODO PARA VERIFICAR ESTADO
    getStatus() {
        return {
            isLoaded: this.isLoaded,
            totalProducts: Object.keys(this.products).length,
            totalOfertas: this.ofertas.length,
            totalDestacados: this.destacados.length
        };
    }
}

// Instancia global con manejo de errores
window.productLoader = new ProductLoader();

// Verificar que se cargue correctamente
window.addEventListener('load', function() {
    console.log('Estado del ProductLoader:', productLoader.getStatus());
});