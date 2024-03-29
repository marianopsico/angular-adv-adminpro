import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public usuario: Usuario;

  constructor( public sidebarService: SidebarService, // lo pasamos por referencia por eso es public
                private usuarioService: UsuarioService ) {

  
    this.usuario = usuarioService.usuario; // es una instancia del modelo
   }

  ngOnInit(): void {
  }

}
