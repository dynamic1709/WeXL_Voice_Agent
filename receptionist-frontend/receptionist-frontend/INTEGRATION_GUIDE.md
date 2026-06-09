# Backend and Frontend Integration Guide

## Overview
This document provides detailed instructions on how the backend and frontend are connected and how to run them together.

## Architecture

### Backend (Spring Boot - Java)
- **Port**: 8080
- **Framework**: Spring Boot
- **Database**: PostgreSQL
- **Base URL**: `http://localhost:8080`

### Frontend (Angular)
- **Port**: 4200
- **Framework**: Angular 17
- **Base URL**: `http://localhost:4200`

## API Communication Flow

### User Registration Flow

```
Frontend (Angular)
    ↓
User fills registration form
    ↓
Form validation on client-side
    ↓
Submit to API endpoint: POST /api/users/register
    ↓
Backend (Spring Boot)
    ↓
UserController receives request
    ↓
UserService processes data
    ↓
Check for duplicate email
    ↓
Save to UserRepository (Database)
    ↓
Return success/error response
    ↓
Frontend displays result
```

## Backend Architecture

### Database Schema

**Table: users**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile_number VARCHAR(20) NOT NULL,
    bio VARCHAR(500),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoint Details

#### POST /api/users/register
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "mobileNumber": "9876543210",
  "bio": "Optional bio",
  "password": "password123"
}
```

**Success Response (200):**
```json
"User registered successfully"
```

**Error Response (400):**
```json
"Email already registered"
```

#### GET /api/users/test
**Response:**
```json
"User API working"
```

## Frontend Architecture

### Component Hierarchy
```
AppComponent
└── RegistrationComponent
    ├── Registration Form
    ├── Form Validation
    ├── Success/Error Messages
    └── Submit Handler
```

### Service Layer
**UserService** handles all API communication:
- `registerUser(user: User)` - Sends registration data to backend
- `testApi()` - Tests API connectivity

### Data Flow
1. User enters data in registration form
2. Form validation occurs in real-time
3. On submit, data is validated
4. UserService sends POST request to backend
5. Response is handled and displayed to user

## Setup Instructions

### Prerequisites
- Java 11+ installed
- Maven installed
- Node.js (v18+) installed
- PostgreSQL database running

### Step 1: Setup PostgreSQL Database

1. Create database:
```sql
CREATE DATABASE users;
```

2. Update [pom.xml](../pom.xml) or application.properties with your PostgreSQL credentials

### Step 2: Configure Backend

1. Navigate to backend directory:
```bash
cd receptionist-backend
```

2. Update [src/main/resources/application.properties](../src/main/resources/application.properties):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/users
spring.datasource.username=postgres
spring.datasource.password=your_password
```

3. Build the project:
```bash
mvn clean install
```

4. Run the backend:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Step 3: Configure Frontend

1. Navigate to frontend directory:
```bash
cd receptionist-frontend
```

2. Verify API URL in [src/app/services/user.service.ts](frontend/src/app/services/user.service.ts):
```typescript
private apiUrl = 'http://localhost:8080/api/users';
```

3. Install dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm start
```

The frontend will start on `http://localhost:4200`

### Step 4: Test the Integration

1. Open browser and navigate to `http://localhost:4200`
2. Fill in the registration form
3. Submit the form
4. Check the browser console for any errors
5. Verify the data is saved in PostgreSQL database

## CORS Configuration

The backend has CORS enabled with `@CrossOrigin` annotation on the UserController, allowing requests from any origin. For production, you should restrict this to specific origins:

```java
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/users")
public class UserController {
    // ...
}
```

## Troubleshooting

### Issue: Frontend cannot connect to backend

**Solution:**
1. Verify backend is running on port 8080
2. Check browser console for CORS errors
3. Ensure firewall allows connection to port 8080
4. Verify API URL in UserService

### Issue: Database connection error in backend

**Solution:**
1. Verify PostgreSQL is running
2. Check database credentials in application.properties
3. Verify database exists
4. Check PostgreSQL port (default 5432)

### Issue: Form submission returns 400 error

**Solution:**
1. Check that all required fields are filled
2. Verify email is unique (not already registered)
3. Check password requirements (minimum 6 characters)
4. Verify mobile number is 10 digits
5. Check backend logs for detailed error message

### Issue: Frontend runs but page is blank

**Solution:**
1. Check browser console for JavaScript errors
2. Verify Angular compilation completed without errors
3. Clear browser cache and reload
4. Try in a different browser

## Development Workflow

### Adding a New Feature

1. **Backend:**
   - Create/modify model in `com/receptionist/backend/model/`
   - Create/modify service in `com/receptionist/backend/Service/`
   - Create/modify controller in `com/receptionist/backend/controller/`

2. **Frontend:**
   - Update model in `src/app/models/`
   - Update service in `src/app/services/`
   - Update component in `src/app/components/`

3. **Testing:**
   - Test API endpoint manually using Postman
   - Test frontend form submission
   - Verify data in database

## Performance Tips

1. **Database:**
   - Add indexes on frequently queried fields (email, id)
   - Implement pagination for large datasets

2. **Frontend:**
   - Implement lazy loading for components
   - Use OnPush change detection strategy
   - Optimize images and assets

3. **Backend:**
   - Add request/response logging
   - Implement caching for frequently accessed data
   - Add rate limiting for API endpoints

## Security Considerations

1. **Password Security:**
   - Implement password hashing (BCrypt)
   - Add password strength requirements
   - Implement forgot password functionality

2. **Data Validation:**
   - Validate input on both frontend and backend
   - Implement SQL injection prevention
   - Sanitize user input

3. **API Security:**
   - Implement authentication (JWT tokens)
   - Add role-based access control
   - Implement HTTPS for production
   - Add request rate limiting

## Production Deployment

### Backend Deployment
1. Build WAR/JAR file: `mvn clean package`
2. Deploy to application server (Tomcat, etc.)
3. Configure environment variables
4. Set up SSL certificates

### Frontend Deployment
1. Build for production: `npm run build`
2. Deploy to web server (Nginx, Apache, etc.)
3. Configure CORS for production domain
4. Set up CDN for assets

## References

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Angular Documentation](https://angular.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [REST API Best Practices](https://restfulapi.net/)
