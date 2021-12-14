// 10:59

const form = document.getElementsByTagName('form')[0];
const tbody = document.getElementsByTagName('tbody')[0];
const cantidad_total = document.getElementById('cantidad-total');
const precio_total = document.getElementById('precio-total');
const gran_total = document.getElementById('gran-total');

/** @type {HTMLInputElement} */
const inputCodigo = document.getElementById('codigo');
/** @type {HTMLInputElement} */
const inputNombre = document.getElementById('nombre');
/** @type {HTMLInputElement} */
const inputPrecio = document.getElementById('precio');
/** @type {HTMLInputElement} */
const inputCantidad = document.getElementById('cantidad');
/** @type {HTMLInputElement} */
const inputCategoria = document.getElementById('categoria');



const preloadedState = {
    producto: {},
    productos: []
}

let indice = 0;

const reducer = (state, action) =>{
    if (action.type == "producto-agregado"){
        indice++;
        const producto = action.payload;
        const codigo = indice;
        const total = producto.cantidad * producto.precio;
        return {
            ...state, 
            productos: [
                ...state.productos, 
                {
                    ...producto,
                    codigo,
                    total
                }
            ]}
        }
    if(action.type == "producto-modificado"){
        const producto = action.payload;
        const productos = state.productos.slice();
        const codigo = producto.codigo;
        const total = producto.cantidad * producto.precio;
        const old = productos.find((item) => item.codigo == codigo);
        const index = productos.indexOf(old);
        productos[index] = {...producto, total };
        return {
            ...state,
            productos
        }
    }
    if(action.type == "producto-eliminado"){
        const codigo = action.payload.codigo;
        const productos = state.productos.filter((item) => item.codigo != codigo);
        return {
            ...state,
            productos
        }
    }
    if (action.type == "producto-seleccionado"){
        const codigo = action.payload.codigo;
        return {
            ...state,
            producto: state.productos.find(x => x.codigo == codigo) || {}
        }
    }
    return state;
};

const store = Redux.createStore(reducer,preloadedState);

let latestState;

const unsuscribe = store.subscribe(()=>{
    let currentState = store.getState();
    if(currentState != latestState) {
        latestState = currentState;
        console.log("estado", store.getState());
        renderForm(currentState.producto);
        renderTable(currentState.productos);
    }
})

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
            store.dispatch({
                type: "producto-eliminado",
                payload: {
                    codigo: item.codigo
                }
            }
            )
        })

        editar.addEventListener("click", (event)=> {
            event.preventDefault();
            store.dispatch({
                type: "producto-seleccionado",
                payload: {
                codigo: item.codigo
                }
            })
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


form.addEventListener("submit", onSubmit);

/**
 * 
 * @param {Event} event 
 */
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

store.dispatch({
    type: "producto-agregado",
    payload: {
        nombre:"prueba 1",
        cantidad: 3,
        precio: 10,
        categoria: 1
    }
})

store.dispatch({
    type: "producto-modificado",
    payload: {
        codigo:1,
        nombre:"prueba a",
        cantidad: 3,
        precio: 20,
        categoria: 1
    }
})
store.dispatch({
    type: "producto-agregado",
    payload: {
        nombre:"prueba 2",
        cantidad: 4,
        precio: 5,
        categoria: 1
    }
})


store.dispatch({
    type: "producto-agregado",
    payload: {
        nombre:"prueba 3",
        cantidad: 5,
        precio: 25,
        categoria: 2
    }
})


store.dispatch({
    type: "producto-eliminado",
    payload: {
        codigo: 2
    }
})

console.log(store);