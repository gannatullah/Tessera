import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usersinterface } from '../../interfaces/usersinterface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private _httpClient: HttpClient) { }

  /**
   * Fetch user data by email for login authentication
   * @param email - User's email address
   * @returns Observable<Usersinterface>
   */
  login(email: string): Observable<Usersinterface> {
    const url = `${this.apiUrl}/users/email/${email}`;

    return this._httpClient.get<Usersinterface>(url).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get all users (for admin purposes)
   * @returns Observable<Usersinterface[]>
   */
  getallusers(): Observable<Usersinterface[]> {
    return this._httpClient.get<Usersinterface[]>(`${this.apiUrl}/users/`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   * @param error - HTTP error response
   * @returns Observable that throws error
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('AuthService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
