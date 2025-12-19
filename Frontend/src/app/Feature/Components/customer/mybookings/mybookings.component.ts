import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TicketService, TicketDto } from '../../../../Services/ticket.service';

@Component({
  selector: 'app-mybookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mybookings.component.html',
  styleUrls: ['./mybookings.component.css']
})
export class MybookingsComponent implements OnInit {
  activeFilter: 'All' | 'Upcoming' | 'Completed' | 'Cancelled' = 'All';
  tickets: TicketDto[] = [];
  isLoading = true;

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
      this.isLoading = false;
      return;
    }

    console.log(`Fetching user tickets for user ID: ${userId} from API: api/tickets/usertickets/${userId}`);

    this.ticketService.getUserTickets(parseInt(userId)).subscribe({
      next: (tickets: TicketDto[]) => {
        console.log('User tickets API response:', tickets);
        console.log('Total tickets fetched:', tickets.length);
        this.tickets = tickets;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching user tickets:', error);
        this.tickets = [];
        this.isLoading = false;
      }
    });
  }

  get filteredTickets(): TicketDto[] {
    if (this.activeFilter === 'All') {
      return this.tickets;
    }

    const now = new Date();

    return this.tickets.filter(ticket => {
      if (!ticket.event?.date) {
        return false;
      }

      const eventDate = new Date(ticket.event.date);

      if (this.activeFilter === 'Upcoming') {
        // Show events that are in the future
        return eventDate > now;
      } else if (this.activeFilter === 'Completed') {
        // Show events that have already passed
        return eventDate < now;
      } else if (this.activeFilter === 'Cancelled') {
        // Keep the original status-based filtering for cancelled
        const status = ticket.status?.toLowerCase();
        return status === 'cancelled';
      }

      return false;
    });
  }

  setFilter(filter: 'All' | 'Upcoming' | 'Completed' | 'Cancelled') {
    this.activeFilter = filter;
  }

  getStatusCount(status: 'Upcoming' | 'Completed' | 'Cancelled'): number {
    const now = new Date();

    return this.tickets.filter(ticket => {
      if (!ticket.event?.date) {
        return false;
      }

      const eventDate = new Date(ticket.event.date);

      if (status === 'Upcoming') {
        return eventDate > now;
      } else if (status === 'Completed') {
        return eventDate < now;
      } else if (status === 'Cancelled') {
        const ticketStatus = ticket.status?.toLowerCase();
        return ticketStatus === 'cancelled';
      }

      return false;
    }).length;
  }

  getTicketStatus(ticket: TicketDto): string {
    return ticket.status || 'Unknown';
  }

  onViewTicket(ticket: TicketDto) {
    // TODO: implement navigation / modal
    console.log('View ticket:', ticket);
  }

  onCancelTicket(ticket: TicketDto) {
    // TODO: call API / show confirmation
    console.log('Cancel ticket:', ticket);
  }
}
