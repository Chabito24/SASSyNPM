import { src, dest, watch } from 'gulp';
import * as dartSass from 'sass';

import gulpSass from 'gulp-sass'; //dependencia para usar sass  en el archivo de gulpfile


const sass = gulpSass(dartSass);

export function css(done) {
    src('src/scss/app.scss', {sourcemaps: true}) //ubica el archivo y spucemap nos permite saber en inpector en au archivo y que linea se encuentra ese codigo
        .pipe(sass().on('error', sass.logError)) //aplica sass, // .on....<--- maneja errores de compilación
        .pipe(dest('build/css', {sourcemaps: true})) //.pipe controla el orden en el cual se va a ir ejecutando las funciones
    done();
}

//todo el codigo anterior hace lo mismo que enrutar el archivo de css , aqui borre la carpeta build y volvi a correr nmp run css y crea nuevamente la carpeta de build/css y sus archivo app.css



/*export function hola(done) {
    console.log('Hola desde GULP')

    done()
}*/

export function dev() {
    watch('src/scss/**/*.scss', css); //el doble asterisco busca todas las carpetas que esten dentro de scss y /* busca los archivos que tienen la extension scss

} //watch con gulp, en el primer import agregamos como parametro watch se usa en la ocnsola npm run dev para ejecutar y Ctrl+c para finalizar