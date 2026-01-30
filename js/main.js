// js/main.js
import { supabase } from './supabase.js';

async function cargarProductos() {
    const contenedor = document.getElementById('productos-grid');
    if (!contenedor) return;

    const { data, error } = await supabase
        .from('productos')
        .select('*');

    if (error) {
        console.error("Error cargando productos:", error);
        return;
    }

    contenedor.innerHTML = '';

    data.forEach(prod => {
        // Usamos prod.imagen porque así aparece en tu base de datos
        contenedor.innerHTML += `
            <div class="product-card">
                <img src="${prod.imagen}" alt="${prod.nombre}" 
                     style="width:100%; height:250px; object-fit:cover;"
                     onerror="this.src='https://via.placeholder.com/300?text=Error+al+cargar+foto'">
                <div class="product-info">
                    <h3>${prod.nombre}</h3>
                    <p class="precio">$${prod.precio}</p>
                    <a href="https://wa.me/TUNUMERO?text=Hola, quiero consultar por: ${prod.nombre}" 
                       class="btn-primary" target="_blank">
                       Consultar WhatsApp
                    </a>
                </div>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', cargarProductos);
