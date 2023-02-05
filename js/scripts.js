// Carro 2
document.addEventListener('DOMContentLoaded', () => {
    
    let formato = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    });
    
    const DOMitems = document.querySelector('#items');
    //const miLocalStorage = window.localStorage;
    let productos = [];
    // Funciones
    /**
    * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
    */

    var tabla;
    $.getJSON('js/listado.json', function(data) {
       tabla = data.basedeDatos;
       llenaListado()
    });
    
    function llenaListado() {
        jQuery.each(tabla.Productos, function(i, fila) {
            productos.push(fila);
        });
        renderizarProductos();
    }

    function renderizarProductos() {
        productos.forEach(element => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('col-md-12');
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('product');
            // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('product-title');
            miNodoTitle.textContent = element.nombre;
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('product__image');
            miNodoImagen.setAttribute('src', './img/'+element.imagen);
            // Stock
            const miNodoStock = document.createElement('p');
            miNodoStock.classList.add('product__stock');
            miNodoStock.textContent = `disponible: ${element.stock}`;
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('product__price');
            miNodoPrecio.textContent = `${formato.format(element.precio)}`;
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-outline-success','AGREGA');
            miNodoBoton.textContent = 'Añadir al carro';
            miNodoBoton.setAttribute('marcador', element.id);
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

    //guardarCarritoEnLocalStorage();
        
    //function guardarCarritoEnLocalStorage () {
    //    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    //}
    
    //function cargarCarritoDeLocalStorage () {
    //    // ¿Existe un carrito previo guardado en LocalStorage?
    //    if (miLocalStorage.getItem('carrito') !== null) {
    //        // Carga la información
    //        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    //    }
    //}
    
    (function () {
        const cartInfo = document.getElementById("cart-info");
        const cart = document.getElementById("cart");
        cartInfo.addEventListener("click", function () {
        cart.classList.toggle("show-cart");
        });
    })();

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
        updateStock();
        vaciarClicked();
        
        cart.classList.toggle("show-cart");
        Swal.fire(
            'Gracias por su compra!',
            'Se ha enviado un correo con la boleta de su compra!',
            'success'
        );
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
        var id = event.target.getAttribute('marcador');
        var product = button.parentElement.parentElement;
        var title = product.getElementsByClassName("product-title")[0].innerText;
        var price = product.getElementsByClassName("product__price")[0].innerHTML;
        var stock = parseInt(product.getElementsByClassName("product__stock")[0].innerText.replace("disponible:",""));
        var imageSrc = product.getElementsByClassName("product__image")[0].src;
        
        addItemToCart(title, price, imageSrc, stock, id);
        document.getElementById('vaciar').style.visibility = "visible";
        document.getElementById('pagar').style.visibility = "visible";
        updateCartTotal();
        updateItemsTotal();
    }

    function addItemToCart(title, price, imageSrc, stock, id) {
        var cartRow = document.createElement("div");
        cartRow.classList.add("cart-row");
        var cartItems = document.getElementsByClassName("cart-items")[0];
        var cartItemTitles = cartItems.getElementsByClassName("cart-item-title");
        for (var i = 0; i < cartItemTitles.length; i++) {
            if (cartItemTitles[i].innerText == title) {
                Swal.fire(
                    'Error!',
                    'El item ya se encuentra en el carro!',
                    'warning'
                );
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
            <input class="cart-quantity-input" type="number" value="1" autocomplete="off">
            <input class="cart-stock-input" type="hidden" value="${stock}">
            <input class="cart-id-input" type="hidden" value="${id}">
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
            var stockElement = cartRow.getElementsByClassName("cart-stock-input")[0];
            var price = parseInt(priceElement.innerText.replace("$", ""))*1000;
            var dispone = parseInt(stockElement.value);
            var quantity = parseInt(quantityElement.value);
            if (dispone < quantity) {
                Swal.fire(
                    'Error!',
                    'Cantidad no disponible!',
                    'error'
                );
                cartRow.getElementsByClassName("cart-quantity-input")[0].value = dispone;
                quantity = dispone;
            }
            total = total + price * quantity;
        }
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
        if (total == 0) {
            document.getElementById('vaciar').style.visibility = "hidden";
            document.getElementById('pagar').style.visibility = "hidden";
        }
        document.getElementById("item-count").innerText = total;
    }

    function updateStock() {
        let lis = document.getElementsByClassName("product__stock");
        let habilita = document.getElementsByClassName("AGREGA");
        var cartItemContainer = document.getElementsByClassName("cart-items")[0];
        var cartRows = cartItemContainer.getElementsByClassName("cart-row");
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i];
            var quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0];
            var stockElement = cartRow.getElementsByClassName("cart-stock-input")[0];
            var stockId = cartRow.getElementsByClassName("cart-id-input")[0];
            var id = parseInt(stockId.value);
            var quantity = parseInt(quantityElement.value);
            var dispone = parseInt(stockElement.value);
            var queda = dispone-quantity;
            for(let i=0; i < productos.length; i++) {
                if(productos[i].id == id){
                    lis[id-1].innerHTML = "disponible : "+(queda);
                    productos[i].stock = (queda);
                    if(queda <= 1 ) {
                        var templateParams = {
                            product: productos[i].nombre,
                            to_name: 'Encargado de inventarios',
                            de_correo: 'rey.blanco@yahoo.com',
                            message: productos[i].nombre+' está quedando fuera de stock'
                        };
                        emailjs.send("service_jit80bi", "template_tizwwvm", templateParams)
                            .then(function (response) {
                                if (response.text === 'OK') {
                             
                                }
                                console.log("SUCCESS. status=%d, text=%s", response.status, response.text);
                            }, 
                            function (err) {
                              
                            console.log("FAILED. error=", err);
                        });
                    }
                    if(queda==0){
                        habilita[i].classList.replace('btn-outline-success', 'btn-outline-danger');
                        habilita[i].setAttribute('disabled','disabled');
                        habilita[i].innerHTML = 'Sin Stock';
                    }
                }
            };
        }
        
    }

    // function abrirModal() {
    //     cart.classList.toggle("show-cart");
    //     myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    //         keyboard: true
    //     });
    //     myModal.show();
    //     let subtotal = document.getElementById('total-price').innerHTML.replace("$", "");
    //     subtotal = parseInt(subtotal.replaceAll(".",""));
    //     document.getElementById('subtotal').innerHTML = " "+formato.format(subtotal);
    //     document.getElementById('impuesto').innerHTML = " "+formato.format(subtotal*0.19);
    //     document.getElementById('totalisimo').innerHTML = " "+formato.format(subtotal * 1.19);
    //     updateStock();
    // }

});