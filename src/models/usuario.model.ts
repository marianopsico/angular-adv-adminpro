import { environment } from '../environments/environment';

const  base_url = environment.base_url;


export class Usuario {

    constructor(
        // Las opcionales siempre al final y las obligatorias al principio
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: string,
        public uid?: string
    ) {}

    get imagenUrl() {

        if ( !this.img ) {
            return `${base_url}/upload/usuarios/no-image`;
        } else if ( this.img.includes('https')) { // tenemos que primero comprobar que no sea la imagen de google
            return this.img;
        } else if (this.img) {
            return `${base_url}/upload/usuarios/${this.img}`;
        } else {
            return `${base_url}/upload/usuarios/no-image`;
        }
    }
}