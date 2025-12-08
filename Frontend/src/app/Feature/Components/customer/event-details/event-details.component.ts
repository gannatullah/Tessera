
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  event: Event = {
    title: 'Summer Music Festival 2025',
    category: 'Music Festival',
    date: 'June 15, 2025',
    time: '6:00 PM - 11:00 PM',
    location: 'Central Park, New York',
    image: 'festival.jpg',
    description: 'Experience the ultimate summer music festival featuring world-renowned artists, amazing food vendors, and unforgettable performances. Join thousands of music lovers for a night filled with incredible live music, dancing, and summer vibes. This year\'s lineup includes top artists from various genres including pop, rock, electronic, and indie music. Don\'t miss this spectacular outdoor event that promises to be the highlight of your summer!',
    highlights: [
      'Live performances from 15+ international artists',
      'Gourmet food trucks and beverage stations',
      'VIP lounge area with exclusive perks',
      'Professional sound and lighting systems',
      'Family-friendly environment',
      'Free parking and shuttle service'
    ],
    venueName: 'Central Park Main Stage',
    venueAddress: '123 Park Avenue, New York, NY 10001',
    organizer: 'Summer Events Co.',
    price: 45,
    availability: 'Available',
    ticketTypes: [
      { name: 'General Admission', price: 45, quantity: 0 },
      { name: 'VIP Pass', price: 120, quantity: 0 },
      { name: 'Premium Package', price: 250, quantity: 0 }
    ]
  };
  ngOnInit(): void {
    // Load event data from route parameters or service
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
