import { Component, AfterViewInit, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Typed from 'typed.js';
import { RouterLink, Router } from '@angular/router';
import { EventService, EventDto } from '../../../../Services/event.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnInit {
  trendingEvents: EventDto[] = [];
  
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    // Only fetch trending events in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.loadTrendingEvents();
    }
  }

  loadTrendingEvents(): void {
    console.log('Fetching top 5 trending events...');
    
    this.eventService.getTrendingEvents().subscribe({
      next: (events) => {
        this.trendingEvents = events;
        console.log('Top 5 trending events fetched:', events);
        console.log('Total trending events:', events.length);
        
        // // Log each event details
        // events.forEach((event, index) => {
        //   console.log(`Event ${index + 1}:`, {
        //     id: event.event_ID,
        //     category: event.category,
        //     date: event.date,
        //     location: event.location,
        //     city: event.city,
        //     description: event.description,
        //     image: event.image
        //   });
        // });
      },
      error: (error) => {
        console.error('Error fetching trending events:', error);
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const options = {
        strings: [
          "Sport Events",
          "Concerts",
          "Conferences",
          "Courses",
          "Workshops",
          "Parties",
          "Theater"
        ],
        typeSpeed: 60,
        backSpeed: 10,
        backDelay: 2000, // Wait 2 seconds before deleting
        loop: true
      };

      new Typed('#typedElement', options);
    }
  }

  navigateToEventDetails(): void {
    this.router.navigate(['/event-details']);
  }
}