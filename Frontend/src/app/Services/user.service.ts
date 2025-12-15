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
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/Users';

  constructor(private http: HttpClient) {}

  /**
   * Get user details by ID using the stored token
   */
  getUserById(userId: number): Observable<UserProfile> {
    const token = localStorage.getItem('authToken');
    
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
    const token = localStorage.getItem('authToken');
    
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
    const token = localStorage.getItem('authToken');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<UserProfile>(`${this.apiUrl}/${userId}`, userData, { headers });
  }
}
