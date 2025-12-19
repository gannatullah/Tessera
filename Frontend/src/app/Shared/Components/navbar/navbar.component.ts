import { Component, HostListener, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
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
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.Default
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
        console.log('Navbar: isLoggedIn will be set to:', !!user);
        this.isLoggedIn = !!user;
        if (user) {
          console.log('Navbar: User logged in, checking user type for user ID:', user.id);
          this.checkUserType(user.id);
        } else {
          console.log('Navbar: User logged out, resetting flags');
          this.isBuyer = false;
          this.isOrganizer = false;
          this.logNavbarState();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Debug method to check current navbar state
   */
  private logNavbarState() {
    console.log('Navbar State Debug:');
    console.log('- isLoggedIn:', this.isLoggedIn);
    console.log('- isBuyer:', this.isBuyer);
    console.log('- isOrganizer:', this.isOrganizer);
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
    
    // Check if user is a buyer first (has Buyer record)
    // Note: Organizers may also become buyers later if they purchase tickets
    this.subscriptions.push(
      this.userService.isUserBuyer(userId).subscribe({
        next: () => {
          console.log('Navbar: User is a buyer (has buyer record)');
          this.isBuyer = true;
          this.isOrganizer = false;
          this.logNavbarState();
        },
        error: (error) => {
          console.log('Navbar: User is not a buyer, checking if organizer...', error);
          // If not a buyer, check if organizer (has Organizer record)
          this.subscriptions.push(
            this.userService.isUserOrganizer(userId).subscribe({
              next: () => {
                console.log('Navbar: User is an organizer (has organizer record)');
                this.isBuyer = false;
                this.isOrganizer = true;
                this.logNavbarState();
              },
              error: (error) => {
                console.log('Navbar: User is neither buyer nor organizer', error);
                // User is neither buyer nor organizer (shouldn't happen in normal flow)
                this.isBuyer = false;
                this.isOrganizer = false;
                this.logNavbarState();
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
