import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { Hospital } from 'src/models/hospital.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor( private  hospitalService: HospitalService,
               private modalImagenService: ModalImagenService,
               private busquedasService: BusquedasService ) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe(); // prevenimos la fuga de memoria que varios listeners esten escuchando a la vez
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(300) // le ponemos un delay para darle tiempo al servidor para que traiga la imagen
      )
      .subscribe( 
        img => this.cargarHospitales() );
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.cargarHospitales(); 
    }

    this.busquedasService.buscar('hospitales', termino )
      .subscribe( resultados => {
        this.hospitales = resultados;
      });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
    // para que se dispare tenemos que hacer el subscribe
    .subscribe( hospitales => {
      this.cargando = false;
      this.hospitales = hospitales
    })
  }

  guardarCambios( hospital: Hospital ) {
    this.hospitalService.actualizarHospital( hospital._id, hospital.nombre )
    .subscribe( resp => {
      Swal.fire('Actualizado', hospital.nombre, 'success');
    });
  }

  eliminarHospital( hospital: Hospital ) {
    this.hospitalService.borrarHospital( hospital._id )
    .subscribe( resp => {
      this.cargarHospitales();
      Swal.fire('Borrado', hospital.nombre, 'success');
    });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: "Crear Hospital",
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true,
    })
    
    if( value.trim().length > 0) {
      this.hospitalService.crearHospital( value )
      .subscribe( (resp: any) => {
        this.hospitales.push( resp.hospital )
      })
    } 
  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }


}
