const ui = {
    onFormSubmit: (data) => {},
    onEliminarClick: (codigo) => {},
    onEditarClick: (codigo) => {},
    renderForm,
    renderTable
};

const form = document.getElementsByTagName('form')[0];
const tbody = document.getElementsByTagName('tbody')[0];
const cantidad_total = document.getElementById('cantidad-total');
const precio_total = document.getElementById('precio-total');
const gran_total = document.getElementById('gran-total');

const inputCodigo = document.getElementById('codigo');
const inputNombre = document.getElementById('nombre');
const inputPrecio = document.getElementById('precio');
const inputCantidad = document.getElementById('cantidad');
const inputCategoria = document.getElementById('categoria');


form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const data = new FormData(form);
    const values = Array.from(data.entries());

    const [frmCodigo, frmNombre, frmCantidad, frmPrecio, frmCategoria] = values;
    
    const codigo = parseInt(frmCodigo[1]);
    const nombre = frmNombre[1];
    const cantidad = parseFloat(frmCantidad[1]);
    const precio = parseFloat(frmPrecio[1]);
    const categoria = parseInt(frmCategoria[1]);

    ui.onFormSubmit({
        codigo,
        nombre,
        cantidad,
        precio,
        categoria
    })
});

function onSubmit(event) {
    event.preventDefault();   

    const data = new FormData(form);
    const values = Array.from(data.entries());

    const [frmCodigo, frmNombre, frmCantidad, frmPrecio, frmCategoria] = values;
    
    const codigo = parseInt(frmCodigo[1]);
    const nombre = frmNombre[1];
    const cantidad = parseFloat(frmCantidad[1]);
    const precio = parseFloat(frmPrecio[1]);
    const categoria = parseInt(frmCategoria[1]);

    if( codigo)
    {
        store.dispatch({
            type: "producto-modificado",
            payload: {
                codigo,
                nombre,
                cantidad,
                precio,
                categoria
            }
        })
    }else{
        store.dispatch({
            type: "producto-agregado",
            payload: {
                nombre,
                cantidad,
                precio,
                categoria
            }
        })
    }

    store.dispatch({
        type: "producto-seleccionado",
        payload: {
        codigo: null
        }
    })
}


function renderForm(producto) {
    inputCodigo.value = producto.codigo || "";
    inputNombre.value = producto.nombre || "";
    inputCantidad.value = producto.cantidad || "";
    inputPrecio.value = producto.precio || "";
    inputCategoria.value = producto.categoria || 1;
}

function renderTable(products) {
    
    const filas = products.map((item) => {
        const tr = document.createElement("tr");
        tr.innerHTML= `
            <td>${item.codigo}</td>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${item.precio}</td>
            <td>${item.total}</td>
            <td>
                <div class="btn-group">
                <a title="Editar" href="#" class="btn btn-sm btn-outline-secondary"> 
                <i class="bi bi-pencil-square"></i> 
                </a>           
                <a title="Eliminar" href="#" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash"></i>
                </a> 
                </div>
            </td>`;
        const [editar, eliminar] = tr.getElementsByTagName("a");
        
        eliminar.addEventListener("click",(event)=>{
            event.preventDefault();
            ui.onEliminarClick(item.codigo);
        })

        editar.addEventListener("click", (event)=> {
            event.preventDefault();
            ui.onEditarClick(item.codigo);
        });

        return tr;
    })
    tbody.innerHTML = "";
    filas.forEach(item => {
        tbody.appendChild(item);
    });

    const cantidadTotal = sum (products, x => x.cantidad);
    const precioTotal = sum(products, x => x.precio);
    const granTotal = sum(products, x => x.total);

    cantidad_total.innerHTML = cantidadTotal;
    precio_total.innerHTML = precioTotal;
    gran_total.innerHTML = granTotal;

    function sum(elements, selector) {
        return elements
        .map(selector)
        .reduce((a,b)=> a + b, 0);
    }
}
