import { supabase } from './supabase.js';

let productosOriginales = [];

async function cargarProductos() {
    const contenedor = document.getElementById('productos-grid');
    if (!contenedor) return;

    const { data, error } = await supabase.from('productos').select('*');
    if (error) {
        console.error("Error:", error);
        return;
    }

    productosOriginales = data;
    renderizarProductos(data);
}

function renderizarProductos(lista) {
    const contenedor = document.getElementById('productos-grid');
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = '<p style="grid-column:1/-1; text-align:center;">No hay productos en esta categoría.</p>';
        return;
    }

    lista.forEach(prod => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='https://via.placeholder.com/300?text=Sin+Foto'">
            <div class="product-info">
                <h3>${prod.nombre}</h3>
                <p class="precio">$${prod.precio}</p>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

// MANEJO DE FILTROS SEGURO (Sin error CSP)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        e.preventDefault();
        
        // Quitar 'active' de todos y ponerlo al que clickeamos
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const cat = e.target.getAttribute('data-categoria');

        if (cat === 'todos') {
            renderizarProductos(productosOriginales);
        } else {
            const filtrados = productosOriginales.filter(p => 
                p.categoria && p.categoria.toLowerCase() === cat.toLowerCase()
            );
            renderizarProductos(filtrados);
        }
    }
});

document.addEventListener('DOMContentLoaded', cargarProductos);
