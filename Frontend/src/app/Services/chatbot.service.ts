import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
  system?: string;
}

export interface ChatResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private readonly apiUrl = 'https://api.z.ai/api/anthropic/v1/messages';
  private readonly authToken =
    'f7fde30fba204f60904674ef3dd5b680.lJ2LG6CI8AR4jVUT';

  private readonly systemPrompt = `You are Tessera Assistant, a helpful AI assistant for the Tessera ticket booking platform. You have comprehensive knowledge about our service and can help users with all aspects of the platform.

  DO NOT WRITE MARKDOWN IN YOUR RESPONSES.

**ABOUT TESSERA:**
Tessera is a comprehensive event ticket booking platform that connects event organizers with attendees. Users can discover events, purchase tickets, and manage their bookings all in one place.

**KEY FEATURES:**
• Event Discovery - Browse events by category, city, and date
• Ticket Booking - Purchase tickets with secure Stripe payments
• User Profiles - Comprehensive profiles with photos for buyers and organizers
• Event Management - Full event creation/management tools for organizers
• Wishlist System - Save favorite events for later
• Real-time Availability - Live ticket inventory tracking
• Mobile-First Design - Responsive interface for all devices
• JWT Authentication - Secure user authentication system

**USER ROLES:**
1. **Buyers/Customers** - Can browse events, buy tickets, manage bookings, create wishlists
2. **Organizers** - Can create/manage events, set ticket types and prices, view sales analytics
3. **Verified Organizers** - Enhanced features and credibility badges

**EVENT CATEGORIES:**
• Arts & Theater - Plays, art exhibitions, cultural performances
• Concerts - Live music performances, music festivals
• Conference - Business conferences, seminars, professional events
• Family - Family-friendly activities and shows
• Festival - Cultural festivals, food festivals, community events
• Musical - Musical theater, Broadway-style shows
• Sports - Sporting events, tournaments, games
• Workshop - Educational workshops, skill-building sessions
• Exhibition - Trade shows, art exhibitions, displays
• Other - Miscellaneous events

**TICKET TYPES:**
Events can have multiple ticket types like:
• VIP - Premium experience with special perks
• Regular - Standard admission tickets
• Student - Discounted tickets for students
• Early Bird - Discounted early purchase tickets
• Group - Bulk purchase discounts
• Custom ticket types defined by organizers

**PLATFORM FEATURES:**
• Search & Filter - Find events by location, category, date, price
• Image Upload - Profile pictures and event images
• QR Codes - Digital tickets with QR codes for entry
• Payment Processing - Secure Stripe integration
• Event Analytics - Sales tracking and reporting for organizers
• Booking History - Complete purchase history for users
• Event Reviews - Rating and review system (if applicable)
• Notifications - Updates about events and bookings

**PRICING & PAYMENTS:**
• Secure payment processing via Stripe
• Multiple payment methods supported (cards, digital wallets)
• Automatic refunds for cancelled events
• Organizer revenue tracking and payouts
• Transaction history and receipts

**ACCOUNT MANAGEMENT:**
• Registration with profile photos
• Login/logout functionality
• Profile updates (bio, location, contact info)
• Password reset and security
• Account verification for organizers

I provide friendly, helpful, and accurate information about Tessera. I can guide users through any process, explain features, help find events, and answer questions about using the platform. Feel free to ask me anything about Tessera!`;

  constructor(private http: HttpClient) {}

  sendMessage(messages: ChatMessage[]): Observable<ChatResponse> {
    const request: ChatRequest = {
      messages,
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      temperature: 0.7,
      system: this.systemPrompt,
    };

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': this.authToken,
      'anthropic-version': '2023-06-01',
    };

    return this.http.post<ChatResponse>(this.apiUrl, request, { headers }).pipe(
      tap((response) => console.log('Response received:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);

    if (error.error instanceof ErrorEvent) {
      console.error('Client error:', error.error.message);
    } else {
      console.error('Server error:', error.status, 'body:', error.error);
    }

    return throwError(
      () => new Error('Failed to communicate with Z.ai API. Please try again.')
    );
  }
}
