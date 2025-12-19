# Payment Integration Setup

## Configuration Required

Before running the application, you need to set up your environment configuration files:

### Backend Configuration

1. Copy the example file to create your appsettings files:
   ```bash
   cp Backend/appsettings.example.json Backend/appsettings.json
   cp Backend/appsettings.Development.example.json Backend/appsettings.Development.json
   ```

2. Update the following in your `appsettings.json`:
   - Database connection string
   - JWT secret key
   - Stripe secret key (get from https://dashboard.stripe.com/test/apikeys)

3. Update the Stripe secret key in `appsettings.Development.json`

### Frontend Configuration

1. Copy the example environment file:
   ```bash
   cp Frontend/src/environments/environment.example.ts Frontend/src/environments/environment.ts
   ```

2. Update the `stripePublishableKey` with your Stripe publishable key (get from https://dashboard.stripe.com/test/apikeys)

## Running the Application

### Backend
```bash
cd Backend
dotnet run
```

The API will be available at `http://localhost:5000`

### Frontend
```bash
cd Frontend
npm install
ng serve
```

The app will be available at `http://localhost:4200`

## Stripe Test Cards

For testing payments, use these test card numbers:
- Success: `4242 4242 4242 4242`
- Requires authentication: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 9995`

Use any future expiry date, any 3-digit CVC, and any ZIP code.
