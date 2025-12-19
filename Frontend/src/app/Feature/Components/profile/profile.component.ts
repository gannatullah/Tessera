import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { Usersinterface } from '../../../Core/interfaces/usersinterface';
import { UserService, UserProfile } from '../../../Services/user.service';
import { TicketService, TicketDto } from '../../../Services/ticket.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthService,
    private userService: UserService,
    private ticketService: TicketService,
    private http: HttpClient
  ) { }

  isEditing = false;
  isLoggedIn = false;
  recentTickets: TicketDto[] = [];

  // Profile data
  profile = {
    name: 'Sabrina Carpenter',
    email: 'sabrinacarpet@gmail.com',
    phone: '+1 (123) 456-7890',
    location: 'New York, USA',
    birthday: 'May 11, 1999',
    interests: 'Music, Theater, Sports',
    bio: 'Passionate about events and connecting people through amazing experiences. Love discovering new events and meeting like-minded individuals.',
    profilePic: '/pp.jpg'
  };

  // Temporary data for editing
  editProfile = { ...this.profile };
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  ngOnInit(): void {
    // Check if user is logged in
    const token = this.auth.getToken();
    const userId = this.auth.getCurrentUser()?.id?.toString();


    if (token && userId) {
      this.isLoggedIn = true;
      this.loadUserProfile(parseInt(userId));
    } else {
      this.isLoggedIn = false;
      console.log('No user logged in, showing default profile data');
    }
  }

  loadUserProfile(userId: number): void {
    console.log(`Fetching user profile for user ID: ${userId}`);

    // Fetch user tickets
    this.loadUserTickets(userId);

    this.userService.getUserById(userId).subscribe({
      next: (userData: UserProfile) => {
        console.log('User profile data fetched:', userData);

        // Update profile with fetched data
        this.profile = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone_No || '+1 (123) 456-7890',
          location: userData.location || 'New York, USA',
          birthday: userData.dob ? new Date(userData.dob).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'May 11, 1999',
          interests: 'Music, Theater, Sports', // Not in backend, keep default
          bio: userData.bio || 'Passionate about events and connecting people through amazing experiences. Love discovering new events and meeting like-minded individuals.',
          profilePic: userData.profilePic && userData.profilePic.trim() !== ''
            ? (userData.profilePic.startsWith('http') ? userData.profilePic : `http://localhost:5000${userData.profilePic}`)
            : '/pp.jpg'
        };

        // Update edit profile as well
        this.editProfile = { ...this.profile };
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        console.log('Using default profile data due to error');
      }
    });
  }

  toggleEditMode() {
    if (this.isEditing) {
      // Cancel editing - reset changes
      this.editProfile = { ...this.profile };
      this.selectedFile = null;
      this.imagePreview = null;
    }
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    const userId = this.auth.getCurrentUser()?.id?.toString();
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    // If a file is selected, upload it first
    if (this.selectedFile) {
      this.uploadProfilePicture().subscribe({
        next: (uploadResult) => {
          // Update editProfile with the uploaded URL
          this.editProfile.profilePic = uploadResult.url;
          // Now update the user profile
          this.updateUserProfile(userId);
        },
        error: (error) => {
          console.error('Error uploading profile picture:', error);
          alert('Failed to upload profile picture. Please try again.');
        }
      });
    } else {
      // No file selected, just update the profile
      this.updateUserProfile(userId);
    }
  }

  private updateUserProfile(userId: string) {
    // Prepare update data
    const updateData = {
      name: this.editProfile.name,
      email: this.editProfile.email,
      phone_No: this.editProfile.phone,
      location: this.editProfile.location,
      bio: this.editProfile.bio,
      profilePic: this.editProfile.profilePic
    };

    console.log('Updating profile:', updateData);

    this.userService.updateUser(parseInt(userId), updateData).subscribe({
      next: (updatedUser) => {
        console.log('Profile updated successfully:', updatedUser);

        // Update local profile with response
        this.profile = {
          ...this.editProfile,
          profilePic: updatedUser.profilePic && updatedUser.profilePic.trim() !== ''
            ? (updatedUser.profilePic.startsWith('http') ? updatedUser.profilePic : `http://localhost:5000${updatedUser.profilePic}`)
            : '/pp.jpg'
        };

        this.isEditing = false;
        this.selectedFile = null;
        this.imagePreview = null;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        // Still update local state even if backend fails
        this.profile = { ...this.editProfile };
        this.isEditing = false;
        this.selectedFile = null;
        this.imagePreview = null;
      }
    });
  }

  private uploadProfilePicture() {
    const formData = new FormData();
    formData.append('file', this.selectedFile!);

    return this.http.post<{ url: string }>('http://localhost:5000/api/FileUpload', formData);
  }

  cancelEdit() {
    this.editProfile = { ...this.profile };
    this.selectedFile = null;
    this.imagePreview = null;
    this.isEditing = false;
  }

  viewAllBookings() {
    this.router.navigate(['/mybookings']);
  }

  logout() {
    // Call auth service logout which handles all cleanup
    this.auth.logout();

    // Update component state
    this.isLoggedIn = false;

    // Reset profile to default
    this.profile = {
      name: 'Sabrina Carpenter',
      email: 'sabrinacarpet@gmail.com',
      phone: '+1 (123) 456-7890',
      location: 'New York, USA',
      birthday: 'May 11, 1999',
      interests: 'Music, Theater, Sports',
      bio: 'Passionate about events and connecting people through amazing experiences. Love discovering new events and meeting like-minded individuals.',
      profilePic: '/pp.jpg'
    };
    this.editProfile = { ...this.profile };
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB.');
        return;
      }

      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onImageError(event: any) {
    // If image fails to load, fallback to default profile picture
    const imgElement = event.target as HTMLImageElement;
    const currentSrc = imgElement.src;
    const defaultSrc = '/pp.jpg';

    if (!currentSrc.includes('pp.jpg')) {
      imgElement.src = defaultSrc;
    }
  }

  loadUserTickets(userId: number): void {
    this.ticketService.getUserTickets(userId).subscribe({
      next: (tickets) => {
        if (this.recentTickets.length === 0) {
          console.log('No recent tickets found for user.');
        }
        console.log('User tickets fetched:', tickets);
        // Get the last 3 tickets (most recent)
        this.recentTickets = tickets.slice(-3).reverse();

      },
      error: (error) => {
        console.error('Error fetching user tickets:', error);
        this.recentTickets = [];
      }
    });
  }

  getEventIcon(category: string): string {
    const categoryLower = category?.toLowerCase() || '';
    if (categoryLower.includes('music') || categoryLower.includes('concert')) {
      return 'fas fa-music';
    } else if (categoryLower.includes('theater') || categoryLower.includes('play')) {
      return 'fas fa-theater-masks';
    } else if (categoryLower.includes('sport')) {
      return 'fas fa-football-ball';
    } else if (categoryLower.includes('festival')) {
      return 'fas fa-calendar-alt';
    }
    return 'fas fa-ticket-alt';
  }

  formatTicketDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
}
