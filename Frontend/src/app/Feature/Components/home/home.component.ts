import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Typed from 'typed.js';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
}