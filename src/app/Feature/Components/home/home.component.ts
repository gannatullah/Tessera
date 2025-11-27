import { Component, AfterViewInit } from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
ngAfterViewInit(): void {
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
