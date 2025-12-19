import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventService, EventDto, UpdateEventDto } from '../../../../Services/event.service';
import { EVENT_CATEGORIES } from '../../../../Shared/constants/categories';

@Component({
  selector: 'app-editevent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editevent.component.html',
  styleUrls: ['./editevent.component.css']
})
export class EditeventComponent implements OnInit {
  eventForm: FormGroup;
  isSubmitting = false;
  isLoading = false;
  successMessage: string = '';
  errorMessage: string = '';
  categories = EVENT_CATEGORIES;
  eventId: number = 0;
  eventData: EventDto | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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
      image: ['']
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = +params['id'];
      if (this.eventId) {
        this.loadEventData();
      }
    });
  }

  loadEventData() {
    this.isLoading = true;
    this.errorMessage = '';

    this.eventService.getEvent(this.eventId).subscribe({
      next: (event: EventDto) => {
        this.eventData = event;
        this.populateForm(event);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.errorMessage = 'Failed to load event data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  populateForm(event: EventDto) {
    // Parse dates
    const eventDate = new Date(event.date);
    const startDateTime = new Date(event.st_Date);
    const endDateTime = new Date(event.e_Date);

    // Format date for input field (YYYY-MM-DD)
    const formattedDate = eventDate.toISOString().split('T')[0];

    // Format times for input fields (HH:MM)
    const startTime = startDateTime.toTimeString().slice(0, 5);
    const endTime = endDateTime.toTimeString().slice(0, 5);

    this.eventForm.patchValue({
      name: event.name,
      description: event.description,
      category: event.category,
      eventDate: formattedDate,
      startTime: startTime,
      endTime: endTime,
      location: event.location,
      city: event.city,
      capacity: event.capacity,
      image: event.image
    });
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

      const updateEventDto: UpdateEventDto = {
        name: formValue.name,
        description: formValue.description,
        category: formValue.category,
        date: new Date(eventDate).toISOString(),
        st_Date: new Date(stDateTime).toISOString(),
        e_Date: new Date(eDateTime).toISOString(),
        city: formValue.city,
        location: formValue.location,
        capacity: formValue.capacity,
        image: formValue.image
      };

      this.eventService.updateEvent(this.eventId, updateEventDto).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = 'Event updated successfully!';
          console.log('Event updated successfully:', response);

          // Navigate back to my events after a short delay
          setTimeout(() => {
            this.router.navigate(['/myevents']);
          }, 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Failed to update event. Please try again.';
          console.error('Error updating event:', error);
        }
      });
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
}