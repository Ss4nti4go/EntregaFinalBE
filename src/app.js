import express from 'express';
import routerProducts from './router/productRouter.js';
import routerCart from './router/cartRouter.js';
import { connectDB } from './config/mongoose.config.js';
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import routerViewProductos from "./router/products.view.router.js";
import paths from "./utils/paths.js";

const app = express();

connectDB(); //Conexion a la base de datos

const PORT = 8080;

// Configurar middleware
app.use("/api/public", express.static(paths.src + '/public'));// Servir archivos estáticos
app.use(express.urlencoded({ extended: true })); // Procesar datos de formularios
app.use(express.json()); // Procesar cuerpos JSON

// Configurar vistas con Handlebars
console.log('Ruta de vistas configurada:', paths.views);
console.log('Sirviendo archivos estáticos desde:', `${paths.src}`);
configHandlebars(app);

// Rutas para manejar productos, carritos y vistas
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCart);
/*app.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts', { title: 'App de prueba' });
});*/

app.use('/', routerViewProductos);

// Ruta para la vista principal


// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).render('error404', { title: 'Error 404' });
});

// Iniciar el servidor
export const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
configWebsocket(httpServer);