import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { Hospital } from 'src/models/hospital.model';
import { Medico } from 'src/models/medico.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {


    this.activatedRoute.params.subscribe( ({ id }) => {
      // console.log(id);
      this.cargarMedico( id );
    })

    
    // establecemos la informacion del formulario
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required ],
      hospital: ['', Validators.required ]
    });

    this.cargarHospitales();

    // usamos valuCHanges que es un observable
    this.medicoForm.get('hospital').valueChanges
      .subscribe( hospitalId => {
        // console.log(hospitalId)


        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId)// es una funcion sincrona porque es un arreglo que esta en memoria
        
        // console.log(this.hospitalSeleccionado);
      
      })
  }

  cargarMedico(id: string) {

    if ( id === 'nuevo' ) {
      return;
    }

    this.medicoService.obternerMedicoPorId( id )
      .pipe(
        delay(100) // agregamos un delay para que se carguen las imagenes, le damos tiempo para que se seteen los valores
      )
      .subscribe( medico => {
        // console.log( medico );

        if ( !medico ) {
          return this.router.navigateByUrl(`/dashboard/medicos`);
        }
        const { nombre, hospital:{ _id} } = medico; // desestructuramos y obtenemos lo necesario
        // console.log( nombre, _id );
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({ nombre, hospital: _id });
      });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
    .subscribe( (hospitales: Hospital[]) => {
      // console.log(hospitales)
      this.hospitales = hospitales;
    })
  }

  guardarMedico() {
    // console.log( this.medicoForm.value );

    const {nombre} =  this.medicoForm.value;

    // si hay un medico seleccionado es porque vamos a actualizar
    if ( this.medicoSeleccionado ) {
      // actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico( data)
        .subscribe( resp => {
          console.log( resp );
          Swal.fire('Actualizado', `${ nombre } actualizado correctamente`, 'success');
        })
    } else {
      //crear

      const {nombre} =  this.medicoForm.value;

      this.medicoService.crearMedico( this.medicoForm.value )
        .subscribe( (resp: any) => {
          console.log( resp );
          Swal.fire('Creado', `${ nombre } creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id}`)
        }) 
      }
    }
}
