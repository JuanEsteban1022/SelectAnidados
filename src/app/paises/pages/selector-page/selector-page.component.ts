import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from "rxjs/operators";
import { paisSmall, Pais } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {

  // Llenar selectores
  regiones: string[] = [];
  paises: paisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: paisSmall[] = [];

  // Inyeccion del FormBuilder
  constructor(private fb: FormBuilder, private paisesService: PaisesService) { }

  // UI
  cargando: boolean = false;


  miFormulario: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    // Forma de deshabilitar el select si el campo pais no ha sido seleccionado
    // frontera: [{value: '', disabled: true}, [Validators.required]],
    frontera: ['', [Validators.required]],
  })

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    /* -------------------------------- Con rxjs, utilizando los operadores pipe() ------------------- */
    // Cuando cambie la región
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(_ => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        // Aquí obtengo el valor producto del observable
        switchMap(region => this.paisesService.getPaisesPorRegion(region)),
      )
      .subscribe(paises => {
        console.log(paises);
        this.paises = paises;
        this.cargando = false;
      })

    // Cuando cambia el país
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap(_ => {
          this.miFormulario.get('frontera')?.reset('')
          this.cargando = true;
        }),
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo)),
        switchMap(pais => this.paisesService.getPaisesPorCodigos(pais? pais?.borders: []))
      )
      .subscribe(paises => {
        console.log(paises);
        this.fronteras = paises;
        this.cargando = false;
      })
  }


  guardar() {

    console.log(this.miFormulario.value);
  }

}
