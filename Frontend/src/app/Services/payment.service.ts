import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.example';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl + '/payments';

  stripePromise = loadStripe(environment.stripePublishableKey);

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, currency: string = 'egp'): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/create-intent`,
      { amount: Math.round(amount * 100), currency } // Convert to smallest currency unit
    );
  }
}
