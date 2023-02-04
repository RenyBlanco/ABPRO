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
            stock: 9
        },
        {
            id: 3,
            nombre: 'Laptop Lenovo',
            precio: 950000,
            imagen: 'laptop1.jpg',
            stock: 8
        },
        {
            id: 4,
            nombre: 'Laptop HP',
            precio: 855000,
            imagen: 'laptop2.jpg',
            stock: 7
        },
        {
            id: 5,
            nombre: 'Headphones urbenexs',
            precio: 20000,
            imagen: 'head1.jpg',
            stock: 12
        },
        {
            id: 6,
            nombre: 'Headphones Shoks',
            precio: 35000,
            imagen: 'head2.webp',
            stock: 11
        }
    
    ];

    let formato = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
    });
    
    const DOMitems = document.querySelector('#items');
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
            miNodoStock.classList.add('product__stock');
            miNodoStock.textContent = `disponible: ${info.stock}`;
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('product__price');
            miNodoPrecio.textContent = `${formato.format(info.precio)}`;
            // Boton 
        
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-outline-success','AGREGA');
            miNodoBoton.textContent = 'Añadir al carro';
            miNodoBoton.setAttribute('marcador', info.id);
            //miNodoBoton.addEventListener('click', addToCartClicked);
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
    
    renderizarProductos();

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
        abrirModal();
        //alert("Gracias por su compra");
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
        var stock = parseInt(product.getElementsByClassName("product__stock")[0].innerText.replace("disponible:",""));
        var imageSrc = product.getElementsByClassName("product__image")[0].src;
        addItemToCart(title, price, imageSrc, stock);
        document.getElementById('vaciar').style.visibility = "visible";
        document.getElementById('pagar').style.visibility = "visible";
        updateCartTotal();
        updateItemsTotal();
    }

    function addItemToCart(title, price, imageSrc, stock) {
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
            <input class="cart-quantity-input" type="number" value="1" autocomplete="off">
            <input class="cart-stock-input" type="hidden" value="${stock}">
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
            var dispone = stockElement.value;
            var price = parseInt(priceElement.innerText.replace("$", ""))*1000;
            var quantity = quantityElement.value;
            if(dispone < quantity){
                Swal.fire(
                    'Error!',
                    'Cantidad no disponible!',
                    'error'
                );
                cartRow.getElementsByClassName("cart-quantity-input")[0].value = dispone;

            }
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
        if (total == 0) {
            document.getElementById('vaciar').style.visibility = "hidden";
            document.getElementById('pagar').style.visibility = "hidden";
        }
        document.getElementById("item-count").innerText = total;
    }
});