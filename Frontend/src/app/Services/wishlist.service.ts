import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDto } from './event.service';

export interface CreateWishlistDto {
  userID: number;
  eventID: number;
}

export interface WishlistDto {
  id: number;
  userID: number;
  eventID: number;
  addedDate: string;
  event?: EventDto;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = 'http://localhost:5000/api/Wishlist';

  constructor(private http: HttpClient) { }

  getUserWishlist(userId: number): Observable<WishlistDto[]> {
    return this.http.get<WishlistDto[]>(`${this.apiUrl}/user/${userId}`);
  }

  checkWishlistItem(userId: number, eventId: number): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check/${userId}/${eventId}`);
  }

  addToWishlist(wishlistData: CreateWishlistDto): Observable<WishlistDto> {
    return this.http.post<WishlistDto>(this.apiUrl, wishlistData);
  }

  deleteWishlistItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteWishlistItemByUserAndEvent(userId: number, eventId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${userId}/event/${eventId}`);
  }
}
