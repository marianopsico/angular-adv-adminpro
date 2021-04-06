import { Component } from '@angular/core';
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

  constructor( private usuarioService: UsuarioService) { 
    this.usuario = usuarioService.usuario; // es una instancia de la clase
  }

  logout() {
    this.usuarioService.logout();
  }
}
