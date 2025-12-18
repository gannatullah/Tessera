import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TicketService, TicketDto } from '../../../../Services/ticket.service';

interface Booking {
  id: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  city: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  ticketType: string;
  quantity: number;
  totalPrice: number;
  bookingCode: string;
}

@Component({
  selector: 'app-mybookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mybookings.component.html',
  styleUrls: ['./mybookings.component.css']
})
export class MybookingsComponent implements OnInit {
  activeFilter: 'All' | 'Upcoming' | 'Completed' | 'Cancelled' = 'All';

  bookings: Booking[] = []; // Initialize empty - will be populated from API

  constructor(
    private ticketService: TicketService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Only fetch tickets in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.fetchUserTickets();
    }
  }

  fetchUserTickets(): void {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      console.log('No user ID found in localStorage');
      return;
    }

    console.log(`Fetching user tickets for user ID: ${userId} from API: api/tickets/usertickets/${userId}`);

    this.ticketService.getUserTickets(parseInt(userId)).subscribe({
      next: (tickets: TicketDto[]) => {
        console.log('User tickets API response:', tickets);
        console.log('Total tickets fetched:', tickets.length);

        // Map API tickets to bookings format
        this.bookings = tickets.map((ticket: TicketDto) => {
          const eventDate = new Date(ticket.event?.date || '');
          const eventStatus = this.determineTicketStatus(eventDate);
          
          return {
            id: ticket.ticket_ID?.toString() || '',
            eventName: ticket.event?.name || 'Unknown Event',
            eventDate: ticket.event?.date || '',
            eventTime: ticket.event?.st_Date ? new Date(ticket.event.st_Date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '00:00',
            venue: ticket.event?.location || 'Unknown Venue',
            city: ticket.event?.city || 'Unknown City',
            status: eventStatus,
            ticketType: ticket.ticketType?.name || 'Standard',
            quantity: 1, // Each ticket is 1 quantity
            totalPrice: ticket.ticketType?.price || 0,
            bookingCode: ticket.qr_Code || `TKT-${ticket.ticket_ID}`
          };
        });

        console.log('Mapped bookings:', this.bookings);
      },
      error: (error: any) => {
        console.error('Error fetching user tickets:', error);
      }
    });
  }

  // Helper method to determine ticket status based on event date
  private determineTicketStatus(eventDate: Date): 'Upcoming' | 'Completed' | 'Cancelled' {
    const now = new Date();
    const eventDateTime = new Date(eventDate);
    
    if (eventDateTime > now) {
      return 'Upcoming';
    } else {
      return 'Completed';
    }
  }

  get filteredBookings(): Booking[] {
    if (this.activeFilter === 'All') {
      return this.bookings;
    }
    return this.bookings.filter(b => b.status === this.activeFilter);
  }

  setFilter(filter: 'All' | 'Upcoming' | 'Completed' | 'Cancelled') {
    this.activeFilter = filter;
  }

  getStatusCount(status: 'Upcoming' | 'Completed' | 'Cancelled'): number {
    return this.bookings.filter(b => b.status === status).length;
  }

  onViewTicket(booking: Booking) {
    // TODO: implement navigation / modal
    console.log('View ticket:', booking);
  }

  onDownloadTicket(booking: Booking) {
    // TODO: implement real download
    console.log('Download ticket:', booking);
  }

  onCancelBooking(booking: Booking) {
    // TODO: call API / show confirmation
    console.log('Cancel booking:', booking);
  }
}
