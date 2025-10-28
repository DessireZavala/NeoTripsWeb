const express = require('express');
const { MercadoPagoConfig, Preference } = require('mercadopago'); // 👈 CORRECCIÓN AQUI: Desestructuramos las clases necesarias
const cors = require('cors'); 

const app = express();
const PORT = 3000;

// ⚠️ CORRECCIÓN: Ahora creamos una INSTANCIA y la usamos en lugar de mercadopago.configure()

const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-8746859223329436-102714-73fe762918f8b628556d4a768f1355eb-2950256985', // 👈 Usa tu Access Token de prueba aquí
    options: { timeout: 5000 } 
});

// Inicializamos el servicio de preferencias
const preferenceService = new Preference(client); 


// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500' // O la URL de tu Live Server/dominio
}));
app.use(express.json()); 

// --- ENDPOINT PARA CREAR LA PREFERENCIA DE PAGO ---
app.post('/create_preference', async (req, res) => {
    const cartItems = req.body.cart;
    
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: "El carrito está vacío." });
    }

    const itemsMP = cartItems.map(item => ({
        title: item.title,
        unit_price: item.price, 
        quantity: item.numPersonas,
        currency_id: "MXN"
    }));
    
    let preference = {
        body: { // 👈 Los parámetros de la preferencia ahora van dentro de 'body'
            items: itemsMP,
            back_urls: {
                "success": "http://127.0.0.1:5500/paquetes.html?payment=success",
                "failure": "http://127.0.0.1:5500/paquetes.html?payment=failure",
                "pending": "http://127.0.0.1:5500/paquetes.html?payment=pending"
            },
            auto_return: "approved",
            shipments: {
                mode: "not_specified" 
            }
        }
    };

    try {
        // 3. ENVIAR LA PREFERENCIA A MERCADO PAGO usando el servicio
        const response = await preferenceService.create(preference);
        
        // 4. DEVOLVER EL ID DE PREFERENCIA AL FRONTEND
        res.status(200).json({ 
            preferenceId: response.id // 👈 El ID está directamente en la respuesta
        });

    } catch (error) {
        console.error('Error al crear preferencia de MP:', error);
        res.status(500).json({ error: "Error al procesar la preferencia de pago." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor de Mercado Pago iniciado en http://localhost:${PORT}`);
});