import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EventService, EventDto } from '../../../Services/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {

  constructor(
    private eventService: EventService,
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

        // // Log each event details
        // events.forEach((event, index) => {
        //   console.log(`Event ${index + 1}:`, {
        //     eventId: event.event_ID,
        //     category: event.category,
        //     date: event.date,
        //     startDate: event.st_Date,
        //     endDate: event.e_Date,
        //     city: event.city,
        //     location: event.location,
        //     capacity: event.capacity,
        //     description: event.description,
        //     image: event.image,
        //     organizerId: event.organizerID,
        //     ticketTypes: event.ticketTypes
        //   });
        // });
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
      }
    });
  }
}
