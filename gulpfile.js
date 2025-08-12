import { src, dest } from 'gulp'
import * as dartSass from 'sass'

import gulpSass from 'gulp-sass' //dependencia para usar sass  en el archivo de gulpfile


const sass = gulpSass(dartSass)

export function css(done){
    src('src/scss/app.scss') //ubica el archivo
        .pipe(sass()) //aplica sass
        .pipe(dest('build/css')) //.pipe controla el orden en el cual se va a ir ejecutando las funciones
    done()
}

//todo el codigo anterior hace lo mismo que enrutar el archivo de css , aqui borre la carpeta build y volvi a correr nmp run css



/*export function hola(done) {
    console.log('Hola desde GULP')

    done()
}*/