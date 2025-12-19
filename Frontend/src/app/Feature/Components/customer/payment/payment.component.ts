import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PaymentService } from '../../../../Services/payment.service';
import { TicketService } from '../../../../Services/ticket.service';
import { StripeCardElement } from '@stripe/stripe-js';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit {
  cardElement?: StripeCardElement;
  isProcessing = false;
  errorMessage = '';
  
  eventId: number = 0;
  eventTitle: string = '';
  tickets: any[] = [];
  totalAmount: number = 0;

  constructor(
    private paymentService: PaymentService,
    private ticketService: TicketService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Get data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.tickets = navigation.extras.state['tickets'] || [];
      this.totalAmount = navigation.extras.state['totalAmount'] || 0;
      this.eventTitle = navigation.extras.state['eventTitle'] || '';
    }
  }

  async ngOnInit() {
    // Get eventId from route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('eventId');
      if (id) {
        this.eventId = +id;
      }
    });
  }

  async ngAfterViewInit() {
    const stripe = await this.paymentService.stripePromise;
    
    if (stripe) {
      const elements = stripe.elements();
      this.cardElement = elements.create('card');
      this.cardElement.mount('#card-element');
    }
  }

  async pay() {
    if (!this.cardElement) {
      this.errorMessage = 'Card element not initialized';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';

    const stripe = await this.paymentService.stripePromise;

    this.paymentService.createPaymentIntent()
      .subscribe({
        next: async (res) => {
          if (!stripe) {
            this.errorMessage = 'Stripe not initialized';
            this.isProcessing = false;
            return;
          }

          const result = await stripe.confirmCardPayment(
            res.clientSecret,
            {
              payment_method: {
                card: this.cardElement!
              }
            }
          );

          this.isProcessing = false;

          if (result.error) {
            this.errorMessage = result.error.message || 'Payment failed';
          } else if (result.paymentIntent?.status === 'succeeded') {
            // Payment successful, now create tickets
            await this.createTickets();
          }
        },
        error: (error) => {
          console.error('Payment intent creation failed:', error);
          this.errorMessage = error.error?.message || error.message || 'Failed to create payment intent. Please check if the backend server is running.';
          this.isProcessing = false;
        }
      });
  }

  private async createTickets(): Promise<void> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.errorMessage = 'User not logged in. Please log in and try again.';
      this.isProcessing = false;
      return;
    }

    const userIdNumber = parseInt(userId);
    const ticketPromises: Promise<any>[] = [];

    // Create tickets for each selected ticket type
    for (const ticket of this.tickets) {
      if (ticket.quantity > 0) {
        for (let i = 0; i < ticket.quantity; i++) {
          const ticketData = {
            eventID: this.eventId,
            ticketTypeID: ticket.id,
            userID: userIdNumber,
            quantity: 1 // Create individual tickets
          };

          ticketPromises.push(
            this.ticketService.createTicket(ticketData).toPromise()
          );
        }
      }
    }

    try {
      await Promise.all(ticketPromises);
      alert('Payment successful! 🎉 Your tickets have been added to your bookings.');
      this.router.navigate(['/my-bookings']);
    } catch (error) {
      console.error('Error creating tickets:', error);
      this.errorMessage = 'Payment was successful, but there was an error creating your tickets. Please contact support.';
      // Still navigate to bookings in case some tickets were created
      setTimeout(() => {
        this.router.navigate(['/my-bookings']);
      }, 3000);
    } finally {
      this.isProcessing = false;
    }
  }
}
