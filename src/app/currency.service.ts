import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CurrencyService {
  constructor(private http: HttpClient) { }

  public getCurrencies() {
    console.log('getCurrencies()');
    let url = `https://api.currencybeacon.com/v1/currencies?api_key=${environment.apiKey}`;
    console.log(url)
    return this.http.get(url, {
      params: {
        type: 'fiat'
      }
    });
  }

  public convert(from: string, to: string, amount: number) {
    console.log('convert( . . . )');
    let url = `https://api.currencybeacon.com/v1/convert?api_key=${environment.apiKey}`;
    console.log(url)
    return this.http.get(url, {
      params: {
        from: from,
        to: to,
        amount: amount
      }
    });;
  }
}
