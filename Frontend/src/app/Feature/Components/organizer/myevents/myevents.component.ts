import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Event {
  id: string;
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
}

@Component({
  selector: 'app-myevents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myevents.component.html',
  styleUrls: ['./myevents.component.css']
})
export class MyeventsComponent {
  activeFilter: 'All' | 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled' = 'All';

  constructor(private router: Router) {}

  events: Event[] = [
    {
      id: '1',
      name: 'Tech Summit 2025',
      eventDate: '2025-12-15',
      startTime: '09:00',
      endTime: '18:00',
      venue: 'Grand Hall Center',
      city: 'Cairo',
      status: 'Upcoming',
      ticketPrice: 500,
      totalTickets: 200,
      ticketsSold: 145,
      revenue: 72500
    },
    {
      id: '2',
      name: 'Music Night Live',
      eventDate: '2025-11-20',
      startTime: '20:00',
      endTime: '23:00',
      venue: 'Riverside Arena',
      city: 'Giza',
      status: 'Ongoing',
      ticketPrice: 300,
      totalTickets: 150,
      ticketsSold: 120,
      revenue: 36000
    },
    {
      id: '3',
      name: 'Comedy Festival',
      eventDate: '2025-10-10',
      startTime: '19:00',
      endTime: '22:00',
      venue: 'Downtown Theater',
      city: 'Alexandria',
      status: 'Completed',
      ticketPrice: 250,
      totalTickets: 100,
      ticketsSold: 95,
      revenue: 23750
    },
    {
      id: '4',
      name: 'Art Exhibition',
      eventDate: '2025-09-05',
      startTime: '10:00',
      endTime: '17:00',
      venue: 'Modern Art Gallery',
      city: 'Cairo',
      status: 'Cancelled',
      ticketPrice: 150,
      totalTickets: 80,
      ticketsSold: 0,
      revenue: 0
    }
  ];

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
    // TODO: navigate to edit event page
    console.log('Edit event:', event);
  }

  onCancelEvent(event: Event) {
    // TODO: show confirmation dialog and call API
    console.log('Cancel event:', event);
  }
}
