//Creacion de constantes y variables
const carrito = document.querySelector('#carrito')  //Div que contiene la tabla del carrito
const listaCarrito = document.querySelector('#lista-carrito tbody') //body de la tabla donde se mostraran los curso elegidos
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')  //Boton para eliminar todos los cursos elegidos del carrito
const listaCursos = document.querySelector('#lista-cursos') //Div que contiene todos los cursos ofrecidos
let articulosCarrito = []   //Array donde se guardaran los cursos elegidos

eventos()

document.addEventListener('DOMContentLoaded', ()=>{
    articulosCarrito = JSON.parse(localStorage.getItem('articulos'))
    carritoHTML()
})
//Funcion que detecta los eventos
function eventos(){
    listaCursos.addEventListener('click', functAgregarCurso)
    carrito.addEventListener('click', functEliminarCurso)
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []
        limpiarHtml() 
    })
}



function functEliminarCurso(e){
    if(e.target.classList.contains('borrar-curso')){
        cursoId = e.target.getAttribute('data-id')
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId)
        console.log(articulosCarrito)
        carritoHTML()
    }
    
}

function functAgregarCurso(e){  //recoge el evento click
    e.preventDefault()  //evita el comportamiento por defecto del evento click

    if(e.target.classList.contains('agregar-carrito')){ //detecta unicamente los click sobre el btn Agregar al carrito
        const cursoSeleccionado = e.target.parentElement.parentElement  //recoge todo el html del card del curso seleccionado
       
        leerDatosCurso(cursoSeleccionado)//se pasan como parametros los datos del curso seleccionado
    }
}

function leerDatosCurso(curso){ //recibe el curso seleccionado
    
    const infoCurso = { //Crea un objeto con el curso seleccionado
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        profesor: curso.querySelector('p').textContent,
        precio: curso.querySelector('.precio .u-pull-right').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }
     
    //some comprueba una condicion: que el array articulosCarrito contenga un objeto con un id igual al ultimo curso seleccionado, si la condicion se cumple devuelve true
    const existe = articulosCarrito.some(articulo => articulo.id === infoCurso.id)
        if(existe){
            articulosCarrito.forEach(curso => { //se itera sobre cada curso del array que guarda los cursos del carrito de compras
                if(curso.id == infoCurso.id){   //si el array contiene un curso con id igual al ultimo curso seleccionado se suma 1 a la cantidad del curso
                    curso.cantidad++    //se suma 1 al curso del array que contiene los cursos seleccionados 
                } 
            })
        } else{
            //si no se cumplen las condiciones anteriores simplemente se crea una compia del array original articulosCarrito donde se le incluiran todos los cursos 
            //que ya existan en ese arreglo y se le agregara el ultimo curso seleccionado infoCurso
            articulosCarrito = [...articulosCarrito, infoCurso] 
        }
    

    
    console.log(articulosCarrito)
    
    carritoHTML()   //Se llama a la funcion carritoHTML
}


function carritoHTML(){
    limpiarHtml()   //Llamado a la funcion limpiarHtml, se eliminan los elementos mostrados en la tabla del carrito y despues se imprime el array actualizado,esto para 
                    //evitar que los elementos anteriores se acumulen cada vez que se actualice el contenido del carrito de compras.
    articulosCarrito.forEach(cursoSelec => {    //se itera sobre cada curso del array articulosCarrito
        const {imagen, titulo, precio, cantidad, id} = cursoSelec   //se usa destructuring para crear constantes de cada propidad del objeto curso
        const row = document.createElement('tr') //se crea un elemento tr y se guarda en la constante row
        row.innerHTML = `
        <td><img src="${imagen}" width="100px"></td>  
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td><a href="#" class="borrar-curso" data-id=${id}>X</a></td>
        `
        listaCarrito.appendChild(row) //el HTML creado se agrega al body de la tabla del carrito de compras 
    })

    sincronizarStorage()
}

//Comprueba si el contenedor contiene un elemento y elimina el primero, hace eso hasta que elimina todos pues todos se recorren al primer elemento
function limpiarHtml(){
    while(listaCarrito.firstChild){     //Comienza un bucle while que se ejecutará mientras listaCarrito tenga al menos un hijo 
        listaCarrito.removeChild(listaCarrito.firstChild) //En cada iteración del bucle se elimina el primer hijo de la tabla y esto se repite hasta que la tabla ya no tenga hijos
    }                                                      //esto para evitar que los elementos anteriores se acumulen cada vez que se actualice el contenido del carrito de compras.
}

function sincronizarStorage(){
    localStorage.setItem('articulos',JSON.stringify(articulosCarrito))
}