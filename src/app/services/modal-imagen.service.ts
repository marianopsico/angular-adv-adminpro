import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  public tipo: 'usuarios' | 'hospitales' | 'medicos';
  public id: string;
  public img: string

  // ponemos un event emiter un observable que emita algo y le avise al componente que cambio la imagen
  // puedo subscribirme a este observable en cualquier lugar que yo quiera
  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  // el guien bajo es un estandar de la industria para indicar que la propiedad es privada
  private _ocultarModal: boolean = true;

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios' | 'hospitales' | 'medicos',
    id: string,
    img: string = 'no-img',
  ) {
    
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;

    if ( img.includes('https') ) { // vemos si es de google
      this.img = img;
    } else {
      this.img = `${ base_url }/upload/${ tipo }/${ img }`
    }
    // this.img = img;
    
  }
  cerrarModal() {
    this._ocultarModal = true;
  }

  constructor() { }
}
