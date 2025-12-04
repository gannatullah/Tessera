import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, } from "@angular/router";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isScrolled = false;

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollTop > 50; // Change to white after scrolling 50px
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
