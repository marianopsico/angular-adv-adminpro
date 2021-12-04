import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators'; // el tap dispara un efecto secundario

import { environment } from 'src/environments/environment';
import { Usuario } from 'src/models/usuario.model';
import Swal from 'sweetalert2';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

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

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' { // el rol si o si es uno de esto dos (ver modelo)
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario.uid || '';
  } 
  get headers() {
    return {
      headers: {
        'x-token': this.token
        }
    }
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

  guardarLocalStorage( token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu) ); // como unicamneten se puede grabar un string lo convertimos
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu'); // Borrar menu

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
        this.guardarLocalStorage( resp.token, resp.menu );

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
                        this.guardarLocalStorage( resp.token, resp.menu );

                        // console.log( resp );
                      })
                    )
  
  }
  actualizarPerfil( data: {email: string, nombre: string, role: string  }) {

    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/usuarios/${ this.uid }`, data, this.headers );
  }
  login( formData: LoginForm ) {
    
    return this.http.post(`${base_url}/login`, formData )
      .pipe(
        tap( (resp: any) => {
          // si tenemos un email que existe entonces lo vamos a guardar 
          // en el localStorage
          this.guardarLocalStorage( resp.token, resp.menu );

          // console.log( resp );
        })
      )
  
  }
  loginGoogle( token ) {
    
    return this.http.post(`${base_url}/login/google`, { token } )
      .pipe(
        tap( (resp: any) => {
          
          this.guardarLocalStorage( resp.token, resp.menu );

        })
      )
  
  }
  cargarUsuarios( desde: number = 0 ) {

    // localhost:3000/api/usuarios?desde=0
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>(url, this.headers)
    .pipe(
      // delay(5000),
      map( resp => {
        const usuarios = resp.usuarios.map( 
          user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid) )

        // console.log( resp );
        // es fundamental retormar la respuesta
        return {
          total: resp.total,
          usuarios
        };
      })
    )
  }

  
  eliminarUsuario( usuario: Usuario ) {

    const url = `${ base_url }/usuarios/${ usuario.uid }`;
    return this.http.delete(url, this.headers);
  }
  guardarUsuario( usuario: Usuario ) {
    return this.http.put(`${base_url}/usuarios/${ usuario.uid }`, usuario, this.headers );
  }
}
