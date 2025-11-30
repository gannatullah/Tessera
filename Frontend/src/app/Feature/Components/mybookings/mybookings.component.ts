import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class MybookingsComponent {
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
