import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private apiUrl = 'http://localhost:5001/api/Users';
  
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required])
  });

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Use the login endpoint
    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.http.post<any>(`${this.apiUrl}/login`, loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.successMessage = 'Login successful! Redirecting...';
        
        // Store JWT token
        localStorage.setItem('authToken', response.token);
        
        // Store user data ..... WHY !!
        // localStorage.setItem('currentUser', JSON.stringify({
        //   id: response.id,
        //   email: response.email,
        //   name: response.name,
        //   firstName: response.first_Name,
        //   lastName: response.last_Name,
        //   phoneNo: response.phone_No
        // }));

        // Navigate after short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']).catch(() => {
            console.log('Navigation attempted - no dashboard route configured');
          });
        }, 1500);
        
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error:', error);
        
        if (error.status === 404 || error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }
}