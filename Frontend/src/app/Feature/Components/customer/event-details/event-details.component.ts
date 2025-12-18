
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { EventService, EventDto } from '../../../../Services/event.service';
import { WishlistService } from '../../../../Services/wishlist.service';
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

  eventId: number = 0;
  userId = 1; // TODO: Get from auth service
  isInWishlist = false;
  isAddingToWishlist = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private wishlistService: WishlistService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const eventId = this.route.snapshot.paramMap.get('id');
      if (eventId) {
        this.eventId = +eventId;
        this.loadEventDetails(this.eventId);
        this.checkWishlistStatus();
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
    if (this.isAddingToWishlist) return;

    this.isAddingToWishlist = true;

    if (this.isInWishlist) {
      // Remove from wishlist
      this.wishlistService.deleteWishlistItemByUserAndEvent(this.userId, this.eventId).subscribe({
        next: () => {
          this.isInWishlist = false;
          this.isAddingToWishlist = false;
          alert('Event removed from wishlist!');
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
          this.isAddingToWishlist = false;
          alert('Failed to remove from wishlist');
        }
      });
    } else {
      // Add to wishlist
      this.wishlistService.addToWishlist({
        userID: this.userId,
        eventID: this.eventId
      }).subscribe({
        next: () => {
          this.isInWishlist = true;
          this.isAddingToWishlist = false;
          alert('Event added to wishlist!');
        },
        error: (error) => {
          console.error('Error adding to wishlist:', error);
          this.isAddingToWishlist = false;
          alert('Failed to add to wishlist');
        }
      });
    }
  }

  checkWishlistStatus(): void {
    this.wishlistService.checkWishlistItem(this.userId, this.eventId).subscribe({
      next: (response) => {
        this.isInWishlist = response.exists;
      },
      error: (error) => {
        console.error('Error checking wishlist status:', error);
      }
    });
  }
}
