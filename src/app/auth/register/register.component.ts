import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent  {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['Mariano', Validators.required ],
    email: ['test3@test.com', [ Validators.required, Validators.email ] ],
    password: ['1234', Validators.required ],
    password2: ['1234', Validators.required ],
    terminos: [ true, Validators.required ],
  }, {
    // aqui ponemos nuestros propios validadores personalizados
    validators: this.passwordsIguales('password', 'password2')
  }  as AbstractControlOptions ); 

  constructor( private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router ) { }


  crearUsuario() {
    this.formSubmitted = true;

    console.log( this.registerForm.value );

    if ( this.registerForm.invalid || this.registerForm.get('terminos').value == false) {
      return;
    }

    
    // realizar el posteo
    this.usuarioService.crearUsuario( this.registerForm.value )
        .subscribe( resp => {

          // Navegar al Dashboard
          this.router.navigateByUrl('/');

        }, (err) => {
          // si sucede un error
          Swal.fire('Error', err.error.msg, 'error');
        } );

  }

  campoNovalido( campo: string ): boolean {

    // si el formulario se posteo y el campo no es valido
    if ( this.registerForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  contrasenasNoValidas() {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if ( (pass1 !== pass2) && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }
  aceptaTerminos() {
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }
  passwordsIguales( pass1Name: string, pass2Name: string ) {
    // necesitamos siemrpe retornar una funcion
    return ( formGroup: FormGroup ) => {

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      // entonces preguntamos si son iguales

      if ( pass1Control.value === pass2Control.value ) {
        // ponemos el error
        pass2Control.setErrors(null)
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    }
  }
}

