(function () {
	const cartInfo = document.getElementById("cart-info");
	const cart = document.getElementById("cart");
	cartInfo.addEventListener("click", function () {
	  cart.classList.toggle("show-cart");
	});
})();

let formato = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
});

if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

function ready() {
    var addToCartButtons = document.getElementsByClassName("AGREGA");
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener("click", addToCartClicked);
    }

    var quantityInputs = document.getElementsByClassName("cart-quantity-input");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    /*remove items first part*/
    var removeCartItemButtons = document.getElementsByClassName("btn-danger");
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i];
        button.addEventListener("click", removeCartItem);
    }
    /*end*/
    document
        .getElementsByClassName("btn-purchase")[0]
        .addEventListener("click", purchaseClicked);
    document
    .getElementsByClassName("btn-vaciar")[0]
    .addEventListener("click", vaciarClicked);
}

/*remove items second part*/  
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
    updateItemsTotal();
}
/*end*/

function purchaseClicked(){
    alert("Gracias por su compra");
    var cartItems = document.getElementsByClassName("cart-items")[0];
    while (cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild);
    }
    document.getElementById('vaciar').style.visibility = "hidden";
    document.getElementById('pagar').style.visibility = "hidden";
    updateCartTotal();
    updateItemsTotal();
}

function vaciarClicked(){
    var cartItems = document.getElementsByClassName("cart-items")[0];
    while (cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild);
    }
    document.getElementById('vaciar').style.visibility = "hidden";
    document.getElementById('pagar').style.visibility = "hidden";
    updateCartTotal();
    updateItemsTotal();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
    updateItemsTotal();
}

function addToCartClicked(event) {
    var button = event.target;
    var product = button.parentElement.parentElement;
    var title = product.getElementsByClassName("product-title")[0].innerText;
    var price = product.getElementsByClassName("product__price")[0].innerHTML;
    var imageSrc = product.getElementsByClassName("product__image")[0].src;
    addItemToCart(title, price, imageSrc);
    document.getElementById('vaciar').style.visibility = "visible";
    document.getElementById('pagar').style.visibility = "visible";
    updateCartTotal();
        /*missing*/
    updateItemsTotal();
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement("div");
    cartRow.classList.add("cart-row");
    var cartItems = document.getElementsByClassName("cart-items")[0];
    var cartItemTitles = cartItems.getElementsByClassName("cart-item-title");
    for (var i = 0; i < cartItemTitles.length; i++) {
        if (cartItemTitles[i].innerText == title) {
            alert("El item ya se encuentra en el carro");
            return;
        }
    }
    var cartRowContents = `
    <div class="cart-item cart-column">
        <img class="cart-item-image" src="${imageSrc}">
        <span class="cart-item-title">${title}</span>
    </div>
    <span class="cart-price cart-column">${price}</span>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input" type="number" value="1">
        <button class="btn btn-danger" type="button">Borrar</button>
    </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow
        .getElementsByClassName("btn-danger")[0]
        .addEventListener("click", removeCartItem);
    cartRow
        .getElementsByClassName("cart-quantity-input")[0]
        .addEventListener("change", quantityChanged);
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    var cartRows = cartItemContainer.getElementsByClassName("cart-row");
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName("cart-price")[0];
        var quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0];
        var price = parseInt(priceElement.innerText.replace("$", ""))*1000;
        var quantity = quantityElement.value;
        total = total + price * quantity;
    }
    //total = Math.round(total * 100) / 100;
    document.getElementsByClassName("cart-total-price")[0].innerText = formato.format(total);
}

function updateItemsTotal() {
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    var cartRows = cartItemContainer.getElementsByClassName("cart-row");
    var total = 0;
    for (let i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0];
        var quantity = quantityElement.value;
        var total = total + parseInt(quantity);
    }
    document.getElementById("item-count").innerText = total;
}

// Carro 2

document.addEventListener('DOMContentLoaded', () => {
const baseDeDatos = [
    {
        id: 1,
        nombre: 'Celular Huawei',
        precio: 230000,
        imagen: 'huawei.jpg',
        stock: 10
    },
    {
        id: 2,
        nombre: 'Celular Motorola',
        precio: 185000,
        imagen: 'motorola.jpg',
        stock: 10
    },
    {
        id: 3,
        nombre: 'Laptop Lenovo',
        precio: 1200000,
        imagen: 'laptop1.jpg',
        stock: 10
    },
    {
        id: 4,
        nombre: 'Laptop HP',
        precio: 1550000,
        imagen: 'laptop2.jpg',
        stock: 10
    },
    {
        id: 5,
        nombre: 'Headphones urbenexs',
        precio: 20000,
        imagen: 'head1.jpg',
        stock: 10
    },
    {
        id: 6,
        nombre: 'Headphones Shoks',
        precio: 35000,
        imagen: 'head2.webp',
        stock: 10
    }

];
let formato = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
});

let carrito = [];
const divisa = '$';
const DOMitems = document.querySelector('#items');
//const DOMcarrito = document.querySelector('#carrito');
//const DOMtotal = document.querySelector('#total');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const miLocalStorage = window.localStorage;

// Funciones

/**
* Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
*/
function renderizarProductos() {
    baseDeDatos.forEach((info) => {
        // Estructura
        
        const miNodo = document.createElement('div');
        miNodo.classList.add('col-md-12');
        // Body
        const miNodoCardBody = document.createElement('div');
        miNodoCardBody.classList.add('product');
        // Titulo
        const miNodoTitle = document.createElement('h5');
        miNodoTitle.classList.add('product-title');
        miNodoTitle.textContent = info.nombre;
        // Imagen
        const miNodoImagen = document.createElement('img');
        miNodoImagen.classList.add('product__image');
        miNodoImagen.setAttribute('src', './img/'+info.imagen);
        // Stock
        const miNodoStock = document.createElement('p');
        miNodoStock.textContent = `Stock disponible: ${info.stock}`;
        // Precio
        const miNodoPrecio = document.createElement('p');
        miNodoPrecio.classList.add('product__price');
        miNodoPrecio.textContent = `${formato.format(info.precio)}`;
        // Boton 
    
        const miNodoBoton = document.createElement('button');
        miNodoBoton.classList.add('btn', 'btn-outline-success','AGREGA');
        miNodoBoton.textContent = 'Añadir al carro';
        miNodoBoton.setAttribute('marcador', info.id);
        miNodoBoton.addEventListener('click', addToCartClicked);
        // Insertamos
        miNodoCardBody.appendChild(miNodoImagen);
        miNodoCardBody.appendChild(miNodoTitle);
        miNodoCardBody.appendChild(miNodoStock);
        miNodoCardBody.appendChild(miNodoPrecio);
        miNodoCardBody.appendChild(miNodoBoton);
        miNodo.appendChild(miNodoCardBody);
        DOMitems.appendChild(miNodo);
    });
}

/**
* Evento para añadir un producto al carrito de la compra
*/
function anyadirProductoAlCarrito(evento) {
    // Anyadimos el Nodo a nuestro carrito
    carrito.push(evento.target.getAttribute('marcador'))
    // Actualizamos el carrito 
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();
}

/**
* Dibuja todos los productos guardados en el carrito
*/
function renderizarCarrito() {
    // Vaciamos todo el html
    //DOMcarrito.textContent = '';
    // Quitamos los duplicados
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {
        // Obtenemos el item que necesitamos de la variable base de datos
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            // ¿Coincide las id? Solo puede existir un caso
            return itemBaseDatos.id === parseInt(item);
        });
        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
            return itemId === item ? total += 1 : total;
        }, 0);
        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
        miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
        // Boton de borrar
        const miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-danger', 'mx-5');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.dataset.item = item;
        miBoton.addEventListener('click', borrarItemCarrito);
        // Mezclamos nodos
        miNodo.appendChild(miBoton);
        DOMcarrito.appendChild(miNodo);
    });
    // Renderizamos el precio total en el HTML
    DOMtotal.textContent = calcularTotal();
}

/**
* Evento para borrar un elemento del carrito
*/
function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();

}

/**
 * Calcula el precio total teniendo en cuenta los productos repetidos
 */
function calcularTotal() {
    // Recorremos el array del carrito 
    return carrito.reduce((total, item) => {
        // De cada elemento obtenemos su precio
        const miItem = baseDeDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id === parseInt(item);
        });
        // Los sumamos al total
        return total + miItem[0].precio;
    }, 0).toFixed(2);
}

/**
* Varia el carrito y vuelve a dibujarlo
*/
function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
    // Borra LocalStorage
    localStorage.clear();

}

function guardarCarritoEnLocalStorage () {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage () {
    // ¿Existe un carrito previo guardado en LocalStorage?
    if (miLocalStorage.getItem('carrito') !== null) {
        // Carga la información
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}

// Eventos
//DOMbotonVaciar.addEventListener('click', vaciarCarrito);

// Inicio
//cargarCarritoDeLocalStorage();
renderizarProductos();
//renderizarCarrito();
});
