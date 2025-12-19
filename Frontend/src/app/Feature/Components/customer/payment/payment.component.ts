import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PaymentService } from '../../../../Services/payment.service';
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
            alert('Payment successful 🎉');
            // Navigate back to home or success page
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('Payment intent creation failed:', error);
          this.errorMessage = error.error?.message || error.message || 'Failed to create payment intent. Please check if the backend server is running.';
          this.isProcessing = false;
        }
      });
  }
}
