import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

import { Usuario } from 'src/models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File; 
  public imgTemp: any = null;

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private fileUploadService: FileUploadService ) { 

                // aca hacemos la asignacion al puntero donde esta la data`
                this.usuario = usuarioService.usuario;

               }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre, Validators.required ],
      email: [ this.usuario.email, [ Validators.required, Validators.email ]],
    });
  }

  actualizarPerfil() {
    // console.log(this.perfilForm.value);
    
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
      .subscribe( resp => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        
        Swal.fire('Guardado', 'Cambios fueron guardados', 'success');  
      }, (err) => {
        Swal.fire('Error', err.error.msg , 'error');
      })
  }

  cambiarImagen( file: File ) {
    
    this.imagenSubir = file;

    if ( !file ) {
      return this.imgTemp = null;
    }
    const reader = new FileReader(); // propio de JS
    const url64 = reader.readAsDataURL( file ); // lo convertimos

    // mostramos el url
    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log(reader.result); 
    }
  }

  subirImagen() {

    this.fileUploadService
      .actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid )
      .then( img => {
        this.usuario.img = img;
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');   
      }).catch( err => {
        Swal.fire('Error', 'No se pudo subir la imagen' , 'error');
      }); // como el objeto pasa por referencia lo actualiza
  }

}
