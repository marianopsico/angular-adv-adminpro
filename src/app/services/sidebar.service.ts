import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu = [];

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];

    // en caso de haber un problema con esto podriamos redirigir al login al usuario
    // if ( this.menu.length === 0) {

    // }
  }

  // menu: any[] = [
  //   {
  //     titulo: 'Principal',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Main', url: '/'},
  //       { titulo: 'Gráficas', url: 'grafica1'},
  //       { titulo: 'Rxjs', url: 'rxjs'},
  //       { titulo: 'Promesas', url: 'promesas'},
  //       { titulo: 'ProgressBar', url: 'progress'},
  //     ]
  //   },
  //   {
  //     titulo: 'Mantenimientos',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios', url: 'usuarios'},
  //       { titulo: 'Hospitales', url: 'hospitales'},
  //       { titulo: 'Médicos', url: 'medicos'}
  //     ]
  //   }
  // ];


}
