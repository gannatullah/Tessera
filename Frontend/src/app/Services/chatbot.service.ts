import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  content: Array<{ text: string }>;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly apiUrl = 'https://api.z.ai/api/anthropic/v1/messages';
  private readonly authToken = 'f7fde30fba204f60904674ef3dd5b680.lJ2LG6CI8AR4jVUT';

  constructor(private http: HttpClient) {}

  sendMessage(messages: ChatMessage[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.authToken,
      'anthropic-version': '2023-06-01'
    });

    const body = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: messages,
      system: 'You are a helpful assistant for Tessera, a ticket booking platform. Help users find events, answer questions about tickets, and provide event recommendations. Be friendly, concise, and helpful.'
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
