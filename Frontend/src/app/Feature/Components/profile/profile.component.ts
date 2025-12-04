import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../Core/Services/auth/auth.service';
import { Usersinterface } from '../../../Core/interfaces/usersinterface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  constructor(private router: Router, private auth:AuthService) {}
  isEditing = false;
  

  // Profile data
  profile = {
    name: 'Sabrina Carpenter',
    email: 'sabrinacarpet@gmail.com',
    phone: '+1 (123) 456-7890',
    location: 'New York, USA',
    birthday: 'May 11, 1999',
    interests: 'Music, Theater, Sports',
    bio: 'Passionate about events and connecting people through amazing experiences. Love discovering new events and meeting like-minded individuals.',
    profilePicture: 'pp.jpg'
  };

  // Temporary data for editing
  editProfile = { ...this.profile };
  selectedFile: File | null = null;
  imagePreview: string | null = null;

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
    // Save the edited data
    this.profile = { ...this.editProfile };

    // If a new image was selected, update the profile picture
    if (this.selectedFile) {
      // In a real app, you would upload the file to a server here
      // For now, we'll create a data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profile.profilePicture = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }

    this.isEditing = false;
    this.selectedFile = null;
    this.imagePreview = null;

    // Here you would typically make an API call to save to backend
    console.log('Profile saved:', this.profile);
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
    }
  }

  ngOnInit() {
    this.auth.getallusers('','').subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error) => console.error('Error:', error),
      complete: () => console.log('Completed'),
    });
  }
}
