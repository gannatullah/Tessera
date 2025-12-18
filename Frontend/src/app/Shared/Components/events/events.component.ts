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
  selectedCity: string = 'all';
  selectedCategory: string = 'all';
  categories = EVENT_CATEGORIES;

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
        this.events = events;
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  applyFilters(): void {
    console.log('Applying filters:', { city: this.selectedCity, category: this.selectedCategory });
    
    if (this.selectedCity === 'all' && this.selectedCategory === 'all') {
      this.fetchAllEvents();
      return;
    }

    const city = this.selectedCity === 'all' ? undefined : this.selectedCity;
    const category = this.selectedCategory === 'all' ? undefined : this.selectedCategory;

    this.eventService.filterEvents(city, category).subscribe({
      next: (events: EventDto[]) => {
        console.log('Filtered events:', events);
        this.events = events;
      },
      error: (error: any) => {
        console.error('Error filtering events:', error);
        this.events = [];
      }
    });
  }

  navigateToEventDetails(eventId: number): void {
    this.router.navigate(['/event-details', eventId]);
  }
}
