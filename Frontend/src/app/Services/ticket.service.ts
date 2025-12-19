import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.example';

export interface TicketDto {
  event?: EventDto;
  ticket_ID: number;
  status: string;
  qR_Code?: string;
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
  event_ID: number;
  name: string;
  category: string;
  date: string;
  st_Date: string;
  e_Date: string;
  city?: string;
  location?: string;
  capacity?: number;
  organizerID: number;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = environment.apiUrl + '/Tickets';

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

  /**
   * Create a new ticket
   */
  createTicket(ticketData: { TicketTypeID: number; EventID: number; UserID: number; Status?: string }): Observable<TicketDto> {
    return this.http.post<TicketDto>(this.apiUrl, ticketData);
  }
}