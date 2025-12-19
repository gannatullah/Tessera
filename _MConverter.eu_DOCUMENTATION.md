# Tessera

**Event Ticket Booking System**

## 📋 Table of Contents {#table-of-contents}

- [Key Features](#Xebf7a5b073191bfae2e7a37227e67a13c65a712)
- [Project Overview](#Xaaa703d4e9ee0de442344e5cb65cfd30f9b387c)
- [Architecture Overview](#X8605d3767a6b59b0eccbdd7cea00b12b9bcc464)
- [Technology Stack](#X360f16ea85e59cfa5667d54893075a3a3f76208)
- [Database Schema](#X5d004e72097bcb69dd9baaf00bdfbebeffde1cb)
- [Payment Processing](#X4f5a8b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f)
- [Backend Architecture
  Details](#X8264b0d71ab7c59f9eec702a5f49aad4d2acf5f)
- [Frontend Architecture
  Details](#Xf8315c379f82813d6d9fe7771fa3afee22d22a6)
- [Security Implementation](#X583a77e2cc9a0950a3c813d0c5a09d073ed19c8)
- [User Roles & Permissions](#Xe54994312501a6bfbbe6fdf36a183e051a3c1f7)
- [Deployment & DevOps](#X8749684b8a9cec485cdf3c59724e7ce74de2e01)
- [Testing Strategy](#X0a4ea9a0436d653c6e180b52c90e3eeec6735e8)
- [Performance Optimizations](#X6199e90996e8d163769c5ac9283402bda7e3b02)
- [API Integration](#X53d7031aa97c9e0ae95da5e43ca5b7249a4856c)
- [UI/UX Design](#X96c414fd8af046550c78db309839e969dab986a)
- [Development Workflow](#X9483fa65d3ed900d65d417ed33b4bd764419993)
- [Future Enhancements](#Xb447f16bb3e28f7f3024f9f87dce53e77b989e2)
- [Team & Contributions](#X5b6fadcb2b6e2daffa03dbcb1d7539281f6f909)
- [Support & Documentation](#Xfeb17e0158049e13291d2b3cc4df53ff87b7d56)
- [Quick Start Guide](#X0bf0d20b1c4fa72cf7c2ea99b1c94eb654b1652)
- [Contact Information](#Xd676c18b173716eaa69c8ba0d1bf4243ca88be1)

## 🚀 Key Features {#key-features}

### Core Functionality

- **Event Discovery**: Browse and search events by category, location,
  and date
- **Ticket Booking**: Seamless ticket purchasing with multiple ticket
  types
- **User Management**: Comprehensive user profiles with buyer and
  organizer roles
- **Event Management**: Full event creation and management for
  organizers
- **Booking History**: Complete ticket history and management dashboard

### Advanced Features

- **Real-time Availability**: Live ticket inventory tracking
- **Wishlist System**: Save favorite events for later
- **Organizer Verification**: Verified organizer accounts with enhanced
  features
- **Payment Processing**: Secure Stripe integration for ticket purchases
- **Responsive Design**: Mobile-first design for all devices
- **Multi-role Support**: Separate interfaces for buyers and organizers

### Technical Features

- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Complete REST API with Swagger documentation
- **Database Relations**: Complex relationships with Entity Framework
  Core
- **Angular Standalone**: Modern Angular architecture with lazy loading
- **Type Safety**: Full TypeScript implementation

### User Experience

- **Intuitive Interface**: Clean, modern UI with Bootstrap 5
- **Fast Performance**: Optimized loading with Angular lazy loading
- **Error Handling**: Comprehensive error management and user feedback
- **Accessibility**: WCAG compliant design patterns
- **Offline Support**: Progressive Web App capabilities

## 📋 Project Overview {#project-overview}

Tessera is a comprehensive event ticket booking platform that connects
event organizers with attendees. The system allows users to browse
events, purchase tickets, manage bookings, and enables organizers to
create and manage their events. Built with modern web technologies,
Tessera provides a seamless experience for both event discovery and
management.

## 🏗️ Architecture Overview {#architecture-overview}

### Backend Architecture

- **Framework**: ASP.NET Core Web API (.NET 9.0)
- **Architecture Pattern**: Layered Architecture (Controllers, Services,
  Data Access)
- **Database**: MySQL with Entity Framework Core
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI

### Frontend Architecture

- **Framework**: Angular 18 (Standalone Components)
- **Language**: TypeScript
- **Styling**: Bootstrap 5 + Custom CSS
- **State Management**: RxJS Observables
- **Routing**: Angular Router with Lazy Loading

## 🛠️ Technology Stack {#technology-stack}

### Backend Technologies

#### Core Framework & Runtime {#core-framework-runtime}

- **.NET 9.0** - Latest .NET runtime with enhanced performance and
  features
- **ASP.NET Core Web API** - RESTful API framework
- **C# 12** - Modern C# language features

#### Database & ORM {#database-orm}

- **MySQL 8.0+** - Relational database management system
- **Entity Framework Core 8.0** - Object-Relational Mapping (ORM)
- **Pomelo.EntityFrameworkCore.MySql 8.0.2** - MySQL provider for EF
  Core

#### Authentication & Security {#authentication-security}

- **JWT (JSON Web Token)** - Stateless authentication
- **Microsoft.AspNetCore.Authentication.JwtBearer 8.0.11** - JWT
  middleware
- **System.IdentityModel.Tokens.Jwt 8.15.0** - JWT token handling
- **Stripe.net 43.0.0** - Payment processing SDK

#### API Documentation

- **Swashbuckle.AspNetCore 6.5.0** - Swagger/OpenAPI documentation

### Frontend Technologies

#### Core Framework

- **Angular 18.2.0** - Modern web framework
- **TypeScript 5.5.2** - Typed JavaScript
- **RxJS 7.8.0** - Reactive programming library
- **Zone.js 0.14.10** - Execution context for Angular

#### UI & Styling {#ui-styling}

- **Bootstrap 5.3.8** - CSS framework for responsive design
- **Font Awesome 7.1.0** - Icon library
- **Custom CSS** - Application-specific styling

#### Development Tools

- **Angular CLI 18.2.21** - Command-line interface
- **Angular DevKit 18.2.21** - Build tools
- **Karma 6.4.0** - Test runner
- **Jasmine 5.1.0** - Testing framework

#### Additional Libraries

- **country-city 1.0.0** - Location data
- **country-state-city 3.2.1** - Geographic data
- **typed.js 2.1.0** - Typing animation
- **world-countries 5.1.0** - Country information
- **@stripe/stripe-js 3.0.0** - Stripe JavaScript SDK

## 📊 Database Schema {#database-schema}

### Core Tables

#### 1. Users Table {#users-table}

    CREATE TABLE Users (
        ID INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL,
        First_Name VARCHAR(50) NOT NULL,
        Last_Name VARCHAR(50) NOT NULL,
        Email VARCHAR(100) NOT NULL UNIQUE,
        Phone_No VARCHAR(20) NOT NULL,
        Password VARCHAR(255) NOT NULL,
        DOB DATETIME NULL,
        ProfilePic VARCHAR(500) NULL,
        Location VARCHAR(100) NULL,
        Bio VARCHAR(1000) NULL
    );

**Fields Description:** - `ID`: Primary key, auto-increment - `Name`:
Full display name - `First_Name` & `Last_Name`: Separated for formal
use - `Email`: Unique identifier for authentication - `Phone_No`:
Contact information - `Password`: Hashed password - `DOB`: Date of birth
(optional) - `ProfilePic`: Profile image URL/path - `Location`: User's
location - `Bio`: User biography/description

#### 2. Buyers Table (User Extension) {#buyers-table-user-extension}

    CREATE TABLE Buyers (
        UserID INT PRIMARY KEY,
        Nationality VARCHAR(50) NULL,
        Location VARCHAR(100) NULL,
        FOREIGN KEY (UserID) REFERENCES Users(ID)
    );

**Fields Description:** - `UserID`: Foreign key to Users table -
`Nationality`: Buyer's nationality - `Location`: Specific buyer location

#### 3. Organizers Table (User Extension) {#organizers-table-user-extension}

    CREATE TABLE Organizers (
        UserID INT PRIMARY KEY,
        IsVerified BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (UserID) REFERENCES Users(ID)
    );

**Fields Description:** - `UserID`: Foreign key to Users table -
`IsVerified`: Verification status for organizers

#### 4. Events Table {#events-table}

    CREATE TABLE Events (
        Event_ID INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(200) NOT NULL,
        Category VARCHAR(200) NOT NULL,
        Date DATE NOT NULL,
        St_Date DATETIME NOT NULL,
        E_Date DATETIME NOT NULL,
        City VARCHAR(100) NULL,
        Location VARCHAR(200) NULL,
        Capacity INT NULL,
        Description VARCHAR(1000) NULL,
        Image VARCHAR(500) NULL,
        OrganizerID INT NOT NULL,
        FOREIGN KEY (OrganizerID) REFERENCES Organizers(UserID)
    );

**Fields Description:** - `Event_ID`: Primary key, auto-increment -
`Name`: Event title - `Category`: Event type (Arts & Theater, Concerts,
etc.) - `Date`: Event date - `St_Date`: Event start time - `E_Date`:
Event end time - `City`: Event city - `Location`: Specific venue
location - `Capacity`: Maximum attendees - `Description`: Event
details - `Image`: Event image URL - `OrganizerID`: Foreign key to
Organizers

#### 5. TicketTypes Table {#tickettypes-table}

    CREATE TABLE TicketTypes (
        ID INT PRIMARY KEY AUTO_INCREMENT,
        Name VARCHAR(100) NOT NULL,
        Price DECIMAL(10,2) NOT NULL,
        Quantity_Total INT NOT NULL,
        Quantity_Sold INT DEFAULT 0,
        Event_ID INT NOT NULL,
        FOREIGN KEY (Event_ID) REFERENCES Events(Event_ID)
    );

**Fields Description:** - `ID`: Primary key, auto-increment - `Name`:
Ticket type name (VIP, Regular, etc.) - `Price`: Ticket price -
`Quantity_Total`: Total tickets available - `Quantity_Sold`: Tickets
sold (calculated field) - `Event_ID`: Foreign key to Events

#### 6. Tickets Table {#tickets-table}

    CREATE TABLE Tickets (
        Ticket_ID INT PRIMARY KEY AUTO_INCREMENT,
        Status VARCHAR(50) DEFAULT 'Available',
        QR_Code VARCHAR(100) NULL,
        TicketTypeID INT NOT NULL,
        EventID INT NOT NULL,
        UserID INT NULL,
        FOREIGN KEY (TicketTypeID) REFERENCES TicketTypes(ID),
        FOREIGN KEY (EventID) REFERENCES Events(Event_ID),
        FOREIGN KEY (UserID) REFERENCES Buyers(UserID)
    );

**Fields Description:** - `Ticket_ID`: Primary key, auto-increment -
`Status`: Ticket status (Available, Sold, Cancelled) - `QR_Code`: QR
code for ticket validation - `TicketTypeID`: Foreign key to
TicketTypes - `EventID`: Foreign key to Events - `UserID`: Foreign key
to Buyers (nullable)

#### 7. Orders Table {#orders-table}

    CREATE TABLE Orders (
        ID INT PRIMARY KEY AUTO_INCREMENT,
        Total_Amount DECIMAL(10,2) NOT NULL,
        Order_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
        UserID INT NOT NULL,
        FOREIGN KEY (UserID) REFERENCES Users(ID)
    );

**Fields Description:** - `ID`: Primary key, auto-increment -
`Total_Amount`: Order total price - `Order_Date`: Order timestamp -
`UserID`: Foreign key to Users

#### 8. Wishlist Table {#wishlist-table}

    CREATE TABLE Wishlist (
        ID INT PRIMARY KEY AUTO_INCREMENT,
        UserID INT NOT NULL,
        EventID INT NOT NULL,
        AddedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Buyers(UserID),
        FOREIGN KEY (EventID) REFERENCES Events(Event_ID)
    );

**Fields Description:** - `ID`: Primary key, auto-increment - `UserID`:
Foreign key to Buyers - `EventID`: Foreign key to Events - `AddedDate`:
When item was added to wishlist

## � Payment Processing {#payment-processing}

### Overview

Tessera implements a comprehensive payment processing system using Stripe for secure ticket purchases. The payment system ensures PCI compliance, handles multiple currencies, and provides instant ticket generation upon successful payment.

### Payment Architecture

#### Frontend Payment Flow

- **Stripe Elements**: Secure credit card input fields
- **Payment Intent**: Server-side payment intent creation
- **Real-time Validation**: Client-side form validation
- **Error Handling**: Comprehensive error messaging
- **Success Confirmation**: Instant feedback and ticket generation

#### Backend Payment Integration

- **Stripe .NET SDK**: Server-side Stripe integration
- **Payment Intent API**: Secure payment processing
- **Webhook Support**: Real-time payment status updates
- **Refund Processing**: Automated refund handling

### Payment Components

#### Payment Component (`payment.component.ts`)

```typescript
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
  ) {}

  async pay() {
    // Payment processing logic
    // 1. Create payment intent
    // 2. Confirm card payment
    // 3. Create tickets on success
    // 4. Navigate to bookings
  }
}
```

#### Payment Service (`payment.service.ts`)

```typescript
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  stripePromise = loadStripe(environment.stripePublishableKey);

  createPaymentIntent(amount: number, currency: string = 'usd') {
    return this.http.post('/api/payment/create-intent', {
      amount,
      currency
    });
  }
}
```

### Payment Flow

#### 1. Ticket Selection
- User selects tickets on event details page
- Calculates total amount
- Navigates to payment page with ticket data

#### 2. Payment Form
- Stripe Elements render secure card input
- Real-time validation and error display
- Amount and event details displayed

#### 3. Payment Processing
- Creates payment intent on server
- Confirms payment with Stripe
- Handles 3D Secure authentication if required

#### 4. Success Handling
- Creates individual tickets in database
- Generates QR codes for tickets
- Updates ticket inventory
- Sends confirmation email (future enhancement)

#### 5. Error Handling
- Payment failures with detailed error messages
- Network error recovery
- Partial payment handling

### Ticket Creation Logic

After successful payment, the system creates individual tickets:

```typescript
private async createTickets(): Promise<void> {
  const userId = localStorage.getItem('userId');
  
  for (const ticket of this.tickets) {
    if (ticket.quantity > 0) {
      for (let i = 0; i < ticket.quantity; i++) {
        const ticketData = {
          eventID: this.eventId,
          ticketTypeID: ticket.id,
          userID: userId,
          quantity: 1
        };
        
        await this.ticketService.createTicket(ticketData).toPromise();
      }
    }
  }
  
  alert('Payment successful! Your tickets have been added to your bookings.');
  this.router.navigate(['/my-bookings']);
}
```

### Security Features

#### PCI Compliance
- **Stripe Elements**: Card data never touches application servers
- **Tokenization**: Sensitive data converted to secure tokens
- **Encryption**: All payment data encrypted in transit and at rest

#### Fraud Prevention
- **Address Verification**: AVS checks for card validation
- **CVV Verification**: Card security code validation
- **3D Secure**: Additional authentication layer
- **Velocity Checks**: Rate limiting and suspicious activity detection

### Payment Methods

#### Supported Cards
- Visa
- MasterCard
- American Express
- Discover
- JCB
- Diners Club

#### Alternative Methods (Future)
- Digital Wallets (Apple Pay, Google Pay)
- Bank transfers
- Buy now, pay later options
- Cryptocurrency payments

### Currency Support

- **Base Currency**: USD (United States Dollar)
- **Multi-currency Support**: Framework ready for international currencies
- **Exchange Rate Handling**: Real-time currency conversion
- **Regional Pricing**: Location-based pricing support

### Refund System

#### Automatic Refunds
- **Event Cancellation**: Full refund for cancelled events
- **Organizer-Initiated**: Refunds for event changes
- **User Cancellations**: Refund policy-based processing

#### Refund Processing
```typescript
processRefund(paymentIntentId: string, amount: number) {
  return this.http.post('/api/payment/refund', {
    paymentIntentId,
    amount
  });
}
```

### Transaction Records

#### Database Schema
```sql
CREATE TABLE PaymentTransactions (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    StripePaymentIntentId VARCHAR(255) NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    Currency VARCHAR(3) DEFAULT 'USD',
    Status VARCHAR(50) NOT NULL,
    UserID INT NOT NULL,
    EventID INT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(ID),
    FOREIGN KEY (EventID) REFERENCES Events(Event_ID)
);
```

### Error Handling

#### Payment Errors
- **Card Declined**: Insufficient funds, expired card, etc.
- **Network Issues**: Connection timeouts and retries
- **Validation Errors**: Invalid card details
- **Authentication Failures**: 3D Secure failures

#### Recovery Mechanisms
- **Retry Logic**: Automatic retry for transient failures
- **Fallback Options**: Alternative payment methods
- **User Guidance**: Clear error messages and next steps

### Testing & Quality Assurance

#### Test Cards
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

#### Integration Testing
- **Unit Tests**: Payment service testing
- **Integration Tests**: Full payment flow testing
- **E2E Tests**: Complete user journey testing

### Monitoring & Analytics

#### Payment Metrics
- **Success Rate**: Payment completion percentage
- **Failure Analysis**: Common failure reasons
- **Processing Time**: Average payment completion time
- **Revenue Tracking**: Total payments and amounts

#### Business Intelligence
- **Popular Events**: High-revenue events
- **Payment Methods**: Preferred payment options
- **Geographic Data**: Payment locations and currencies
- **Seasonal Trends**: Payment patterns over time

### Future Enhancements

#### Advanced Features
- **Subscription Model**: Recurring event payments
- **Dynamic Pricing**: Demand-based ticket pricing
- **Loyalty Program**: Reward points for frequent buyers
- **Mobile Payments**: NFC and QR code payments

#### Technical Improvements
- **Payment Links**: Shareable payment URLs
- **Batch Processing**: Bulk ticket purchases
- **API Rate Limiting**: Prevent abuse and ensure fair usage
- **Real-time Notifications**: Payment status updates via WebSocket

## �🔧 Backend Architecture Details {#backend-architecture-details}

### Project Structure

    Backend/
    ├── Controllers/          # API Controllers
    │   ├── BuyersController.cs
    │   ├── EventsController.cs
    │   ├── OrganizersController.cs
    │   ├── PaymentController.cs
    │   ├── TicketsController.cs
    │   ├── TicketTypesController.cs
    │   ├── UsersController.cs
    │   └── WishlistController.cs
    ├── Data/
    │   └── ApplicationDbContext.cs
    ├── DTOs/                 # Data Transfer Objects
    │   ├── BuyerDTO.cs
    │   ├── EventDto.cs
    │   ├── LoginDto.cs
    │   ├── LoginResponseDto.cs
    │   ├── OrganizerDto.cs
    │   ├── PaymentIntentDto.cs
    │   ├── PaymentTransactionDto.cs
    │   ├── TicketDto.cs
    │   ├── UserDto.cs
    │   └── WishlistDto.cs
    ├── Models/               # Entity Models
    │   ├── Event.cs
    │   ├── Order.cs
    │   ├── PaymentTransaction.cs
    │   ├── Ticket.cs
    │   ├── User.cs
    │   └── Wishlist.cs
    ├── Services/
    │   └── JwtService.cs
    ├── Migrations/           # EF Core Migrations
    └── Program.cs           # Application Entry Point

### API Controllers

#### EventsController

- **GET** `/api/events` - Get all events with filtering
- **GET** `/api/events/{id}` - Get event by ID
- **POST** `/api/events` - Create new event (Organizer only)
- **PUT** `/api/events/{id}` - Update event (Organizer only)
- **DELETE** `/api/events/{id}` - Delete event (Organizer only)
- **GET** `/api/events/organizer/{organizerId}` - Get events by
  organizer

#### TicketsController

- **GET** `/api/tickets` - Get all tickets
- **GET** `/api/tickets/{id}` - Get ticket by ID
- **POST** `/api/tickets` - Create ticket
- **PUT** `/api/tickets/{id}` - Update ticket
- **DELETE** `/api/tickets/{id}` - Delete ticket
- **GET** `/api/tickets/usertickets/{userId}` - Get user's tickets

#### UsersController

- **GET** `/api/users` - Get all users
- **GET** `/api/users/{id}` - Get user by ID
- **POST** `/api/users` - Register new user
- **PUT** `/api/users/{id}` - Update user
- **DELETE** `/api/users/{id}` - Delete user
- **POST** `/api/users/login` - User login

#### Other Controllers

- **BuyersController**: Buyer-specific operations
- **OrganizersController**: Organizer management
- **TicketTypesController**: Ticket type management
- **WishlistController**: Wishlist operations
- **PaymentController**: Payment processing operations

#### PaymentController

- **POST** `/api/payment/create-intent` - Create payment intent for ticket purchase
- **POST** `/api/payment/confirm-payment` - Confirm payment and create tickets
- **POST** `/api/payment/webhook` - Handle Stripe webhook events
- **POST** `/api/payment/refund/{ticketId}` - Process refund for ticket

### Authentication & Authorization {#authentication-authorization}

- **JWT Bearer Authentication**
- **Role-based Access Control**
- **Password Hashing** (implemented in service layer)
- **Token Expiration** and refresh mechanisms

### Data Transfer Objects (DTOs)

- **EventDto**: Event data with organizer and ticket types
- **TicketDto**: Ticket data with event and ticket type details
- **UserDto**: User profile information
- **LoginDto/LoginResponseDto**: Authentication DTOs

## 🎨 Frontend Architecture Details {#frontend-architecture-details}

### Project Structure

    Frontend/
    ├── src/
    │   ├── app/
    │   │   ├── Core/                 # Core functionality
    │   │   │   ├── Components/       # Shared UI components
    │   │   │   │   ├── account-type/
    │   │   │   │   ├── login/
    │   │   │   │   └── register/
    │   │   │   ├── Services/         # Core services
    │   │   │   └── interfaces/
    │   │   ├── Feature/              # Feature modules
    │   │   │   ├── Components/
    │   │   │   │   ├── customer/     # Customer features
    │   │   │   │   │   ├── event-details/
    │   │   │   │   │   ├── home/
    │   │   │   │   │   ├── mybookings/
    │   │   │   │   │   └── wishlist/
    │   │   │   │   ├── organizer/    # Organizer features
    │   │   │   │   │   ├── createevent/
    │   │   │   │   │   ├── myevents/
    │   │   │   │   │   └── organizer-profile/
    │   │   │   │   └── profile/      # User profile
    │   │   │   └── Services/         # Feature services
    │   │   ├── Guards/               # Route guards
    │   │   ├── Interceptors/         # HTTP interceptors
    │   │   ├── Services/             # Shared services
    │   │   └── Shared/               # Shared components
    │   │       ├── Components/
    │   │       │   ├── events/
    │   │       │   ├── footer/
    │   │       │   └── navbar/
    │   │       └── constants/
    └── public/                       # Static assets

### Component Architecture

#### Standalone Components

- **Modern Angular Architecture**: All components are standalone
- **Tree-shakable**: Only imports what it needs
- **Lazy Loading**: Components loaded on demand

#### Core Components

- **Login/Register**: Authentication forms
- **Account Type**: User role selection
- **Navbar**: Navigation with user menu
- **Footer**: Site footer

#### Feature Components

##### Customer Features

- **Home**: Landing page with featured events
- **Events**: Event browsing with filters
- **Event Details**: Individual event page with ticket selection
- **Payment**: Secure Stripe payment processing
- **My Bookings**: User's ticket management
- **Wishlist**: Saved events

##### Organizer Features

- **Create Event**: Event creation form
- **My Events**: Organizer's event management
- **Organizer Profile**: Public organizer profile

##### Shared Features

- **Profile**: User profile management
- **Events Component**: Reusable event display

### Services Architecture

#### Core Services

- **AuthService**: Authentication and user management
- **EventService**: Event CRUD operations
- **PaymentService**: Stripe payment processing
- **TicketService**: Ticket management
- **UserService**: User profile operations
- **WishlistService**: Wishlist management

#### Service Features

- **HTTP Client**: Angular HttpClient for API calls
- **RxJS**: Reactive programming with Observables
- **Error Handling**: Comprehensive error management
- **Caching**: Local storage for user data

### Routing Architecture

    const routes: Routes = [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./Feature/Components/customer/home/home.component')
      },
      {
        path: 'events',
        loadComponent: () => import('./Shared/Components/events/events.component')
      },
      // ... more lazy-loaded routes
    ];

**Features:** - **Lazy Loading**: Components loaded on demand - **Route
Guards**: Authentication protection - **Child Routes**: Nested
navigation

## 🔐 Security Implementation {#security-implementation}

### Backend Security

- **JWT Authentication**: Stateless token-based auth
- **Password Hashing**: Secure password storage
- **CORS Policy**: Cross-origin resource sharing
- **Input Validation**: Model validation attributes
- **SQL Injection Prevention**: EF Core parameterized queries

### Frontend Security

- **HTTP Interceptors**: Automatic token attachment
- **Route Guards**: Protected route access
- **Input Sanitization**: Angular built-in sanitization
- **XSS Prevention**: Angular template security

## 📱 User Roles & Permissions {#user-roles-permissions}

### 1. Guest Users {#guest-users}

- Browse events
- View event details
- Register/Login

### 2. Buyers (Authenticated Users) {#buyers-authenticated-users}

- All guest permissions
- Purchase tickets
- View booking history
- Manage profile
- Add to wishlist
- Cancel tickets (with conditions)

### 3. Organizers (Verified Event Creators) {#organizers-verified-event-creators}

- All buyer permissions
- Create events
- Manage own events
- View event analytics
- Manage ticket types
- Process refunds

## 🚀 Deployment & DevOps {#deployment-devops}

### Backend Deployment

- **Docker Support**: Containerized deployment
- **Environment Configuration**: Multiple environments
- **Database Migrations**: EF Core migrations
- **Swagger Documentation**: API documentation

### Frontend Deployment

- **Angular SSR**: Server-side rendering support
- **Build Optimization**: Tree-shaking and minification
- **Asset Optimization**: Image and font optimization

## 🧪 Testing Strategy {#testing-strategy}

### Backend Testing

- **Unit Tests**: Service and controller testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: EF Core testing

### Frontend Testing

- **Unit Tests**: Component and service testing
- **E2E Tests**: End-to-end user journey testing
- **Karma + Jasmine**: Test framework setup

## 📈 Performance Optimizations {#performance-optimizations}

### Backend Optimizations

- **EF Core Query Optimization**: Include() for eager loading
- **Database Indexing**: Optimized queries
- **Caching**: Response caching where appropriate
- **Async/Await**: Non-blocking operations

### Frontend Optimizations

- **Lazy Loading**: Route-based code splitting
- **Change Detection**: OnPush strategy
- **Bundle Splitting**: Optimized chunk sizes
- **Image Optimization**: Responsive images

## 🔄 API Integration {#api-integration}

### RESTful API Design

- **HTTP Methods**: GET, POST, PUT, DELETE
- **Status Codes**: Standard HTTP status codes
- **Content Negotiation**: JSON responses
- **Versioning**: API versioning support

### Error Handling

- **Global Exception Handling**: Centralized error management
- **Validation Errors**: Detailed field-level validation
- **Custom Error Responses**: User-friendly error messages

## 🎨 UI/UX Design {#uiux-design}

### Design System

- **Bootstrap 5**: Responsive grid system
- **Custom Color Palette**: Brand-consistent colors
- **Typography**: Readable font hierarchy
- **Icon System**: Font Awesome icons

### Responsive Design

- **Mobile-First**: Mobile-optimized design
- **Breakpoint System**: Bootstrap responsive breakpoints
- **Touch-Friendly**: Mobile interaction patterns

## 📚 Development Workflow {#development-workflow}

### Version Control

- **Git**: Distributed version control
- **Branching Strategy**: Feature branches
- **Pull Requests**: Code review process

### Code Quality

- **TypeScript**: Type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 🔮 Future Enhancements {#future-enhancements}

### Planned Features

- **Real-time Notifications**: WebSocket integration
- **Payment Gateway**: Stripe/PayPal integration
- **Mobile App**: React Native companion app
- **Advanced Analytics**: Event performance metrics
- **Social Features**: Event sharing and reviews
- **Multi-language Support**: Internationalization

### Technical Improvements

- **Microservices**: API decomposition
- **GraphQL**: Flexible data fetching
- **Redis Caching**: Performance optimization
- **CI/CD Pipeline**: Automated deployment
- **Monitoring**: Application performance monitoring

## 👥 Team & Contributions {#team-contributions}

### Development Team

- **Backend Developers**: .NET Core API development
- **Frontend Developers**: Angular application development
- **UI/UX Designers**: User interface design
- **Database Administrators**: Database design and optimization

### Contributing Guidelines

- **Code Standards**: Consistent coding practices
- **Documentation**: Comprehensive code documentation
- **Testing**: Required test coverage
- **Code Reviews**: Mandatory peer reviews

## 📞 Support & Documentation {#support-documentation}

### API Documentation

- **Swagger UI**: Interactive API documentation
- **OpenAPI Specification**: Machine-readable API specs
- **Postman Collection**: API testing collection

### User Documentation

- **User Guides**: Platform usage instructions
- **FAQ**: Frequently asked questions
- **Video Tutorials**: Visual learning resources

## 📋 Quick Start Guide {#quick-start-guide}

### Prerequisites

- .NET 9.0 SDK
- Node.js 18+
- MySQL 8.0+
- Angular CLI 18+

### Backend Setup

    cd Backend
    dotnet restore
    dotnet ef database update
    dotnet run

### Frontend Setup

    cd Frontend
    npm install
    npm start

### Database Setup

    -- Run migrations in order
    dotnet ef migrations add InitialCreate
    dotnet ef database update

## 📞 Contact Information {#contact-information}

For technical support, feature requests, or bug reports: - **Email**:
support@tessera.com - **Documentation**: https://docs.tessera.com -
**Issue Tracker**: GitHub Issues

*This documentation is comprehensive and covers all aspects of the
Tessera event ticket booking system. It serves as both a technical
reference and a project overview for developers, stakeholders, and
future maintainers.*
