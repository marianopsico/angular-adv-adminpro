import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

// ! retry es para cuando el observable fallo y lo queremos intentar nuevamente
// ! podemos definir que cantiddad de veces lo vamos a intentar


//! no es comun subscribirse al observable en el mismo lugar que se crea!

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy { // destruimos el componente

  //! guardamos el valor del observable en una propiedad de la clase
  public intervalSubs: Subscription; // public es opcional


  constructor() {
    // this.retornaObservable().pipe(
    //   retry(2)
    // ).subscribe(
    //   valor => console.log('Subs:', valor ),
    //   error => console.warn('Error:', error ),
    //   () => console.info('Obs terminado')
    // );
    //! nos subscribimos al producto de retornaIntervalo()
    this.intervalSubs = this.retornaIntervalo().subscribe( console.log ) // emitimos los valores que recibimos

  }
  
  //! tenemso que limpiar el observable, tenemos que cancelar ese observable para que 
  //! se limpie cuando ya nadie este subscripto 
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  // es importante definir que tipo de informacion fluye a traves del observable
  retornaIntervalo(): Observable<number> {

    //! interval ya viene configurado es un observable
    return interval(100) // de decimos los segundos
            .pipe(
              //! el operador take() le dice cuantas emisiones del obersable necesita
              // take(10), //! ojo es importante el orden de este, deberia ir al final si no llega a 10 y no sigue
              //! el operador map sirve para transformar la salida de un obervable
              map( valor => valor + 1), // 0 => 1
              //! podemos filtrar inforamcion que fluye dentro del observable
              filter( valor => ( valor % 2 === 0 ) ? true : false ),
            );
  }

  //! creamos una funcion que regresa el observable
  //! este observable emite numeros
  retornaObservable(): Observable<number> {
    let i = -1;
    
    return new Observable<number>( observer => {
      
      const intervalo = setInterval( () => {
        
        i++;
        observer.next(i);

        if ( i === 4 ) {
          clearInterval( intervalo );
          observer.complete();
        }

        if ( i === 2 ) {
          observer.error('i llego al valor de 2');
        }

      }, 1000 )

    });

  }

}