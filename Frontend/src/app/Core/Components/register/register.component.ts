import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { count } from 'console';
import { first } from 'rxjs';
import { Country, City } from 'country-state-city';
import countries from 'world-countries';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent implements OnInit {
today = new Date();
endRange=new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toISOString().split('T')[0];
maxBirthdate = new Date(this.today.getFullYear() - 18, this.today.getMonth(), this.today.getDate()).toISOString().split('T')[0];
minBirthdate = new Date(this.today.getFullYear() - 100, this.today.getMonth(), this.today.getDate()).toISOString().split('T')[0];

countries :any[] = [];
cities?: any[] = [];
nationalities = Array.from(
  new Set(
    countries.map(c => c.demonyms?.['eng']?.m).filter(n => !!n)
  )
) as string[];




//control names must match the json keys in backend
  registerForm: FormGroup=new FormGroup({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    confirmPassword: new FormControl(null, [Validators.required]),
    mobileNumber: new FormControl(null, [Validators.required]),
    dateOfBirth: new FormControl(null, [Validators.required, this.validateAge()]),
    country: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
    nationality: new FormControl(null, [Validators.required])
  },{validators:this.validateConfirmPassword}
);

ngOnInit(): void {

    this.countries = Country.getAllCountries();
}
onCountryChange(countryCode: string) {
  this.cities = City.getCitiesOfCountry(countryCode);
}
  register(){
    console.log(this.registerForm);
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
    }
    else{
      this.registerForm.reset();
    }
  }

  validateConfirmPassword(form:AbstractControl){
    const password=form.get('password')?.value;
    const confirmPassword=form.get('confirmPassword')?.value;
    if(password==confirmPassword){
      return null;
  }
  else{
    return {passwordMismatch:true};
  }
}
validateAge(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthDate = new Date(control.value);
    if (!birthDate) return null;

    const today = new Date();

    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate()); // 100 years ago
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());  // 18 years ago

    const valid = birthDate >= minDate && birthDate <= maxDate;

    return valid ? null : { ageRange: { minAge: 18, maxAge: 100 } };
  };
}

}
