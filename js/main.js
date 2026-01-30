import { supabase } from './supabase.js';

async function cargarProductos() {
    console.log("Cargando productos...");
    
    // Traemos los datos de la tabla 'productos'
    const { data, error } = await supabase
        .from('productos')
        .select('*');

    if (error) {
        console.error("Error al obtener datos:", error);
        return;
    }

    console.log("Productos encontrados:", data);

    const contenedor = document.getElementById('productos-grid');
    if (!contenedor) {
        console.error("No se encontró el div #productos-grid");
        return;
    }

    if (data.length === 0) {
        contenedor.innerHTML = '<p>No hay productos disponibles por ahora.</p>';
        return;
    }

    contenedor.innerHTML = '';

    data.forEach(prod => {
        contenedor.innerHTML += `
            <div class="product-card">
                <img src="${prod.imagen_url}" alt="${prod.nombre}" style="width:100%; height:200px; object-fit:cover;">
                <div class="product-info">
                    <h3>${prod.nombre}</h3>
                    <p class="precio">$${prod.precio}</p>
                    <a href="https://wa.me/TUNUMERO?text=Hola, quiero ${prod.nombre}" class="btn-primary">Comprar</a>
                </div>
            </div>
        `;
    });
}

// Ejecutar la función
cargarProductos();
