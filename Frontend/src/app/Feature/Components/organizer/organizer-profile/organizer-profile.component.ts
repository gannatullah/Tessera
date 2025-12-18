import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService, UserProfile } from '../../../../Services/user.service';

@Component({
  selector: 'app-organizer-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organizer-profile.component.html',
  styleUrl: './organizer-profile.component.css'
})
export class OrganizerProfileComponent implements OnInit {
  organizerId: number = 0;
  organizerProfile: UserProfile | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.organizerId = +id;
        this.loadOrganizerProfile();
      }
    });
  }

  loadOrganizerProfile(): void {
    this.userService.getUserById(this.organizerId).subscribe({
      next: (userData: UserProfile) => {
        this.organizerProfile = userData;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching organizer profile:', error);
        this.isLoading = false;
      }
    });
  }

  onImageError(event: any): void {
    event.target.src = '/pp.jpg';
  }
}
