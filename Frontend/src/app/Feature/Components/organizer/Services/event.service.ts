import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateEventDto {
  category: string;
  date: string;
  st_Date: string;
  e_Date: string;
  city?: string;
  location?: string;
  capacity?: number;
  description?: string;
  image?: string;
  organizerID: number;
  ticketTypes?: CreateTicketTypeDto[];
}

export interface CreateTicketTypeDto {
  name: string;
  price: number;
  quantity_Total: number;
}

export interface EventDto {
  event_ID: number;
  category: string;
  date: string;
  st_Date: string;
  e_Date: string;
  city?: string;
  location?: string;
  capacity?: number;
  description?: string;
  image?: string;
  organizerID: number;
  ticketTypes?: TicketTypeDto[];
}

export interface TicketTypeDto {
  id: number;
  name: string;
  price: number;
  quantity_Total: number;
  quantity_Sold: number;
  eventID: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://late-sound-3475.fly.dev/api/Events';

  constructor(private http: HttpClient) { }

  createEvent(eventData: CreateEventDto): Observable<EventDto> {
    return this.http.post<EventDto>(this.apiUrl, eventData);
  }

  getEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(this.apiUrl);
  }

  getEvent(id: number): Observable<EventDto> {
    return this.http.get<EventDto>(`${this.apiUrl}/${id}`);
  }

  updateEvent(id: number, eventData: Partial<CreateEventDto>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, eventData);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
