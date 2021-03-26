import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'; // el tap dispara un efecto secundario

import { environment } from 'src/environments/environment';

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

  constructor( private http: HttpClient,
               private router: Router,
               // esto es cuando llamamos a funciones de librerias de terceros ANgular nos pide que imlementemos NgZOne
               private ngZone: NgZone ) { 


              // en Angular como aplica el patron singleton
              // tenemos una sola instancia de cada cosa
                this.googleInit(); // este metodo se ejecuta una sola vez
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
    const token = localStorage.getItem('token') || '';

    //peticionamos al Backend
    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        // renovamos el token
        localStorage.setItem('token', resp.token);
      }),
      map( resp => true ), // necesitamos retornar un booleano, si tenemos una respeusta entonces es trues
      
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
