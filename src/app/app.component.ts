import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyService } from './currency.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe, NgFor, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'Currency Converter';
  currencyForm!: FormGroup;
  currencies: any[] = [];
  originalCurrency!: string;
  originalAmount!: string;
  resultCurrency!: string;
  resultAmount!: number;

  constructor(private cs: CurrencyService) { }

  ngOnInit() {
    this.cs.getCurrencies().subscribe((response: any) => {
      console.log(response)
      // Set this.currencies and filter out weird currencies without name and short_code
      this.currencies = Object.values(response).filter((currency: any) => {
        return currency['name'] && currency['short_code'];
      });
      console.log(this.currencies);
    });
    
    // Make formGroup accessible via this.currencyForm
    this.currencyForm = new FormGroup({
      'original': new FormGroup({
        'originalCurrency': new FormControl(null),
        'originalAmount': new FormControl(null)
      }),
      'result': new FormGroup({
        'resultCurrency': new FormControl(null),
        'resultAmount': new FormControl(null)
      })
    });
  }

  onSubmit() {
    console.log(this.currencyForm);
    
    // TODO: Convert
    this.cs.convert(this.originalCurrency, this.resultCurrency, parseFloat(this.originalAmount)).subscribe((response: any) => {
      console.log(response);
      // Decimal precision handled in pipe
      this.resultAmount = parseFloat(response.value);
    });
  }

  checkIfEnterPressed(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  noOriginalCurrency() {
    return (this.currencyForm.get('original.originalCurrency') as FormGroup).errors?.['required'];
  }

  noOriginalAmount() {
    return (this.currencyForm.get('original.originalAmount') as FormGroup).errors?.['required'];
  }

  noResultCurrency() {
    return (this.currencyForm.get('result.resultCurrency') as FormGroup).errors?.['required'];
  }
}
