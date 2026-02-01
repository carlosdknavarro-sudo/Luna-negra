import { supabase } from './supabase.js';

let productosOriginales = [];

async function cargarProductos() {
    const contenedor = document.getElementById('productos-grid');
    if (!contenedor) return;

    // Aseguramos que busque en la tabla 'productos' (minúscula)
    const { data, error } = await supabase.from('productos').select('*');
    
    if (error) {
        console.error("Error cargando productos:", error);
        contenedor.innerHTML = '<p>Error al conectar con la base de datos.</p>';
        return;
    }

    productosOriginales = data;
    renderizarProductos(data);
}

function renderizarProductos(lista) {
    const contenedor = document.getElementById('productos-grid');
    contenedor.innerHTML = '';

    if (!lista || lista.length === 0) {
        contenedor.innerHTML = '<p style="grid-column:1/-1; text-align:center;">No hay productos disponibles en Luna Negra.</p>';
        return;
    }

    lista.forEach(prod => {
        // Verificamos si la imagen ya es un link completo o solo el nombre
        const urlImagen = prod.imagen.startsWith('http') 
            ? prod.imagen 
            : `https://loqvusparkrtyzkatxdt.supabase.co/storage/v1/object/public/imagenes-productos/${prod.imagen}`;

        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${urlImagen}" alt="${prod.nombre}" onerror="this.src='https://via.placeholder.com/300?text=Luna+Negra+Stock'">
            <div class="product-info">
                <h3>${prod.nombre}</h3>
                <p class="precio">$${prod.precio}</p>
            </div>
        `;
        contenedor.appendChild(div);
    });
}

// Filtros
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
        e.preventDefault();
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
