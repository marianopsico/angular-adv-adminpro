import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public usuario: Usuario;

  constructor( private usuarioService: UsuarioService,
               private router: Router) { 
    this.usuario = usuarioService.usuario; // es una instancia de la clase
  }

  logout() {
    this.usuarioService.logout();
  }

  buscar( termino: string) {

    if ( termino.length === 0 ) {
      // this.router.navigateByUrl('/dashboard/'); 
      return;
    }
    
    this.router.navigateByUrl(`/dashboard/buscar/${ termino }`);

  }
}
