import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDto, EventService } from '../../../../Services/event.service';
import { WishlistService } from '../../../../Services/wishlist.service';
import { AuthService } from '../../../../Services/auth.service';
import { environment } from '../../../../../environments/environment.example';
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
  organizerId: number;
  price: number;
  availability: string;
  ticketTypes: TicketType[];
}
@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css',
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
    organizerId: 0,
    price: 0,
    availability: 'Available',
    ticketTypes: [],
  };

  eventId: number = 0;
  userId: number | null = null;
  isInWishlist = false;
  isAddingToWishlist = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private wishlistService: WishlistService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Get user ID from localStorage
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        this.userId = parseInt(storedUserId);
      }

      const eventId = this.route.snapshot.paramMap.get('id');
      if (eventId) {
        this.eventId = +eventId;
        this.loadEventDetails(this.eventId);
        if (this.userId) {
          this.checkWishlistStatus();
        }
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
          image: this.getImageUrl(eventData.image),
          description: eventData.description || 'No description available.',
          highlights: [
            `Capacity: ${eventData.capacity}`,
            `Location: ${eventData.location}`,
            'Professional organization',
            'Exciting atmosphere',
          ],
          venueName: eventData.location || 'Event Venue',
          venueAddress: `${eventData.location}, ${eventData.city}`,
          organizer: eventData.organizer?.user?.name || 'Event Organizer',
          organizerId: eventData.organizerID || 0,
          // price: eventData.ticketTypes?.length > 0 ? Math.min(...eventData.ticketTypes.map((t: any) => t.price)) : 0,
          price: 0,
          availability: 'Available',
          ticketTypes:
            eventData.ticketTypes?.map((tt: any) => ({
              id: tt.id,
              name: tt.name,
              price: tt.price,
              quantity: 0,
            })) || [],
        };
      },
      error: (error: any) => {
        console.error('Error fetching event details:', error);
      },
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
      return total + ticket.price * ticket.quantity;
    }, 0);
  }

  getDirectionsUrl(): string {
    const address = this.event.venueAddress || this.event.location;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
  }

  bookNow(): void {
    // Check if user is logged in
    if (!this.authService.isAuthenticated()) {
      console.log('Event Details: User not authenticated, redirecting to login');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: `/event-details/${this.eventId}` } 
      });
      return;
    }
    
    const total = this.getTotalPrice();
    if (total === 0) {
      alert('Please select at least one ticket');
      return;
    }
    // Navigate to payment page with event and ticket data
    this.router.navigate(['/payment', this.eventId], {
      state: {
        tickets: this.event.ticketTypes.filter((t) => t.quantity > 0),
        totalAmount: total,
        eventTitle: this.event.title,
      },
    });
  }
  addToWishlist(): void {
    if (this.isAddingToWishlist || !this.userId) return;

    this.isAddingToWishlist = true;

    if (this.isInWishlist) {
      // Remove from wishlist
      this.wishlistService
        .deleteWishlistItemByUserAndEvent(this.userId, this.eventId)
        .subscribe({
          next: () => {
            this.isInWishlist = false;
            this.isAddingToWishlist = false;
            alert('Event removed from wishlist!');
          },
          error: (error) => {
            console.error('Error removing from wishlist:', error);
            this.isAddingToWishlist = false;
            alert('Failed to remove from wishlist');
          },
        });
    } else {
      // Add to wishlist
      this.wishlistService
        .addToWishlist({
          userID: this.userId,
          eventID: this.eventId,
        })
        .subscribe({
          next: () => {
            this.isInWishlist = true;
            this.isAddingToWishlist = false;
            alert('Event added to wishlist!');
          },
          error: (error) => {
            console.error('Error adding to wishlist:', error);
            this.isAddingToWishlist = false;
            alert('Failed to add to wishlist');
          },
        });
    }
  }

  checkWishlistStatus(): void {
    if (!this.userId) return;

    this.wishlistService
      .checkWishlistItem(this.userId, this.eventId)
      .subscribe({
        next: (response) => {
          this.isInWishlist = response.exists;
        },
        error: (error) => {
          console.error('Error checking wishlist status:', error);
        },
      });
  }

  viewOrganizerProfile(): void {
    if (this.event.organizerId > 0) {
      this.router.navigate(['/organizer-profile', this.event.organizerId]);
    }
  }

  onImageError(event: any): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/1200x600?text=Event+Image';
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/1200x600?text=Event+Image';
    }

    // If it's already a full URL (Cloudinary), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // If it's a local path starting with /uploads/, prefix with API URL
    if (imagePath.startsWith('/uploads/')) {
      return `${environment.apiUrl.replace('/api', '')}${imagePath}`;
    }

    // For any other relative paths, assume they're local uploads
    return `${environment.apiUrl.replace('/api', '')}/uploads/${imagePath}`;
  }
}
