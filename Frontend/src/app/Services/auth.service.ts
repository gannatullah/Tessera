import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
  id: number;
  email: string;
  name: string;
  first_Name: string;
  last_Name: string;
  phoneNo: string;
  location?: string;
  bio?: string;
  profilePic?: string;
}

interface LoginResponse {
  id: number;
  name: string;
  first_Name: string;
  last_Name: string;
  email: string;
  phone_No: string;
  dob: string;
  location?: string;
  bio?: string;
  profilePic?: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/Users';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Store token
          localStorage.setItem('authToken', response.token);
          
          // Store user ID
          localStorage.setItem('userId', response.id.toString());
          
          // Store user data
          const user: User = {
            id: response.id,
            email: response.email,
            name: response.name,
            first_Name: response.first_Name,
            last_Name: response.last_Name,
            phoneNo: response.phone_No,
            location: response.location,
            bio: response.bio,
            profilePic: response.profilePic
          };
          
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}