import { supabase } from './supabase.js';

async function cargarProductos() {
    const { data, error } = await supabase
        .from('productos')
        .select('*');

    if (error) {
        console.error("Error al cargar:", error);
        return;
    }

    const contenedor = document.getElementById('productos-grid');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';

    data.forEach(prod => {
        contenedor.innerHTML += `
            <div class="product-card">
                <img src="${prod.imagen_url}" alt="${prod.nombre}">
                <div class="product-info">
                    <h3>${prod.nombre}</h3>
                    <p class="precio">$${prod.precio}</p>
                    <a href="https://wa.me/TUNUMERO?text=Hola, quiero la remera ${prod.nombre}" class="btn-primary">Comprar</a>
                </div>
            </div>
        `;
    });
}

// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', cargarProductos);
