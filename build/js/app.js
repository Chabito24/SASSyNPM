// Escucha el evento que indica que el DOM ya fue cargado y es seguro manipularlo
document.addEventListener('DOMContentLoaded', function(){
    crearGaleria() // Al estar listo el DOM, llama a la función que construye la galería
})

function crearGaleria() {
    const cantidadImagenes = 16
    const galeria = document.querySelector('.galeria-imagenes') // Selecciona el contenedor donde se insertarán las imágenes (clase .galeria-imagenes)

    // Bucle para crear y agregar varias imágenes a la galería
    for(let i = 1; i <= cantidadImagenes; i++) { // Inicializa i=1; ⚠️ OJO: la condición "1 <= 16" es SIEMPRE verdadera (bucle infinito). Debería ser "i <= 16".
        const imagen = document.createElement('IMG') // Crea un elemento <img> (las etiquetas HTML no son sensibles a mayúsculas/minúsculas)
        imagen.src = `src/img/gallery/full/${i}.jpg` // Define la ruta de la imagen usando plantillas: 1.jpg, 2.jpg, ... 16.jpg
        imagen.alt = 'Imagen Galeria' // Texto alternativo para accesibilidad y cuando la imagen no se puede mostrar

        //Event Handler - es el proceso de detectar y responder a una interaccion del usuario en este caso a un clik
        imagen.onclick = function() {
            mostrarImagen(i)
        }
        
        galeria.appendChild(imagen) // Inserta la imagen como hijo del contenedor de la galería
    }

}

function mostrarImagen(i) {

    const imagen = document.createElement('IMG') 
    imagen.src = `src/img/gallery/full/${i}.jpg` 
    imagen.alt = 'Imagen Galeria'

    //Generar Modal
    const modal = document.createElement('DIV')
    modal.classList.add('modal')
    modal.onclick = cerrarModal //no requiere funcion por que no le estamos pasando un parametro como a mostrarImagen, esto debido a que cuando muestro la imagen el parametro es I ya que tiene que saber cual es la imagen a a cual le estoy dando click pero para cerrar el modal es irrelevante, igual se le puede pasar el function sin asignarle el arguumento de "i" ya que no es necesario

    modal.appendChild(imagen) //generamos a imagen que se esta tomando en la funcion anterior de function mostrarImagen(i)y la agregamos al modal

    //Agregar al HTML
    const body = document.querySelector('body')
    body.classList.add('overflow-hidden')
    body.appendChild(modal) //inyecta un div al HTML al dar click en la imagen
}

function cerrarModal() {
    const modal = document.querySelector('.modal')
    modal.classList.add('fade-out')
    setTimeout(()=> {
        modal?.remove() //valida si eiste el modal y en ese caso eliminalo
        const body = document.querySelector('body')
        body.classList.remove('overflow-hidden')
    },500); //retrsa este codigo 500 mili segudo lo que es lo mismo que medio segundo
    }
    
