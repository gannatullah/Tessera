import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService, CreateEventDto, CreateTicketTypeDto } from '../../../../Services/event.service';
import { EVENT_CATEGORIES } from '../../../../Shared/constants/categories';

@Component({
  selector: 'app-createevent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './createevent.component.html',
  styleUrls: ['./createevent.component.css']
})
export class CreateeventComponent {
  eventForm: FormGroup;
  isSubmitting = false;
  successMessage: string = '';
  errorMessage: string = '';
  categories = EVENT_CATEGORIES;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private eventService: EventService
  ) {
    this.eventForm = this.fb.group({
      // Basic Information
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],

      // Date & Time
      eventDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],

      // Location
      location: ['', Validators.required],
      city: ['', Validators.required],

      // Capacity
      capacity: [100, [Validators.min(1)]],

      // Image
      image: [''],

      // Organizer ID (hardcoded for now, should come from auth)
      organizerID: [1, [Validators.required, Validators.min(1)]],

      // Ticket Types
      ticketTypes: this.fb.array([
        this.createTicketTypeGroup()
      ])
    });
  }

  createTicketTypeGroup(): FormGroup {
    return this.fb.group({
      name: ['Regular', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity_Total: [100, [Validators.required, Validators.min(1)]]
    });
  }

  get ticketTypes(): FormArray {
    return this.eventForm.get('ticketTypes') as FormArray;
  }

  addTicketType(): void {
    this.ticketTypes.push(this.createTicketTypeGroup());
  }

  removeTicketType(index: number): void {
    if (this.ticketTypes.length > 1) {
      this.ticketTypes.removeAt(index);
    }
  }

  onSubmit() {
    if (this.eventForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';

      const formValue = this.eventForm.value;

      // Combine date and time for st_Date and e_Date
      const eventDate = formValue.eventDate;
      const stDateTime = `${eventDate}T${formValue.startTime}:00`;
      const eDateTime = `${eventDate}T${formValue.endTime}:00`;

      const createEventDto: CreateEventDto = {
        category: formValue.category,
        name: formValue.name,
        date: new Date(eventDate).toISOString(),
        st_Date: new Date(stDateTime).toISOString(),
        e_Date: new Date(eDateTime).toISOString(),
        city: formValue.city,
        location: formValue.location,
        capacity: formValue.capacity,
        description: formValue.description,
        image: formValue.image,
        organizerID: formValue.organizerID,
        ticketTypes: formValue.ticketTypes
      };

      this.eventService.createEvent(createEventDto).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = 'Event created successfully!';
          console.log('Event created successfully:', response);
          console.log('Response details:', {
            eventId: response.event_ID,
            category: response.category,
            date: response.date,
            location: response.location,
            ticketTypes: response.ticketTypes
          });
          
          // Reset form after successful submission
          this.eventForm.reset();
          this.ticketTypes.clear();
          this.ticketTypes.push(this.createTicketTypeGroup());
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Failed to create event. Please try again.';
          console.error('Error creating event:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.error?.message,
            errors: error.error?.errors
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.eventForm.controls).forEach(key => {
        this.eventForm.get(key)?.markAsTouched();
      });
      this.ticketTypes.controls.forEach(control => {
        Object.keys((control as FormGroup).controls).forEach(key => {
          control.get(key)?.markAsTouched();
        });
      });
    }
  }

  onCancel() {
    this.router.navigate(['/myevents']);
  }
}
