import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyService } from './currency.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'Currency Converter';
  currencyForm!: FormGroup;
  currencies: any[] = [];
  originalCurrency = 'Loading . . .';
  originalAmount!: string;
  resultCurrency = 'Loading . . .';
  resultAmount!: string;

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
    
    // Subscribe to changes
    this.currencyForm.statusChanges.subscribe(
      (value) => console.log(value)
    );
  }

  onSubmit() {
    console.log(this.currencyForm);
    
    // TODO: Convert
    this.cs.convert(this.originalCurrency, this.resultCurrency, parseFloat(this.originalAmount)).subscribe((response: any) => {
      console.log(response);
      this.resultAmount = parseFloat(response.value).toFixed(2);
    });
  }
}
