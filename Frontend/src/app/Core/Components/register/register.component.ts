import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Country, City } from 'country-state-city';
import countries from 'world-countries';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private apiUrl = 'http://localhost:5000/api/Users';

  today = new Date();
  endRange = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toISOString().split('T')[0];
  maxBirthdate = new Date(this.today.getFullYear() - 18, this.today.getMonth(), this.today.getDate()).toISOString().split('T')[0];
  minBirthdate = new Date(this.today.getFullYear() - 100, this.today.getMonth(), this.today.getDate()).toISOString().split('T')[0];

  countries: any[] = [];
  cities?: any[] = [];
  nationalities = Array.from(
    new Set(
      countries.map(c => c.demonyms?.['eng']?.m).filter(n => !!n)
    )
  ) as string[];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl(null, [Validators.required]),
    mobileNumber: new FormControl(null, [Validators.required]),
    dateOfBirth: new FormControl(null, [Validators.required, this.validateAge()]),
    country: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
    nationality: new FormControl(null, [Validators.required]),
    bio: new FormControl(null, [Validators.maxLength(1000)])
  }, { validators: this.validateConfirmPassword });

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.countries = Country.getAllCountries();
  }

  onCountryChange(countryCode: string) {
    this.cities = City.getCitiesOfCountry(countryCode);
    this.registerForm.patchValue({ city: null }); // Reset city when country changes
  }

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Map form data to match backend DTO structure
    const registerData = {
      name: `${this.registerForm.value.firstName} ${this.registerForm.value.lastName}`,
      first_Name: this.registerForm.value.firstName,
      last_Name: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      phone_No: this.registerForm.value.mobileNumber,
      password: this.registerForm.value.password,
      dob: this.registerForm.value.dateOfBirth,
      location: this.registerForm.value.country, // Send country as location
      bio: this.registerForm.value.bio
    };

    console.log('Sending registration data:', registerData);

    this.http.post<any>(this.apiUrl, registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.successMessage = 'Account created successfully! Redirecting to login...';
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']).catch(() => {
            console.log('Navigation attempted - login route');
          });
        }, 2000);
        
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration error:', error);
        
        if (error.status === 400 && error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 400) {
          this.errorMessage = 'Email already exists or invalid data provided';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }

  validateConfirmPassword(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password == confirmPassword) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  }

  validateAge(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthDate = new Date(control.value);
      if (!birthDate) return null;

      const today = new Date();
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

      const valid = birthDate >= minDate && birthDate <= maxDate;
      return valid ? null : { ageRange: { minAge: 18, maxAge: 100 } };
    };
  }
}