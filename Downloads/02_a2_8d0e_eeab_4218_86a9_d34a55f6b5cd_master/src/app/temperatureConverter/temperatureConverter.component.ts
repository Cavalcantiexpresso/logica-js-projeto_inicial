import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'temperature-converter',
  templateUrl: './temperatureConverter.component.html',
  styleUrls: ['./temperatureConverter.component.scss']
})

export class TemperatureConverter implements OnInit {

  celsius: number;
  fahrenheit: number;


  ngOnInit() {
    console.log('')
    // C = (F − 32) × 5/9
    // F = C*9/5 + 32
  }
  converCelsiusToFahrenheit() {
    if (this.celsius !== undefined) {
      this.fahrenheit = parseFloat((this.celsius * 9 / 5 + 32).toFixed(1));
    } else {
      this.fahrenheit = undefined;
    }
  }

  converTFahrenheitToCelsius() {
    if (this.fahrenheit !== undefined) {
      this.celsius = parseFloat(((this.fahrenheit - 32) * 5 / 9).toFixed(1));
    } else {
      this.celsius = undefined;
    }
  }



}
