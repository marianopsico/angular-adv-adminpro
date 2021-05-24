import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';

//! en este modulo lo creamos para centralizar todos los PIPES

@NgModule({
  declarations: [ ImagenPipe ],
  exports: [
    ImagenPipe
  ]
})
export class PipesModule { }
