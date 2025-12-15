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

  bookings: Booking[] = [
    {
      id: '1',
      eventName: 'Tech Summit 2025',
      eventDate: '2025-12-01',
      eventTime: '19:30',
      venue: 'Grand Hall Center',
      city: 'Cairo',
      status: 'Upcoming',
      ticketType: 'VIP',
      quantity: 2,
      totalPrice: 1200,
      bookingCode: 'TS-25-AB12'
    },
    {
      id: '2',
      eventName: 'Music Night Live',
      eventDate: '2025-11-10',
      eventTime: '20:00',
      venue: 'Riverside Arena',
      city: 'Giza',
      status: 'Completed',
      ticketType: 'General Admission',
      quantity: 3,
      totalPrice: 900,
      bookingCode: 'MN-25-CC90'
    },
    {
      id: '3',
      eventName: 'Comedy Festival',
      eventDate: '2025-10-05',
      eventTime: '21:00',
      venue: 'Downtown Theater',
      city: 'Alexandria',
      status: 'Cancelled',
      ticketType: 'Balcony',
      quantity: 1,
      totalPrice: 250,
      bookingCode: 'CF-25-ZX41'
    }
  ];

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

        // Log each ticket details
        tickets.forEach((ticket: TicketDto, index: number) => {
          console.log(`Ticket ${index + 1}:`, {
            ticketId: ticket.ticket_ID,
            status: ticket.status,
            qrCode: ticket.qr_Code,
            eventId: ticket.eventID,
            ticketTypeId: ticket.ticketTypeID,
            userId: ticket.userID,
            ticketType: ticket.ticketType,
            event: ticket.event
          });
        });
      },
      error: (error: any) => {
        console.error('Error fetching user tickets:', error);
      }
    });
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
