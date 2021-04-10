import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string,

    ) {
    
    try {

      const url = `${ base_url }/upload/${ tipo }/${ id }`;
      const formData = new FormData(); // Esto es propio de JS. Es para crear la data que quereos en enviar al fetch
      formData.append('imagen', archivo); // si hubiera mas campos lo agrego aca

      // hacemos la peticion
      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      }) // es propio de JS y nos permite hacer peticiones HTTP

      const data = await resp.json();

      if ( data.ok ) {
        return data.nombreArchivo;
      } else {
        console.log(data.msg);
        return false;
      }

    } catch (error) {
        console.log(error);
        return false;
    }
  }
}
