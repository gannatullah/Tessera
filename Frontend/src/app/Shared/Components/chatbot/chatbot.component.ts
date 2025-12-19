import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../../Services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  isOpen = false;
  isMinimized = false;
  messages: Array<{ role: string; content: string }> = [];
  userInput = '';
  isLoading = false;

  constructor(private chatbotService: ChatbotService) {
    // Add welcome message
    this.messages.push({
      role: 'assistant',
      content: 'Hi! I\'m your Tessera assistant. I can help you find events, answer questions about tickets, or provide event recommendations. How can I help you today?'
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.isMinimized = false;
    }
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage = this.userInput.trim();
    this.messages.push({
      role: 'user',
      content: userMessage
    });

    this.userInput = '';
    this.isLoading = true;

    // Prepare messages for API (exclude the initial welcome message from history)
    const apiMessages: ChatMessage[] = this.messages
      .slice(1) // Skip the welcome message
      .map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

    this.chatbotService.sendMessage(apiMessages).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Extract the text from the response
        const assistantMessage = response.content?.[0]?.text || 'I apologize, but I couldn\'t process that request.';
        
        this.messages.push({
          role: 'assistant',
          content: assistantMessage
        });

        // Auto-scroll to bottom
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Chat error:', error);
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.'
        });
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  clearChat() {
    this.messages = [{
      role: 'assistant',
      content: 'Hi! I\'m your Tessera assistant. How can I help you today?'
    }];
  }

  private scrollToBottom() {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}
