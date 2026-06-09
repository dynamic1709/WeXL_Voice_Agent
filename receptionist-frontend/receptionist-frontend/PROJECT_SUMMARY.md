# Project Summary

## Complete Project Structure

```
receptionist-backend/
├── pom.xml
├── mvnw
├── mvnw.cmd
├── src/
│   ├── main/
│   │   ├── java/com/receptionist/backend/
│   │   │   ├── ReceptionistBackendApplication.java
│   │   │   ├── controller/
│   │   │   │   └── UserController.java (REST API endpoints)
│   │   │   ├── model/
│   │   │   │   └── User.java (JPA Entity)
│   │   │   ├── repository/
│   │   │   │   └── UserRepository.java (Data access)
│   │   │   └── Service/
│   │   │       └── UserService.java (Business logic)
│   │   └── resources/
│   │       └── application.properties (Database config)
│   └── test/
│       └── java/com/receptionist/backend/
│           └── ReceptionistBackendApplicationTests.java
└── target/ (Build output)

receptionist-frontend/
├── package.json
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
├── README.md
├── INTEGRATION_GUIDE.md
├── .gitignore
├── start.bat (Windows startup script)
├── src/
│   ├── main.ts (Application entry point)
│   ├── index.html
│   ├── styles.scss (Global styles)
│   ├── environments/
│   │   ├── environment.ts (Development config)
│   │   └── environment.prod.ts (Production config)
│   └── app/
│       ├── app.component.ts
│       ├── app.component.html
│       ├── app.component.scss
│       ├── app.config.ts (Dependency injection config)
│       ├── app.routes.ts (Routing config)
│       ├── models/
│       │   └── user.model.ts (User interface)
│       ├── services/
│       │   └── user.service.ts (API communication)
│       └── components/
│           └── registration/
│               ├── registration.component.ts (Component logic)
│               ├── registration.component.html (Template)
│               └── registration.component.scss (Styles)
└── dist/ (Build output)
```

## Backend Overview

### Technology Stack
- **Language**: Java
- **Framework**: Spring Boot
- **ORM**: JPA/Hibernate
- **Database**: PostgreSQL
- **Build Tool**: Maven

### API Endpoints
1. `POST /api/users/register` - Register new user
2. `GET /api/users/test` - Test API

### User Model
```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String mobileNumber;
    
    @Column(length = 500)
    private String bio;
    
    @Column(nullable = false)
    private String password;
}
```

### Business Logic (UserService)
- Validates email uniqueness before registration
- Saves user to database
- Returns appropriate success/error messages

## Frontend Overview

### Technology Stack
- **Language**: TypeScript
- **Framework**: Angular 17
- **Styling**: SCSS
- **HTTP Client**: Angular HttpClient
- **Forms**: Reactive Forms
- **Build Tool**: Angular CLI

### Key Components

#### 1. RegistrationComponent
- Handles user registration form
- Implements real-time form validation
- Manages loading states
- Displays success/error messages
- Communicates with backend via UserService

#### 2. UserService
- Encapsulates API communication
- Handles HTTP requests to backend
- Manages API URL configuration

### Form Validations
1. **First Name**: Required, min 2 characters
2. **Last Name**: Required, min 2 characters
3. **Email**: Required, valid email format
4. **Mobile Number**: Required, exactly 10 digits
5. **Bio**: Optional
6. **Password**: Required, min 6 characters
7. **Confirm Password**: Required, must match password

### Features
✓ Responsive design (mobile & desktop)
✓ Real-time form validation
✓ Password confirmation matching
✓ Loading states during submission
✓ Success/Error message display
✓ Form reset functionality
✓ Smooth animations and transitions
✓ Accessible UI with proper labels

## How They Work Together

### User Registration Flow

1. **User enters data** in the registration form
   - Angular validates form inputs in real-time
   - Shows error messages for invalid fields

2. **User clicks Register button**
   - Form is validated
   - If valid, data is prepared

3. **Frontend sends request to Backend**
   - HTTP POST to `http://localhost:8080/api/users/register`
   - Request body contains User object as JSON

4. **Backend processes request**
   - UserController receives request
   - UserService handles business logic
   - Checks if email already exists
   - Saves user to PostgreSQL database

5. **Backend sends response**
   - Success: "User registered successfully"
   - Error: "Email already registered"

6. **Frontend displays result**
   - Shows success/error message
   - Clears form on success
   - Maintains form on error

## Database Schema

### PostgreSQL Table: users
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile_number VARCHAR(20) NOT NULL,
    bio VARCHAR(500),
    password VARCHAR(255) NOT NULL
);
```

## Running the Project

### Terminal 1 - Backend
```bash
cd receptionist-backend
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### Terminal 2 - Frontend
```bash
cd receptionist-frontend
npm install          # First time only
npm start           # Runs on port 4200
```
Frontend runs on: http://localhost:4200

## Files Overview

### Key Backend Files

**UserController.java**
- Handles HTTP requests
- Routes to UserService
- Returns responses

**UserService.java**
- Contains registration logic
- Validates email uniqueness
- Saves user to database

**User.java**
- Defines user data structure
- JPA annotations for database mapping

**UserRepository.java**
- Interface for database operations
- Provides findByEmail() method

**application.properties**
- Database connection settings
- JPA configuration

### Key Frontend Files

**registration.component.ts**
- Component logic
- Form creation and validation
- API communication
- Response handling

**registration.component.html**
- Registration form template
- Input fields with error messages
- Submit and reset buttons

**user.service.ts**
- Service for API communication
- registerUser() method
- Handles HTTP requests

**app.config.ts**
- Angular configuration
- Dependency injection setup
- HTTP client provider

## Configuration

### Backend Configuration (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/users
spring.datasource.username=postgres
spring.datasource.password=meer@2004
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Frontend Configuration (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Next Steps

1. **Install Dependencies**
   - Backend: `mvn clean install`
   - Frontend: `npm install`

2. **Setup Database**
   - Create PostgreSQL database
   - Update credentials in application.properties

3. **Run Backend**
   - Navigate to receptionist-backend
   - Run `mvn spring-boot:run`

4. **Run Frontend**
   - Navigate to receptionist-frontend
   - Run `npm start`

5. **Test**
   - Open http://localhost:4200
   - Fill and submit the registration form
   - Verify data in database

## Security Notes

⚠️ **Important for Production:**
- Implement password hashing (BCrypt)
- Add authentication/JWT tokens
- Implement HTTPS
- Add CORS restrictions
- Implement rate limiting
- Validate all inputs on backend
- Add error logging
- Remove debug output

## Support & Documentation

- See [README.md](README.md) for installation and running instructions
- See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed integration information
- Check backend repository for API documentation
