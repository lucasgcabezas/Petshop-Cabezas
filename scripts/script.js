
// EVENTO DE BARRA NAV
window.addEventListener("scroll", () => {
    window.scrollY > 100
        ? document.getElementById("navbar").className = ("scrollNav")
        : document.getElementById("navbar").className = ("logo-nav")

    // EVENTO DE NAV EN INDEX
    if (window.scrollY > 1200 && document.getElementById('mainIndex')) {
        document.getElementById("tituloUbi").className = ("titulo2")
    } else if (document.getElementById('mainIndex')) {
        document.getElementById("tituloUbi").className = ("titulo1")
    }
    if (window.scrollY > 1400 && document.getElementById('mainIndex')) {
        document.getElementById("mapa").className = ("texto-mapa2")
    } else if (document.getElementById('mainIndex')) {
        document.getElementById("mapa").className = ("texto-mapa1")
    }
})

// FETCHEAR API
importarApi()
async function importarApi() {
    const dataFetch = await fetch(`https://apipetshop.herokuapp.com/api/articulos`)
    const data = await dataFetch.json()
    dataArray = data.response
    const copiaData = JSON.parse(JSON.stringify(dataArray))
    iniciarPrograma(copiaData)
}

// INICIA EL PROGRAMA GENERAL
function iniciarPrograma(todosLosProductos) {

    todosLosProductos.map(p => p.cantidadCarro = 0)
    todosLosProductos.map(p => p.precioCarro = p.precio)

    let carrito = []
    var farmacia = todosLosProductos.filter(prod => prod.tipo == "Medicamento")
    var juguetes = todosLosProductos.filter(prod => prod.tipo == "Juguete")

    document.getElementById('vaciarCarro').addEventListener('click', () => vaciarCarrito())
    document.getElementById('finalizarCompra').addEventListener('click', () => finalizarCompra())

    // GUARDAR CARRITO EN LOCALSTORAGE
    function guardarStorage() {
        if (carrito.length == 0) {
            localStorage.removeItem('carritoStorage')
        }
        localStorage.setItem('carritoStorage', JSON.stringify(carrito))
    }

    if (localStorage.getItem('carritoStorage')) {
        carrito = JSON.parse(localStorage.getItem('carritoStorage'))
    }

    document.getElementById('btnNav').addEventListener('click',(e) => {
        document.getElementById('modalResponsive').className = 'modalResponsive2'
        document.getElementById('navResponsive').className = 'navResponsive2'
        document.getElementById('closeResponsive').className = 'closeResponsive2'
    })
    document.getElementById('closeResponsive').addEventListener('click',(e) => {
        document.getElementById('modalResponsive').className = 'modalResponsive1'
        document.getElementById('navResponsive').className = 'navResponsive1'
        document.getElementById('closeResponsive').className = 'closeResponsive1'
    })

    situacionCarrito()
    mostrarTotalCarro()
    mostrarModal()

    // MOSTRAR CANTIDAD DE ARTICULOS EN CARRITO EN NAV
    function mostrarCantCarro() {
        cantidadCarroEnElNav = []
        carrito.map(p => cantidadCarroEnElNav.push(p.cantidadCarro))
        let totalcarronav2 = cantidadCarroEnElNav.reduce((a, b) => a + b)
        document.getElementById('cantCarroNav').innerText = totalcarronav2
    }

    // IMPRESION DE CARRITO EN MODAL
    function situacionCarrito() {
        if (carrito.length == 0) {
            document.getElementById('carrito').innerHTML = `<p class="carroVacio">El carrito de compras está vacio.</p>`
            document.getElementById('cantCarroNav').innerHTML = ''
        } else {
            mostrarCarrito(carrito)
            mostrarCantCarro()
        }
    }

    // FUNCIONAMIENTO DE CARRITO EN EL NAV
    function mostrarModal() {

        var carritoModal = document.getElementById("ventanaCarrito")
        var btn = document.getElementById("botonCarro")
        var span = document.getElementById("cerrar")
        

        btn.addEventListener('click', (e) => {
            e.preventDefault()
            carritoModal.style.display = "block"
        })

        span.addEventListener('click', () => {
            carritoModal.style.display = "none"
        })

        window.addEventListener('click', (event) => {
            if (event.target == carritoModal) {
                event.preventDefault()
                carritoModal.style.display = "none"
            }
        })
    }

    // MOSTRAR PRODUCTOS EN INDEX
    function mostrarIndex(arrayProductos) {
        document.getElementById('btnTienda').setAttribute("href", Math.ceil(Math.random() * 10) % 2 == 0 ? './pages/juguetes.html' : './pages/farmacia.html')
        let productosRandom = []
        arrayProductos.map(p => {
            let numeroRandom = Math.ceil(Math.random() * 10)
            if (productosRandom.length < 5 && !productosRandom.includes(arrayProductos[numeroRandom])) {
                productosRandom.push(arrayProductos[numeroRandom])
            }
        })
        productosRandom.map((producto) => {
            const elemento = document.createElement('a')
            elemento.setAttribute("href", producto.tipo == "Juguete" ? './pages/juguetes.html' : './pages/farmacia.html')
            elemento.className = "productoIndex"
            elemento.innerHTML = `      
        <p class="nombre">${producto.nombre}</p>
        <div class="img" id="img${producto._id}"></div>
        <p class="precio">$ ${(producto.precio).toFixed(2)}</p>
        `
            document.getElementById('muestra').appendChild(elemento)
            document.getElementById("img" + producto._id).style.backgroundImage = `url("${producto.imagen}")`
        })
    }

    // --MOSTRAR GONDOLA EN FARMACIA Y JUGUETES
    function mostrarGondola(categoria) {
        document.querySelector("#gondola").innerHTML = ''

        categoria.map((producto) => {
            let textoStock
            producto.stock == 1 ? textoStock = `Ultima unidad` : textoStock = `Ultimas ${producto.stock} unidades`

            // -- Div tarjeta de producto

            const elemento = document.createElement('div')
            elemento.className = "productoGondola cara"
            elemento.innerHTML = `
                <div class="img">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <div class="texto">
                    <span>${producto.nombre}</span>
                    <a href="" class="btnDescripcion" id="btnDescripcion${producto._id}">Ver más...</a>
                </div>
                <span class="precio">$ ${(producto.precio).toFixed(2)}</span>
                <button class="btnC" id="btnC${producto._id}">Agregar al carrito</button>

                <div class="stock" id="stock${producto._id}">${textoStock}</div>

                <div class="espaldaNo" id="espalda${producto._id}">
                    <div class="descripcion"><p>${producto.descripcion}</p></div>
                    <a href="" id="volver${producto._id}">Cerrar</a>
                <div>
            `
            document.querySelector("#gondola").appendChild(elemento)

            // --Cartel de ultimas unicades
            if (producto.stock < 6 && producto.stock > 0) { document.getElementById("stock" + producto._id).style.display = 'block' }

            // --Boton para leer descripción
            document.getElementById("btnDescripcion" + producto._id).addEventListener('click', (e) => {
                e.preventDefault()
                document.getElementById('espalda' + producto._id).className = ("espalda")
            })

            document.getElementById("volver" + producto._id).addEventListener('click', (e) => {
                e.preventDefault()
                document.getElementById('espalda' + producto._id).className = ("espaldaNo")
            })

            // --Boton comprar
            document.getElementById("btnC" + producto._id).addEventListener('click', () => {
                if (!carrito.includes(producto)) {
                    tata.text('¡Excelente!', `Agregaste ${producto.nombre} al carrito.`, {
                        position: 'tr',
                        duration: 2500,
                    })

                    producto.cantidadCarro++
                    // localStorage.getItem('carrito').push(producto)
                    carrito.push(producto)



                } else if (producto.cantidadCarro < producto.stock) {
                    producto.cantidadCarro++
                    producto.precioCarro = producto.precio * producto.cantidadCarro
                }
                mostrarCantCarro()
                mostrarCarrito(carrito)
                guardarStorage()
                mostrarTotalCarro()
                // hola()
            })
        })
    }

    // VALIDACION DE FORMULARIO CONTACTO
    function validarForm() {
        document.querySelector('#formBtn').addEventListener('click', (e) => {

            // validar nombre con numeros
            let nombre = document.getElementById('nombre').value
            let nombreArray = Array.from(nombre)
            let nombreVerificado = true
            nombreArray.map(l => {
                let numeroLetra = parseInt(l)
                if (numeroLetra >= 0 && numeroLetra <= 9) {
                    e.preventDefault()
                    tata.error('Error', 'Debes ingresar un nombre que no contenga numeros', {
                        position: 'tr',
                        duration: 3500,
                    })
                    nombre = ""
                    document.getElementById('formulario').reset()
                    return nombreVerificado = false
                }
            })

            // validar apellido con numeros --VER
            let apellido = document.getElementById('apellido').value
            let apellidoArray = Array.from(apellido)
            let apellidoVerificado = true
            apellidoArray.map(l => {
                let numeroLetra = parseInt(l)
                if (numeroLetra >= 0 && numeroLetra <= 9) {
                    e.preventDefault()
                    tata.error('Error', 'Debes ingresar un apellido que no contenga numeros', {
                        position: 'tr',
                        duration: 3500,
                    })
                    apellido = ""
                    document.getElementById('formulario').reset()
                    return apellidoVerificado = false
                }
            })

            // Validar campos completados
            if ((nombre.length == 0
                || apellido.length == 0
                || document.getElementById('mail').value.length == 0
                || document.getElementById('nombreMascota').value.length == 0
                || document.getElementById('mensaje').value.length == 0)
                && nombreVerificado && apellidoVerificado
            ) {
                tata.error('Error', 'Debes completar los campos obligatorios', {
                    position: 'tr',
                    duration: 3500,
                })
                document.getElementById('formulario').reset()
            }
            else if (nombreVerificado && apellidoVerificado) {
                e.preventDefault()
                tata.success(`Muchas gracias ${nombre}`, '¡Tu mensaje fue enviado con exito!', {
                    position: 'tr',
                    duration: 4200,
                })
                document.getElementById('formulario').reset()
            }
        })
    }

    // MOSTRAR CARRITO EN MODAL
    function mostrarCarrito(carritoMostrar) {
        document.getElementById('carrito').innerHTML = ""
        // document.querySelector('#totalCarrito').innerHTML = ""
        carritoMostrar.map(producto => {
            const elemento = document.createElement('div')
            elemento.className = 'articulo2'
            elemento.innerHTML = `
            <div class="prodComprado">
                <div class="img-enCarrito" >
                    <div class="imagen" id="imgCarrito${producto._id}"></div>
                </div>
                <div class="textos">
                    <span class="nombreEnCarrito">${producto.nombre}</span>
                </div>
                <div class="cant-borrar">
                    <span>Cantidad:</span>
                    <div class="cantidadArt">
                        <button name=btnsCarro${producto._id} data-accion='r'>-</button>
                        <span class="cantidadProd">${producto.cantidadCarro}</span>
                        <button name=btnsCarro${producto._id} data-accion='s'>+</button>
                    </div>
                    <span class="precioEnCarro">$ ${(producto.precioCarro).toFixed(2)}</span>
                    <button class="btnEliminarCarro" name=btnsCarro${producto._id} data-accion='e'>Eliminar</button>
                </div>
            </div>       
            `
            document.getElementById('carrito').appendChild(elemento)
            document.getElementById("imgCarrito" + producto._id).style.backgroundImage = `url("${producto.imagen}")`
            const botones = Array.from(document.getElementsByName("btnsCarro" + producto._id))
            botones.map(boton => {
                boton.addEventListener('click', (e) => {
                    if (e.target.dataset.accion === 'e') {
                        producto.cantidadCarro = 0
                        producto.precioCarro = producto.precio
                        carrito = carrito.filter(item => "btnsCarro" + item._id != e.target.name)
                        situacionCarrito()
                        document.getElementById('totalCarrito').innerHTML = ""

                    } else if (e.target.dataset.accion === 's' && producto.cantidadCarro < producto.stock) {
                        producto.cantidadCarro++
                        producto.precioCarro = producto.precio * producto.cantidadCarro
                        guardarStorage()

                    } else if (e.target.dataset.accion === 'r' && producto.cantidadCarro > 1) {
                        producto.cantidadCarro--
                        producto.precioCarro = producto.precio * producto.cantidadCarro

                    }
                    guardarStorage()
                    mostrarCarrito(carrito)
                    mostrarCantCarro()
                    mostrarTotalCarro()
                })
            })
            guardarStorage()
            mostrarCantCarro()

        })
        // precioTotalCarrito()
    }

    // MOSTRAR PRECIO TOTAL CARRO
    function mostrarTotalCarro() {
        if (localStorage.getItem('carritoStorage') && JSON.parse(localStorage.getItem('carritoStorage')).length >= 1) {
            let precioTotalCarro = []
            carrito.map(p => precioTotalCarro.push(p.precioCarro))
            let totalCarro = precioTotalCarro.reduce((a, b) => a + b)
            document.getElementById('totalCarrito').innerText = `$ ${totalCarro.toFixed(2)}`
        } else {
            document.getElementById('carrito').innerHTML = ""
            document.getElementById('cantCarroNav').innerHTML = ""
            document.getElementById('totalCarrito').innerHTML = ""
        }
    }

    // VACIAR CARRITO
    function vaciarCarrito() {
        carrito.map((p) => {
            p.cantidadCarro = 0
            p.precioCarro = p.precio
        })
        tata.text('Vaciaste el carrito', `¡Muchas gracias por visitarnos!`, {
            position: 'tr',
            duration: 2500,
        })
        limpiarCarro()
    }

    // FINALIZAR COMPRA
    function finalizarCompra() {
        if (carrito.length >= 1) {
            tata.success(`¡Excelente!`, '¡Tu compra fue realizada con exito!', {
                position: 'tr',
                duration: 3000,
            })
            limpiarCarro()
        } else {
            tata.error(`Error`, 'El carrito no contiene productos.', {
                position: 'tr',
                duration: 3000,
            })
        }
    }

    // LIMPIAR CARRITO
    function limpiarCarro() {
        guardarStorage()
        carrito = []
        guardarStorage()
        localStorage.removeItem('carritoStorage')
        document.getElementById('carrito').innerHTML = ""
        document.getElementById('carrito').innerHTML = `<p class="carroVacio">El carrito de compras está vacio.</p>`
        document.getElementById('cantCarroNav').innerHTML = ""
        document.getElementById('totalCarrito').innerHTML = ""
    }

    // FILTROS DE GONDOLA
    function filtrarProductos(productosFiltrar) {
        var selector = document.getElementById('selectorFiltro')
        var productosTest = [...productosFiltrar]
        var productosFiltrados = productosFiltrar
        selector.addEventListener('change', () => {
            if (selector.value === "normal") {
                productosTest == farmacia ? productosFiltrados = farmacia : productosFiltrados = productosTest
            } else if (selector.value === "barato") {
                productosFiltrados = productosFiltrar.sort((a, b) => a.precio - b.precio)
            } else if (selector.value === "caro") {
                productosFiltrados = productosFiltrar.sort((a, b) => b.precio - a.precio)
            }
            mostrarGondola(productosFiltrados)
        })
    }

    // --DISTRIBUCION DE FUNCIONES POR PAGINA
    if (document.getElementById('mainFarmacia')) {
        filtrarProductos(farmacia)
        mostrarGondola(farmacia)
    } else if (document.getElementById('mainJuguetes')) {
        filtrarProductos(juguetes)
        mostrarGondola(juguetes)
    } else if (document.getElementById('mainIndex')) {
        mostrarIndex(todosLosProductos)
    } else if (document.getElementById('mainContacto')) {
        validarForm()
    }
}























































































