import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit, OnDestroy {

  // extraemos dos propieadades
  public totalUsarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription;

  public desde: number = 0;
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
               private busquedasService: BusquedasService,
               private modalImagenService: ModalImagenService  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe(); // de esta manera no tengo fuga de memoria o se va a cargar dos veces
  };

  ngOnInit(): void {
    this.cargarUsuarios();
    
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(300) // le ponemos un delay para darle tiempo al servidor para que traiga la imagen
      )
      .subscribe( 
        img => this.cargarUsuarios() );
  }

  cargarUsuarios() {
    this.cargando = true;
    // disparamos la peticion
    this.usuarioService.cargarUsuarios(this.desde).
    subscribe( ({ total, usuarios }) => {
      this.totalUsarios = total;
      if (usuarios.length !== 0) {
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      }
    })
  }

  cambiarPagina( valor: number ) {
    this.desde += valor;

    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde > this.totalUsarios ) {
      this.desde -= valor; 
    }
    this.cargarUsuarios();
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar('usuarios', termino )
      .subscribe( resultados => {
        this.usuarios = resultados;
      });
  }

  eliminarUsuario( usuario: Usuario ) {

    // no me puedo eliminar a mi mismo
    if ( usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo!', 'error');
    }
    
    Swal.fire({
      title: 'Borrar Usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario( usuario )
        .subscribe( resp => {
          this.cargarUsuarios();
          Swal.fire('Usuario borrado!',
          `${ usuario.nombre} fue eliminado correctamente`,
          'success' 
          );
        });
      }
    })
  }
  cambiarRole( usuario: Usuario ) {
    this.usuarioService.guardarUsuario( usuario )
     .subscribe( resp => {
       console.log( resp );
     });

    console.log( usuario );
  }
  abrirModal( usuario: Usuario ) {
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
