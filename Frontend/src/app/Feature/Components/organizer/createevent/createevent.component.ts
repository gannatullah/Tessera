import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface EventData {
  name: string;
  description: string;
  category: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  ticketPrice: number;
  totalTickets: number;
  image: File | null;
  organizerName: string;
  organizerEmail: string;
  acceptTerms: boolean;
}

@Component({
  selector: 'app-createevent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createevent.component.html',
  styleUrls: ['./createevent.component.css']
})
export class CreateeventComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      // Basic Information
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      eventType: ['', Validators.required],

      // Date & Time
      eventDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],

      // Location
      venue: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],

      // Tickets
      ticketPrice: [0, [Validators.required, Validators.min(0)]],
      totalTickets: [100, [Validators.required, Validators.min(1)]],

      // Image
      image: [null],

      // Additional Info
      organizerName: [''],
      organizerEmail: ['', Validators.email],

      // Terms
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formData: EventData = this.eventForm.value;
      console.log('Event created:', formData);

      // TODO: Call API to create event
      // For now, navigate back to my events
      this.router.navigate(['/myevents']);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.eventForm.controls).forEach(key => {
        this.eventForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/myevents']);
  }

  // Helper method to check if form is valid for specific sections
  isSectionValid(sectionFields: string[]): boolean {
    return sectionFields.every(field => this.eventForm.get(field)?.valid);
  }
}
