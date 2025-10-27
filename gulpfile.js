import path from 'path'
import fs from 'fs'

import { glob } from 'glob' //imporamos la dependiencia de glob

import { src, dest, watch, series } from 'gulp';
import * as dartSass from 'sass';

import gulpSass from 'gulp-sass'; //dependencia para usar sass  en el archivo de gulpfile


const sass = gulpSass(dartSass);

import terser from 'gulp-terser' //despues de instalar en el bash npm i -save-dev gul-terser importamos terser
import sharp from 'sharp' // posterior a instalar sharp video 204 con "npm i --save-dev sharp" desde el bash o termminal

export function js(done){

    src('src/js/app.js') // ubicacion del archivo .js
        .pipe(terser()) //minimiza el codig de JS, se instalo previamente en el bahs npm i -save-dev gul-terser y se importo aqui mismo en el gulp cpn import terser from 'gulp-terser' ver linea 9
        .pipe(dest('build/js')) //lo lleva hace al build similar a lo que hicimos con css

    done()
}


export function css(done) {
    src('src/scss/app.scss', {sourcemaps: true}) //ubica el archivo y spucemap nos permite saber en inpector en au archivo y que linea se encuentra ese codigo
        .pipe(sass({
            style: 'compressed'
                }).on('error', sass.logError)) //aplica sass, // .on....<--- maneja errores de compilación
        .pipe(dest('build/css', {sourcemaps: '.'})) //.pipe controla el orden en el cual se va a ir ejecutando las funciones
    done();
}

//todo el codigo anterior hace lo mismo que enrutar el archivo de css , aqui borre la carpeta build y volvi a correr nmp run css y crea nuevamente la carpeta de build/css y sus archivo app.css


// IMPORTS NECESARIOS

// Exporta una función asíncrona llamada 'crop' que recibe un callback 'done' (útil si la integras con Gulp) ESTO ES CODIGO DE NODE, no hay una instancia propuia de gulp para esto
export async function crop(done) {
    const inputFolder = 'src/img/gallery/full'   // Carpeta de entrada donde están las imágenes originales
    const outputFolder = 'src/img/gallery/thumb';// Carpeta de salida donde se guardarán las miniaturas
    const width = 250;// Ancho objetivo de las miniaturas (en píxeles)
    const height = 180;// Alto objetivo de las miniaturas (en píxeles)

    // Si la carpeta de salida no existe, créala (con 'recursive' por si faltan directorios intermedios)
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true })
    }

    // Lee todos los nombres de archivo en la carpeta de entrada y filtra solo los .jpg (insensible a mayúsculas)
    const images = fs.readdirSync(inputFolder).filter(file => {
        return /\.(jpg)$/i.test(path.extname(file)); // Verifica extensión .jpg
    });

    try {// Recorre la lista de imágenes a procesar
        images.forEach(file => {
            const inputFile = path.join(inputFolder, file) // Ruta completa del archivo de entrada
            const outputFile = path.join(outputFolder, file)// Ruta completa del archivo de salida

            // Crea un pipeline con sharp para la imagen de entrada
            sharp(inputFile) 
                .resize(width, height, {// Redimensiona a 250x180
                    position: 'centre' // Alineación del recorte/posicionamiento ('centre' es válido en sharp)
                })
                .toFile(outputFile)// Escribe la imagen resultante en la ruta de salida
        });

        done()// Llama al callback para indicar que el proceso terminó (estilo Gulp)
    } catch (error) {
        console.log(error) // Si ocurre un error en el try, lo muestra en consola
    }
}

// Define una tarea exportada (asíncrona) llamada 'imagenes' que Gulp puede ejecutar
export async function imagenes(done) {
    // Define el directorio donde están las imágenes fuente (originales)
    const srcDir = './src/img';
    // Define el directorio donde se guardarán las imágenes procesadas
    const buildDir = './build/img';
    // Busca recursivamente todas las imágenes .jpg y .png dentro de 'src/img'
    const images =  await glob('./src/img/**/*{jpg,png}')

    // Itera sobre cada archivo de imagen encontrado
    images.forEach(file => {
        // Calcula la ruta relativa desde el directorio fuente al archivo actual
        const relativePath = path.relative(srcDir, path.dirname(file));
        // Une la ruta relativa con el directorio de salida para mantener la estructura de carpetas
        const outputSubDir = path.join(buildDir, relativePath);
        // Llama a la función que procesa individualmente cada imagen
        procesarImagenes(file, outputSubDir);
    });

    // Llama a 'done()' para indicar que la tarea ha finalizado (necesario en Gulp)
    done();
}

// Función que convierte una imagen a .jpeg y .webp, y la guarda en el directorio de salida
function procesarImagenes(file, outputSubDir) {
    // Si el subdirectorio de salida no existe, lo crea (incluyendo carpetas intermedias)
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }

    // Obtiene el nombre del archivo sin extensión
    const baseName = path.basename(file, path.extname(file))
    // Obtiene la extensión del archivo original (.jpg o .png)
    const extName = path.extname(file)
    // Construye la ruta de salida para guardar la versión en JPEG/PNG con calidad optimizada
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    // Construye la ruta de salida para guardar la versión en formato WebP
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    // Construye la ruta de salida para guardar la versión en formato avif
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    // Define opciones de compresión (calidad al 80%) para ambas conversiones
    const options = { quality: 80 }

    // Convierte y guarda la imagen en su formato original (optimizada con calidad 80)
    sharp(file).jpeg(options).toFile(outputFile)
    // Convierte y guarda una copia de la imagen en formato WebP con calidad 80
    sharp(file).webp(options).toFile(outputFileWebp)
    // Convierte y guarda una copia de la imagen en formato Avif con calidad 80
    sharp(file).avif().toFile(outputFileAvif)
}




/*export function hola(done) {
    console.log('Hola desde GULP')

    done()
}*/

export function dev() {
    watch('src/scss/**/*.scss', css) //el doble asterisco busca todas las carpetas que esten dentro de scss y /* busca los archivos que tienen la extension scss
    watch('src/js/**/*.js', js)
    watch('src/img/**/*.{png,jpg}', imagenes)

} //watch con gulp, en el primer import agregamos como parametro watch se usa en la ocnsola npm run dev para ejecutar y Ctrl+c para finalizar

export default series(crop, js, css, imagenes, dev) //permite que al ejecutar run se ejecuten todas estas tareas.