import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./Shared/Components/navbar/navbar.component";
import { FooterComponent } from "./Shared/Components/footer/footer.component";
import { ChatbotComponent } from "./Shared/Components/chatbot/chatbot.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Tessera';
}
