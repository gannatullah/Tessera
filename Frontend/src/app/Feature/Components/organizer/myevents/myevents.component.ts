import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EventService, EventDto } from '../../../../Services/event.service';
import { AuthService } from '../../../../Services/auth.service';

interface Event {
  id: number;
  name: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  city: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  ticketPrice: number;
  totalTickets: number;
  ticketsSold: number;
  revenue: number;
  image?: string;
}

@Component({
  selector: 'app-myevents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myevents.component.html',
  styleUrls: ['./myevents.component.css']
})
export class MyeventsComponent implements OnInit {
  activeFilter: 'All' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled' = 'All';
  events: Event[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'User not authenticated';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.getEventsByOrganizer(currentUser.id).subscribe({
      next: (eventDtos: EventDto[]) => {
        this.events = eventDtos.map(dto => this.mapEventDtoToEvent(dto));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.errorMessage = 'Failed to load events. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private mapEventDtoToEvent(dto: EventDto): Event {
    const now = new Date();
    const eventDate = new Date(dto.date);
    const startTime = new Date(dto.st_Date);
    const endTime = new Date(dto.e_Date);

    let status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled' = 'Upcoming';

    if (eventDate < now && endTime < now) {
      status = 'Completed';
    } else if (eventDate <= now && startTime <= now && endTime >= now) {
      status = 'Ongoing';
    }

    // Calculate total tickets and revenue
    const totalTickets = dto.ticketTypes?.reduce((sum, tt) => sum + tt.quantity_Total, 0) || 0;
    const ticketsSold = dto.ticketTypes?.reduce((sum, tt) => sum + tt.quantity_Sold, 0) || 0;
    const revenue = dto.ticketTypes?.reduce((sum, tt) => sum + (tt.quantity_Sold * tt.price), 0) || 0;
    const avgPrice = dto.ticketTypes?.length ? dto.ticketTypes.reduce((sum, tt) => sum + tt.price, 0) / dto.ticketTypes.length : 0;

    return {
      id: dto.event_ID,
      name: dto.name,
      eventDate: dto.date,
      startTime: startTime.toTimeString().slice(0, 5),
      endTime: endTime.toTimeString().slice(0, 5),
      venue: dto.location || 'TBD',
      city: dto.city || 'TBD',
      status: status,
      ticketPrice: avgPrice,
      totalTickets: totalTickets,
      ticketsSold: ticketsSold,
      revenue: revenue,
      image: dto.image
    };
  }

  get filteredEvents(): Event[] {
    if (this.activeFilter === 'All') {
      return this.events;
    }
    return this.events.filter(event => event.status === this.activeFilter);
  }

  setFilter(filter: 'All' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled') {
    this.activeFilter = filter;
  }

  getStatusCount(status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'): number {
    return this.events.filter(event => event.status === status).length;
  }

  getTotalTicketsSold(): number {
    return this.events.reduce((total, event) => total + event.ticketsSold, 0);
  }

  getTotalRevenue(): number {
    return this.events.reduce((total, event) => total + event.revenue, 0);
  }

  onCreateEvent() {
    this.router.navigate(['/create-event']);
  }

  onViewEvent(event: Event) {
    // TODO: navigate to event details page
    console.log('View event:', event);
  }

  onEditEvent(event: Event) {
    // Navigate to edit event page with event ID
    this.router.navigate(['/edit-event', event.id]);
  }

  onCancelEvent(event: Event) {
    // TODO: show confirmation dialog and call API
    console.log('Cancel event:', event);
  }
}
