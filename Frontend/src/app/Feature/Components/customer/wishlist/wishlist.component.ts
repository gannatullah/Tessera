import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WishlistService, WishlistDto } from '../../../../Services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistDto[] = [];
  isLoading = true;
  userId = 1; // TODO: Get from auth service

  constructor(
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.getUserWishlist(this.userId).subscribe({
      next: (data) => {
        this.wishlistItems = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.isLoading = false;
      }
    });
  }

  removeFromWishlist(item: WishlistDto): void {
    if (confirm('Are you sure you want to remove this event from your wishlist?')) {
      this.wishlistService.deleteWishlistItem(item.id).subscribe({
        next: () => {
          this.wishlistItems = this.wishlistItems.filter(i => i.id !== item.id);
        },
        error: (error) => {
          console.error('Error removing from wishlist:', error);
          alert('Failed to remove item from wishlist');
        }
      });
    }
  }

  viewEventDetails(eventId: number): void {
    this.router.navigate(['/event-details', eventId]);
  }

  getMinPrice(ticketTypes: any[]): number {
    if (!ticketTypes || ticketTypes.length === 0) return 0;
    return Math.min(...ticketTypes.map(tt => tt.price));
  }
}
