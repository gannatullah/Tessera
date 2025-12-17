import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CreateEventDto {
  name: string;
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
  name: string;
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
  organizer?: OrganizerDto;
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

export interface UserDto {
  id: number;
  name: string;
  first_Name: string;
  last_Name: string;
  email: string;
  phone_No: string;
  dob: string;
  profilePic: string;
}

export interface OrganizerDto {
  userID: number;
  isVerified: boolean;
  user: UserDto;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:5000/api/Events';

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

  getTrendingEvents(): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(`${this.apiUrl}/trending`);
  }

  filterEvents(city?: string, category?: string): Observable<EventDto[]> {
    let params = '';
    if (city && city !== 'all') {
      params += `?city=${encodeURIComponent(city)}`;
    }
    if (category && category !== 'all') {
      params += params ? `&category=${encodeURIComponent(category)}` : `?category=${encodeURIComponent(category)}`;
    }
    return this.http.get<EventDto[]>(`${this.apiUrl}/filter${params}`);
  }
}
