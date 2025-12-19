import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: number;
  name: string;
  first_Name: string;
  last_Name: string;
  email: string;
  phone_No: string;
  dob: string | null;
  profilePic: string | null;
  location: string | null;
  bio: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/Users';

  constructor(private http: HttpClient) {}

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
   * Get user details by ID using the stored token
   */
  getUserById(userId: number): Observable<UserProfile> {
    const token = this.getLocalStorageItem('authToken');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`, { headers });
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers(): Observable<UserProfile[]> {
    const token = this.getLocalStorageItem('authToken');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<UserProfile[]>(this.apiUrl, { headers });
  }

  /**
   * Update user profile
   */
  updateUser(userId: number, userData: Partial<UserProfile>): Observable<UserProfile> {
    const token = this.getLocalStorageItem('authToken');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<UserProfile>(`${this.apiUrl}/${userId}`, userData, { headers });
  }

  /**
   * Check if user is a buyer
   */
  isUserBuyer(userId: number): Observable<any> {
    const token = this.getLocalStorageItem('authToken');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`http://localhost:5000/api/Buyers/${userId}`, { headers });
  }

  /**
   * Check if user is an organizer
   */
  isUserOrganizer(userId: number): Observable<any> {
    const token = this.getLocalStorageItem('authToken');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get(`http://localhost:5000/api/Organizers/${userId}`, { headers });
  }
}
