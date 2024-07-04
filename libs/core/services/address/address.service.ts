import { Injectable } from '@angular/core';
import { RequestService } from '../request/request.service';
import { Observable, catchError } from 'rxjs';
import { environments } from '@expensesreport/environments';

@Injectable({
  providedIn: 'root',
})
export class AddressService extends RequestService {
  getStates(country: string): Observable<StatesResponse> {
    return this.httpClient
      .post<StatesResponse>(
        `${this.addressApiExternal}/states`,
        JSON.stringify({
          country: country,
        }),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  getCities(country: string, state: string): Observable<CitiesResponse> {
    return this.httpClient
      .post<CitiesResponse>(
        `${this.addressApiExternal}/state/cities`,
        JSON.stringify({
          country: country,
          state: state,
        }),
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  getInfoByZip(zip: string): Observable<ZipResponse> {
    return this.httpClient
      .get<ZipResponse>(
        `${environments.zipApiExternal}/search?apikey=${environments.zipApiKey}&codes=${zip}`,
        this.httpOptions
      )
      .pipe(catchError(this.handleError.bind(this)));
  }
}

export interface StatesResponse {
  error: boolean;
  data: {
    name: string;
    iso2: string;
    iso3: string;
    states: {
      name: string;
      state_code: string;
    }[];
  };
}

export interface CitiesResponse {
  error: boolean;
  data: string[];
}

export interface ZipResponse {
  query: {
    codes: string[];
    country: string | null;
  };
  results: {
    [key: string]: {
      postal_code: string;
      country_code: string;
      latitude: string;
      longitude: string;
      city: string;
      state: string;
      city_en: string;
      state_en: string;
      state_code: string;
      province: string;
      province_code: string;
    }[];
  };
}
