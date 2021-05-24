import { Hospital } from "./hospital.model";

interface _MedicolUser {
    _id: string,
    nombre: string,
    img: string
}


export class Medico {
    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _MedicolUser,
        public hospital?: Hospital
    ) {}
}