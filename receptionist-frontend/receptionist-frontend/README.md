# Receptionist Frontend

A modern Angular frontend application for user registration with a clean and responsive UI.

## Project Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

### Installation

1. Navigate to the project directory:
```bash
cd receptionist-frontend
```

2. Install dependencies:
```bash
npm install
```

### Development Server

Run the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

### Build

To build for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── registration/
│   │       ├── registration.component.ts
│   │       ├── registration.component.html
│   │       └── registration.component.scss
│   ├── models/
│   │   └── user.model.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.config.ts
│   └── app.routes.ts
├── index.html
├── main.ts
└── styles.scss
```

## Features

- **User Registration Form** with validation
- **Responsive Design** that works on all devices
- **Form Validation** including:
  - Required fields
  - Email format validation
  - Mobile number validation (10 digits)
  - Password confirmation
  - Minimum length requirements
- **API Integration** with backend service
- **Success/Error Messages** for user feedback
- **Loading States** during submission
- **Modern UI** with gradient background and smooth animations

## Backend Integration

### API Endpoints

The frontend connects to the following backend API endpoints:

- **POST** `/api/users/register` - Register a new user
- **GET** `/api/users/test` - Test API connectivity

### Configuration

The backend API URL is configured in [src/app/services/user.service.ts](src/app/services/user.service.ts):

```typescript
private apiUrl = 'http://localhost:8080/api/users';
```

Update this URL if your backend is running on a different host/port.

### CORS Requirements

Make sure your backend is configured to allow CORS requests from your frontend URL. The backend should have `@CrossOrigin` annotation or proper CORS configuration.

## Form Fields

The registration form includes the following fields:

1. **First Name** (required, minimum 2 characters)
2. **Last Name** (required, minimum 2 characters)
3. **Email** (required, must be valid email format)
4. **Mobile Number** (required, exactly 10 digits)
5. **Bio** (optional)
6. **Password** (required, minimum 6 characters)
7. **Confirm Password** (required, must match password)

## User Model

```typescript
interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  bio?: string;
  password: string;
}
```

## Technologies Used

- **Angular 17** - Frontend framework
- **TypeScript** - Programming language
- **Reactive Forms** - Form handling
- **RxJS** - Reactive programming
- **SCSS** - Styling
- **HttpClient** - HTTP requests

## Running Backend & Frontend Together

1. Start the backend server (Spring Boot):
```bash
mvn spring-boot:run
```

2. In a new terminal, start the frontend:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:4200`

## Notes

- The backend should be running on `http://localhost:8080` for the default configuration
- Database must be configured and running (PostgreSQL as per backend config)
- All form validations are performed both on the client and server side

## Support

For issues or questions, please check the backend repository for API documentation and database schema details.
