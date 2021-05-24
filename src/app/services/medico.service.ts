import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medico } from 'src/models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  };
  
  get headers() {
    return {
      headers: {
        'x-token': this.token
        }
    }
  }

  cargarMedicos() {

    const url = `${ base_url }/medicos`;
    return this.http.get( url, this.headers )
    .pipe(
      // el tipo de respuesta es una arreglo de medicos
      map( (resp: {ok: boolean, medicos: Medico[] }) => resp.medicos )
    )
  }

  obternerMedicoPorId( id: string) {
    const url = `${ base_url }/medicos/${ id }`;
    return this.http.get( url, this.headers )
    .pipe(
      // el tipo de respuesta es una arreglo de medicos
      map( (resp: {ok: boolean, medico: Medico }) => resp.medico )
    )

  }

  crearMedico( medico: { nombre: string, hospital: string} ) { // nos aseguramos que venga lo necesario para crear un medico

    const url = `${ base_url }/medicos`;
    return this.http.post( url, medico , this.headers ) // mandamos el obejto medico
    
  }

  actualizarMedico( medico: Medico ) {

    const url = `${ base_url }/medicos/${ medico._id }`;
    return this.http.put( url, medico , this.headers )
    
  }

  borrarMedico( _id: string ) {

    const url = `${ base_url }/medicos/${ _id }`;
    return this.http.delete( url, this.headers )
    
  }
}
