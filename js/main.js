// js/main.js
import { supabase } from './supabase.js';

async function cargarProductos() {
    const contenedor = document.getElementById('productos-grid');
    if (!contenedor) {
        console.error("No se encontró el contenedor #productos-grid");
        return;
    }

    // Traemos los datos de la tabla 'productos'
    const { data, error } = await supabase
        .from('productos')
        .select('*');

    if (error) {
        console.error("Error cargando productos:", error);
        return;
    }

    // Limpiamos el contenedor antes de cargar
    contenedor.innerHTML = '';

    // Si no hay productos, mostramos un mensaje amistoso
    if (data.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Próximamente nuevos ingresos...</p>';
        return;
    }

    data.forEach(prod => {
        // Generamos la tarjeta del producto solo con Info esencial
        contenedor.innerHTML += `
            <div class="product-card">
                <img src="${prod.imagen}" alt="${prod.nombre}" 
                     onerror="this.src='https://via.placeholder.com/300?text=Imagen+no+disponible'">
                <div class="product-info">
                    <h3>${prod.nombre}</h3>
                    <p class="precio">$${prod.precio}</p>
                </div>
            </div>
        `;
    });
}

// Ejecutar cuando la página cargue
document.addEventListener('DOMContentLoaded', cargarProductos);
