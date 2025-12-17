
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { EventService, EventDto } from '../../../../Services/event.service';
import { DatePipe } from '@angular/common';
interface TicketType {
  name: string;
  price: number;
  quantity: number;
}
interface Event {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
  highlights: string[];
  venueName: string;
  venueAddress: string;
  organizer: string;
  price: number;
  availability: string;
  ticketTypes: TicketType[];
}
@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  event: Event = {
    title: '',
    category: '',
    date: '',
    time: '',
    location: '',
    image: '',
    description: '',
    highlights: [],
    venueName: '',
    venueAddress: '',
    organizer: '',
    price: 0,
    availability: 'Available',
    ticketTypes: []
  };

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const eventId = this.route.snapshot.paramMap.get('id');
      if (eventId) {
        this.loadEventDetails(+eventId);
      }
    }
  }

  loadEventDetails(eventId: number): void {
    console.log('Fetching event details for ID:', eventId);
    this.eventService.getEvent(eventId).subscribe({
      next: (eventData: EventDto) => {
        console.log('Event details fetched:', eventData);
        this.event = {
          title: eventData.name || 'Event Title',
          category: eventData.category,
          date: eventData.date,
          time: `${eventData.st_Date} - ${eventData.e_Date}`,
          location: `${eventData.city}, ${eventData.location}`,
          image: eventData.image || 'default-event.jpg',
          description: eventData.description || 'No description available.',
          highlights: [
            `Capacity: ${eventData.capacity}`,
            `Location: ${eventData.location}`,
            'Professional organization',
            'Exciting atmosphere'
          ],
          venueName: eventData.location || 'Event Venue',
          venueAddress: `${eventData.location}, ${eventData.city}`,
          organizer: eventData.organizer?.user?.name || 'Event Organizer',
          // price: eventData.ticketTypes?.length > 0 ? Math.min(...eventData.ticketTypes.map((t: any) => t.price)) : 0,
          price:0,
          availability: 'Available',
          ticketTypes: eventData.ticketTypes?.map((tt: any) => ({
            name: tt.name,
            price: tt.price,
            quantity: 0
          })) || []
        };
      },
      error: (error: any) => {
        console.error('Error fetching event details:', error);
      }
    });
  }
  increaseQuantity(ticket: TicketType): void {
    ticket.quantity++;
  }
  decreaseQuantity(ticket: TicketType): void {
    if (ticket.quantity > 0) {
      ticket.quantity--;
    }
  }
  getTotalPrice(): number {
    return this.event.ticketTypes.reduce((total, ticket) => {
      return total + (ticket.price * ticket.quantity);
    }, 0);
  }
  bookNow(): void {
    const total = this.getTotalPrice();
    if (total === 0) {
      alert('Please select at least one ticket');
      return;
    }
    alert(`Booking confirmed! Total: $${total}`);
    // Implement booking logic here
  }
  addToWishlist(): void {
    alert('Event added to wishlist!');
    // Implement wishlist logic here
  }
}
