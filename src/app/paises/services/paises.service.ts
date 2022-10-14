import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pais, paisSmall } from '../interfaces/paises.interface';
import { Observable, of, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  constructor(private http: HttpClient) { }

  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private _baseUrl: string = 'https://restcountries.com/v3';

  get regiones() {
    // Crea una copia del arreglo para no alterar el original
    return [...this._regiones];
  }

  getPaisesPorRegion(region: string): Observable<paisSmall[]> {
    const url: string = `${this._baseUrl}/region/${region}?fields=cca3,name`;
    return this.http.get<paisSmall[]>(url);
  }

  getPaisPorCodigo(codigo: string): Observable<Pais | null> {

    if (!codigo) {
      return of(null)
    }

    const url = `${this._baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais>(url);
  }

  getPaisesPorCodigoSmall(codigo: string): Observable<paisSmall> {
    const url: string = `${this._baseUrl}/alpha/${codigo}?fields=cca3,name`;
    return this.http.get<paisSmall>(url);
  }

  getPaisesPorCodigos(borders: string[]): Observable<paisSmall[]> {
    if (!borders) {
      return of([]);
    }

    const peticiones: Observable<paisSmall>[] = [];

    borders.forEach(codigo => {
      const peticion = this.getPaisesPorCodigoSmall(codigo);
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);

  }

}
