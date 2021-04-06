import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'; // el tap dispara un efecto secundario

import { environment } from 'src/environments/environment';
import { Usuario } from 'src/models/usuario.model';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';

// ! manejamos todas las peticiones HTTP con un servicio personalizado

const base_url = environment.base_url;

declare const gapi: any;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario; // en js todos los objetos son pasados por referencia, aqui tenemos todo el objeto usuario

  constructor( private http: HttpClient,
               private router: Router,
               // esto es cuando llamamos a funciones de librerias de terceros ANgular nos pide que imlementemos NgZOne
               private ngZone: NgZone ) { 


              // en Angular como aplica el patron singleton
              // tenemos una sola instancia de cada cosa
                this.googleInit(); // este metodo se ejecuta una sola vez
               }

  get token(): string {
    return localStorage.getItem('token') || '';
  };

  get uid(): string {
    return this.usuario.uid || '';
  } 

  googleInit() {

    return new Promise( resolve => { // a diferencia de los observables las promesas siempre se ejecutan
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '106102625229-m4tk764c7201pud6d42sgksg6b1rvemk.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      })
    });
  }

  logout() {
    localStorage.removeItem('token');
    

    this.auth2.signOut().then( () => {

      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  // usamos el renew token
  validarToken(): Observable<boolean> {
  
    //peticionamos al Backend
    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        const { 
          email,
          google,
          img = '',
          nombre,
          role,
          uid } = resp.usuario;

        // ! si queremos usar los metodos del modelo debemos crearnos una instancia
        this.usuario = new Usuario(nombre, email,'', img , google, role, uid);

        // renovamos el token
        localStorage.setItem('token', resp.token);
        return true;
      }), 
      // el of retorna un nuevo observable es para no romper el ciclo
      catchError( error => of (false) ) // atrapa el error de este flujo y regresa un nuevo obeservable con el valor false, no se logro autenticar
      );
  }

  crearUsuario( formData: RegisterForm ) {
    
    // como es un observable me tengo que subscribir, con el return ya
    // cumplo con eso, tambien podria poner un subscribe al final
    // nos subscribimos en donde realizamos el posteo
    return this.http.post(`${base_url}/usuarios`, formData )
                    .pipe(
                      tap( (resp: any) => {
                        // si tenemos un email que existe entonces lo vamos a guardar 
                        // en el localStorage
                        localStorage.setItem('token', resp.token);

                        // console.log( resp );
                      })
                    )
  
  }

  actualizarPerfil( data: {email: string, nombre: string, role: string  }) {

    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/usuarios/${ this.uid }`, data, { 
      headers: {
      'x-token': this.token
      }
    })
  }

  login( formData: LoginForm ) {
    
    return this.http.post(`${base_url}/login`, formData )
      .pipe(
        tap( (resp: any) => {
          // si tenemos un email que existe entonces lo vamos a guardar 
          // en el localStorage
          localStorage.setItem('token', resp.token);

          // console.log( resp );
        })
      )
  
  }

  loginGoogle( token ) {
    
    return this.http.post(`${base_url}/login/google`, { token } )
      .pipe(
        tap( (resp: any) => {
          
          localStorage.setItem('token', resp.token);

        })
      )
  
  }
}
