import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventService, EventDto } from '../../../Services/event.service';
import { DatePipe } from '@angular/common';
import { EVENT_CATEGORIES } from '../../constants/categories';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  events: EventDto[] = [];
  allEvents: EventDto[] = []; // Store all events for pagination
  selectedCity: string = 'all';
  selectedCategory: string = 'all';
  categories = EVENT_CATEGORIES;

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
        this.allEvents = events;
        this.updatePagination();
        this.updateCurrentPageEvents();
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.allEvents.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
  }

  updateCurrentPageEvents(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.events = this.allEvents.slice(startIndex, endIndex);
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
    console.log('Applying filters:', { city: this.selectedCity, category: this.selectedCategory });
    
    if (this.selectedCity === 'all' && this.selectedCategory === 'all') {
      this.allEvents = [...this.allEvents]; // Reset to original events
      this.currentPage = 1; // Reset to first page
      this.updatePagination();
      this.updateCurrentPageEvents();
      return;
    }

    const city = this.selectedCity === 'all' ? undefined : this.selectedCity;
    const category = this.selectedCategory === 'all' ? undefined : this.selectedCategory;

    this.eventService.filterEvents(city, category).subscribe({
      next: (events: EventDto[]) => {
        console.log('Filtered events:', events);
        this.allEvents = events;
        this.currentPage = 1; // Reset to first page when filtering
        this.updatePagination();
        this.updateCurrentPageEvents();
      },
      error: (error: any) => {
        console.error('Error filtering events:', error);
        this.allEvents = [];
        this.events = [];
        this.totalPages = 1;
        this.currentPage = 1;
      }
    });
  }

  navigateToEventDetails(eventId: number): void {
    this.router.navigate(['/event-details', eventId]);
  }
}
