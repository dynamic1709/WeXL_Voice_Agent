# System Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER BROWSER                               │
│                    localhost:4200                               │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                              │ HTTP Request/Response
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    ANGULAR FRONTEND                             │
│                  (Registration Component)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  1. User fills registration form                        │   │
│  │  2. Form validation (real-time)                         │   │
│  │  3. UserService sends POST request                      │   │
│  │  4. Displays success/error message                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Components:                                                    │
│  ├── RegistrationComponent (Form UI & Logic)                   │
│  ├── UserService (API Communication)                           │
│  └── User Model (Data Structure)                               │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                              │ HTTP POST/GET
                              │ JSON Data
                              │
         ┌────────────────────┴────────────────────┐
         │                                         │
         ↓                                         ↓
    Port: 4200                                 Port: 8080
                                                   
┌─────────────────────────────────────────────────────────────────┐
│                   SPRING BOOT BACKEND                           │
│                  (Java REST API)                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  POST /api/users/register                              │   │
│  │  1. UserController receives request                    │   │
│  │  2. UserService validates email uniqueness            │   │
│  │  3. UserRepository saves to database                  │   │
│  │  4. Returns success/error message                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Layers:                                                        │
│  ├── Controller (HTTP endpoints)                               │
│  ├── Service (Business logic)                                  │
│  ├── Repository (Database access)                              │
│  └── Model (User entity)                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↑
                              │ SQL Query/Result
                              │
┌─────────────────────────────────────────────────────────────────┐
│              POSTGRESQL DATABASE                                │
│           (localhost:5432)                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Table: users                                           │   │
│  │  Columns:                                               │   │
│  │  ├── id (BIGINT, PK)                                   │   │
│  │  ├── first_name (VARCHAR)                              │   │
│  │  ├── last_name (VARCHAR)                               │   │
│  │  ├── email (VARCHAR, UNIQUE)                           │   │
│  │  ├── mobile_number (VARCHAR)                           │   │
│  │  ├── bio (VARCHAR)                                     │   │
│  │  └── password (VARCHAR)                                │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Registration Flow Sequence

```
┌────────────┐         ┌──────────────┐         ┌─────────┐
│   User     │         │   Angular    │         │ Spring  │
│  Browser   │         │  Frontend    │         │ Backend │
└────────────┘         └──────────────┘         └─────────┘
     │                        │                      │
     │  1. Fill Form          │                      │
     │──────────────────────→ │                      │
     │                        │                      │
     │  2. Click Register     │                      │
     │──────────────────────→ │                      │
     │                        │ 3. Validate Form    │
     │                        │  (Client-side)      │
     │                        │                      │
     │                        │ 4. Prepare JSON     │
     │                        │                      │
     │                        │ 5. POST to /api/    │
     │                        │    users/register   │
     │                        │─────────────────→   │
     │                        │                      │
     │                        │                      │
     │                        │    6. Receive Request
     │                        │                      │
     │                        │    7. Check Email   │
     │                        │       Uniqueness    │
     │                        │                      │
     │                        │    8. Save to DB    │
     │                        │                      │
     │                        │ 9. Return Success   │
     │                        │←─────────────────   │
     │                        │                      │
     │  10. Show Success      │                      │
     │  Message & Clear Form  │                      │
     │←────────────────────── │                      │
     │                        │                      │
     ✓ Registration Complete  │                      │
```

## File Structure and Communication

```
receptionist-frontend/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── registration/
│   │   │       ├── registration.component.ts ─────┐
│   │   │       │  ┌─────────────────────────────┐ │
│   │   │       │  │ • Form logic               │ │
│   │   │       │  │ • Validation              │ │
│   │   │       │  │ • Call UserService        │ │
│   │   │       │  └─────────────────────────────┘ │
│   │   │       ├── registration.component.html    │
│   │   │       └── registration.component.scss    │
│   │   │                                           │
│   │   ├── services/                              │
│   │   │   └── user.service.ts ←────────────────────┤
│   │   │       ┌──────────────────────────────┐   │
│   │   │       │ • API communication          │   │
│   │   │       │ • HTTP requests              │   │
│   │   │       │ • Base URL config            │   │
│   │   │       │ • registerUser()             │   │
│   │   │       └──────────────────────────────┘   │
│   │   │                                           │
│   │   ├── models/                                │
│   │   │   └── user.model.ts                      │
│   │   │       (User interface definition)        │
│   │   │                                           │
│   │   ├── app.config.ts                          │
│   │   │   (DI & HTTP client setup)               │
│   │   │                                           │
│   │   └── app.routes.ts                          │
│   │       (Routing configuration)                │
│   │                                               │
│   └── environments/                              │
│       ├── environment.ts (Dev config)           │
│       └── environment.prod.ts (Prod config)     │
│                                                   │
└── package.json                                   │
                                                   │
                              ↓ HTTP POST
                                                   │
receptionist-backend/                              │
│                                                   │
├── src/main/java/com/receptionist/backend/        │
│   ├── controller/                                │
│   │   └── UserController.java ←──────────────────┘
│   │       ┌──────────────────────┐
│   │       │ @RestController      │
│   │       │ • register endpoint  │
│   │       │ • test endpoint      │
│   │       └──────────────────────┘
│   │
│   ├── service/
│   │   └── UserService.java
│   │       ┌────────────────────────────┐
│   │       │ • registerUser()           │
│   │       │ • Email validation         │
│   │       │ • Business logic           │
│   │       └────────────────────────────┘
│   │
│   ├── repository/
│   │   └── UserRepository.java
│   │       ┌────────────────────────┐
│   │       │ • Database operations  │
│   │       │ • findByEmail()        │
│   │       └────────────────────────┘
│   │
│   └── model/
│       └── User.java
│           ┌──────────────────────┐
│           │ @Entity              │
│           │ • User properties    │
│           │ • JPA annotations    │
│           └──────────────────────┘
│
├── src/main/resources/
│   └── application.properties
│       (Database configuration)
│
└── pom.xml
```

## Data Flow Diagram

```
                    ┌─ First Name
                    ├─ Last Name
User Input Data ────┼─ Email
                    ├─ Mobile Number
                    ├─ Bio
                    └─ Password
                          │
                          ↓
               ┌───────────────────────┐
               │  Client Validation    │
               │  (Angular)            │
               │                       │
               │ • Required fields     │
               │ • Email format        │
               │ • Password match      │
               │ • Min/Max length      │
               └───────────────────────┘
                          │
                   ✓ All valid
                          │
                          ↓
            ┌──────────────────────────┐
            │  JSON Serialization      │
            │                          │
            │  {                       │
            │    "firstName": "...",   │
            │    "lastName": "...",    │
            │    "email": "...",       │
            │    "mobileNumber": "...",│
            │    "bio": "...",         │
            │    "password": "..."     │
            │  }                       │
            └──────────────────────────┘
                          │
                          ↓
         ┌────────────────────────────┐
         │  HTTP POST Request         │
         │  to Backend                │
         │  /api/users/register       │
         └────────────────────────────┘
                          │
                          ↓
           ┌──────────────────────────┐
           │  Backend Processing      │
           │                          │
           │ • Deserialize JSON       │
           │ • Validate data          │
           │ • Check email uniqueness │
           │ • Hash password          │
           │ • Save to database       │
           └──────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
           Success           Error
                │                   │
                ↓                   ↓
        ┌──────────────┐   ┌──────────────────┐
        │ Save to DB   │   │ Return error     │
        │ Return: OK   │   │ "Email already   │
        │              │   │  registered"     │
        └──────────────┘   └──────────────────┘
                │                   │
                └─────────┬─────────┘
                          │
                          ↓
              ┌────────────────────────┐
              │  Response to Frontend  │
              │                        │
              │  • Status code         │
              │  • Message             │
              └────────────────────────┘
                          │
                          ↓
            ┌──────────────────────────┐
            │  Display to User         │
            │                          │
            │  ✓ Success message       │
            │    OR                    │
            │  ✗ Error message         │
            │                          │
            │  • Clear form (success)  │
            │  • Keep data (error)     │
            └──────────────────────────┘
```

## Technology Communication Stack

```
LAYER 1: USER INTERFACE (Browser)
  ↑
  │ Click/Input
  ↓
  
LAYER 2: ANGULAR FRAMEWORK
  ├─ RegistrationComponent (TypeScript)
  ├─ Form Validation
  ├─ HTTP Client
  └─ RxJS Observables
  ↑
  │ POST /api/users/register (JSON)
  ↓
  
LAYER 3: NETWORK (HTTP/HTTPS)
  ├─ Protocol: HTTP/1.1
  ├─ Method: POST
  ├─ Port: 4200 → 8080
  └─ Format: JSON
  ↑
  │ Response (JSON)
  ↓
  
LAYER 4: SPRING BOOT BACKEND
  ├─ RestController (@RestController)
  ├─ RequestMapping (@PostMapping)
  ├─ Dependency Injection
  └─ Exception Handling
  ↑
  │ SQL Query
  ↓
  
LAYER 5: JPA/HIBERNATE ORM
  ├─ Object-Relational Mapping
  ├─ Entity Management
  └─ Transaction Management
  ↑
  │ SQL Commands
  ↓
  
LAYER 6: DATABASE (PostgreSQL)
  ├─ Connection Pool
  ├─ SQL Execution
  ├─ Data Persistence
  └─ Constraints
  ↑
  │ Commit/Rollback
  ↓
  
LAYER 5: JPA/HIBERNATE ORM
  ↑
  │ Result Set
  ↓
  
LAYER 4: SPRING BOOT BACKEND
  ├─ Response Serialization
  └─ Return to Client
  ↑
  │ Response (JSON)
  ↓
  
LAYER 3: NETWORK (HTTP/HTTPS)
  ↑
  │ JSON Response
  ↓
  
LAYER 2: ANGULAR FRAMEWORK
  ├─ RxJS Subscription
  ├─ Response Handling
  ├─ Error Handling
  └─ UI Update
  ↑
  │ Display Result
  ↓
  
LAYER 1: USER INTERFACE (Browser)
  └─ Success/Error Message
```

## Error Handling Flow

```
User Submits Form
      ↓
Client Validation
      ├─ Invalid ──→ Show error message → No request sent
      │
      └─ Valid
            ↓
        HTTP Request
            ↓
        Backend Processing
            ├─ Email exists ──→ Return error
            │                        ↓
            │                  Display: "Email already registered"
            │
            ├─ Invalid data ──→ Return error
            │                        ↓
            │                  Display error message
            │
            └─ Success
                    ↓
              Save to database
                    ↓
              Return success
                    ↓
              Clear form
                    ↓
              Display: "User registered successfully"
                    ↓
              Auto-clear message after 5 seconds
```

This comprehensive diagram shows how your Angular frontend seamlessly integrates with your Spring Boot backend to provide a complete user registration system!
