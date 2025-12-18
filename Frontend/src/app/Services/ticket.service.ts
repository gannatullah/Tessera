import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TicketDto {
  event?: EventDto;
  ticket_ID: number;
  status: string;
  qr_Code?: string;
  ticketTypeID: number;
  eventID: number;
  userID?: number;
  ticketType?: TicketTypeDto;
}

export interface TicketTypeDto {
  id: number;
  name: string;
  price: number;
  quantity_Total: number;
  quantity_Sold: number;
  eventID: number;
}

export interface EventDto {
  eventId: number;
  name: string;
  category: string;
  date: string;
  stDate: string;
  eDate: string;
  city?: string;
  location?: string;
  capacity?: number;
  organizerId: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:5000/api/Tickets';

  constructor(private http: HttpClient) { }

  /**
   * Get user tickets by user ID
   */
  getUserTickets(userId: number): Observable<TicketDto[]> {
    return this.http.get<TicketDto[]>(`${this.apiUrl}/usertickets/${userId}`);
  }

  /**
   * Get all tickets (admin only)
   */
  getAllTickets(): Observable<TicketDto[]> {
    return this.http.get<TicketDto[]>(this.apiUrl);
  }

  /**
   * Get ticket by ID
   */
  getTicket(id: number): Observable<TicketDto> {
    return this.http.get<TicketDto>(`${this.apiUrl}/${id}`);
  }
}