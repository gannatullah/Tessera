import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventDto, EventService } from '../../../Services/event.service';
import { EVENT_CATEGORIES } from '../../constants/categories';
import { environment } from '../../../../environments/environment.example';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  events: EventDto[] = [];
  allEvents: EventDto[] = []; // Store all events for pagination
  selectedCity: string = 'all';
  selectedCategory: string = 'all';
  categories = EVENT_CATEGORIES;
  searchTerm: string = ''; // Add search term property

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;

  constructor(
    private eventService: EventService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Only fetch events in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.fetchAllEvents();
    }
  }

  fetchAllEvents(): void {
    console.log('Fetching all events from API: api/events');

    this.eventService.getEvents().subscribe({
      next: (events: EventDto[]) => {
        console.log('All events fetched successfully:', events);
        console.log('Total events:', events.length);
        // Process image URLs to include full backend URL
        this.allEvents = events.map(event => ({
          ...event,
          image: this.getImageUrl(event.image)
        }));
        this.currentPage = 1; // Reset to first page when loading new data
        this.updateCurrentPageEvents();
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
      },
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.allEvents.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updateCurrentPageEvents(): void {
    // First apply search and filters, then paginate
    let filteredEvents = this.allEvents;

    // Apply search filter
    if (this.searchTerm.trim()) {
      filteredEvents = filteredEvents.filter((event) =>
        event.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply category and city filters
    if (this.selectedCategory !== 'all') {
      filteredEvents = filteredEvents.filter(
        (event) => event.category === this.selectedCategory
      );
    }

    if (this.selectedCity !== 'all') {
      filteredEvents = filteredEvents.filter(
        (event) => event.city === this.selectedCity
      );
    }

    // Update pagination based on filtered results
    this.totalPages = Math.ceil(filteredEvents.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    // Get events for current page
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.events = filteredEvents.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.currentPage = 1; // Reset to first page when searching
    this.updateCurrentPageEvents();
  }

  onSearchInput(): void {
    // Debounce search - update results as user types
    this.currentPage = 1;
    this.updateCurrentPageEvents();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateCurrentPageEvents();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateCurrentPageEvents();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateCurrentPageEvents();
    }
  }

  applyFilters(): void {
    console.log('Applying filters:', {
      city: this.selectedCity,
      category: this.selectedCategory,
    });

    this.currentPage = 1; // Reset to first page when filtering
    this.updateCurrentPageEvents();
  }

  navigateToEventDetails(eventId: number): void {
    this.router.navigate(['/event-details', eventId]);
  }

  onImageError(event: any): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://via.placeholder.com/400x250?text=Event+Image';
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/400x250?text=Event+Image';
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
