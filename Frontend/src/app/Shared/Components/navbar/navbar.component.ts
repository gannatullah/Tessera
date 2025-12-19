import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, } from "@angular/router";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../Services/auth.service';
import { UserService } from '../../../Services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isLoggedIn = false;
  isBuyer = false;
  isOrganizer = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    console.log('Navbar: Initializing...');
    
    // Check authentication status
    this.checkAuthStatus();
    
    // Subscribe to auth changes
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        console.log('Navbar: Auth state changed, user:', user);
        this.isLoggedIn = !!user;
        if (user) {
          this.checkUserType(user.id);
        } else {
          this.isBuyer = false;
          this.isOrganizer = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private checkAuthStatus() {
    this.isLoggedIn = this.authService.isAuthenticated();
    console.log('Navbar: Initial auth check, isLoggedIn:', this.isLoggedIn);
    
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      console.log('Navbar: Current user from auth service:', user);
      if (user) {
        this.checkUserType(user.id);
      }
    }
  }

  private checkUserType(userId: number) {
    console.log('Navbar: Checking user type for user ID:', userId);
    
    // Check if user is a buyer
    this.subscriptions.push(
      this.userService.isUserBuyer(userId).subscribe({
        next: () => {
          console.log('Navbar: User is a buyer');
          this.isBuyer = true;
          this.isOrganizer = false;
        },
        error: (error) => {
          console.log('Navbar: User is not a buyer, checking if organizer...', error);
          // If not a buyer, check if organizer
          this.subscriptions.push(
            this.userService.isUserOrganizer(userId).subscribe({
              next: () => {
                console.log('Navbar: User is an organizer');
                this.isBuyer = false;
                this.isOrganizer = true;
              },
              error: (error) => {
                console.log('Navbar: User is neither buyer nor organizer', error);
                // User is neither buyer nor organizer (shouldn't happen)
                this.isBuyer = false;
                this.isOrganizer = false;
              }
            })
          );
        }
      })
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollTop > 50; // Change to white after scrolling 50px
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
  }
}
