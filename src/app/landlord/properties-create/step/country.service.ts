import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {State} from "../../../core/model/state.model";
import {Country} from "./location-step/country.model";
import {catchError, map, Observable, of, pipe, shareReplay, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  http = inject(HttpClient);

  private countries$: WritableSignal<State<Array<Country>>> =
    signal(State.Builder<Array<Country>>().forInit());
    countries = computed(() => this.countries$());

    // razlog zasto jer zelimo kesati json koji cemo hvatati s backend-a, i ne zelimo da svaki put kada pozovemo ovaj servis ponovno hvatamo json file
    private fetchCountry$ = new Observable<Array<Country>>();


  constructor() {
    this.initFetchGetAllCountries();
    this.fetchCountry$.subscribe();
  }

  initFetchGetAllCountries(): void {
    this.fetchCountry$ = this.http.get<Array<Country>>("/assets/countries.json")
      .pipe(
        tap(countries => this.countries$.set(State.Builder<Array<Country>>().forSuccess(countries))),
        catchError(err => {
          this.countries$.set(State.Builder<Array<Country>>().forError(err));
          return of(err)
        }),
        //poziva svaki put kada je observable iskoristena
        shareReplay(1)
      );
  }

  public getCountryByCode(code: string): Observable<Country> {
    return this.fetchCountry$.pipe(
      map(countries => countries.filter(country => country.cca3 === code)),
      // ne zelimo array
      map(countries => countries[0])
    )
  }
}
