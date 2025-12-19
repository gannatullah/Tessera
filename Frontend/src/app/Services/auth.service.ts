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

  /**
   * Safely set item in localStorage
   */
  private setLocalStorageItem(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  }

  /**
   * Safely get item from localStorage
   */
  private getLocalStorageItem(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }

  /**
   * Safely remove item from localStorage
   */
  private removeLocalStorageItem(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          // Store token
          this.setLocalStorageItem('authToken', response.token);
          
          // Store user ID
          this.setLocalStorageItem('userId', response.id.toString());
          
          // Store user email
          this.setLocalStorageItem('userEmail', response.email);
          
          // Store user name
          this.setLocalStorageItem('userName', response.name);
          
          // Store user data object for backward compatibility
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
          
          this.currentUserSubject.next(user);
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData);
  }

  logout(): void {
    this.removeLocalStorageItem('authToken');
    this.removeLocalStorageItem('userId');
    this.removeLocalStorageItem('userEmail');
    this.removeLocalStorageItem('userName');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getLocalStorageItem('authToken');
  }

  getToken(): string | null {
    return this.getLocalStorageItem('authToken');
  }

  getCurrentUser(): User | null {
    const userId = this.getLocalStorageItem('userId');
    const userEmail = this.getLocalStorageItem('userEmail');
    const userName = this.getLocalStorageItem('userName');
    
    if (!userId || !userEmail || !userName) {
      return null;
    }
    
    return {
      id: parseInt(userId),
      email: userEmail,
      name: userName,
      first_Name: '',
      last_Name: '',
      phoneNo: ''
    };
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}