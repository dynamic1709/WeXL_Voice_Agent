# Quick Reference Guide

## What Was Created

### Backend Analysis ✓
Your existing Spring Boot backend has:
- **User Model** with fields: firstName, lastName, email, mobileNumber, bio, password
- **UserController** with `/api/users/register` endpoint
- **UserService** with email validation logic
- **PostgreSQL** database configuration

### Angular Frontend Created ✓
A complete registration page with:
- Modern, responsive UI
- Form validation (client-side)
- Backend integration
- Error handling
- Success messages

## How to Use

### Option 1: Quick Start (Recommended)
```bash
# Open PowerShell/Terminal in receptionist-frontend folder
# Windows users can double-click:
start.bat

# Or manually:
npm install
npm start
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend (in receptionist-backend folder)
mvn spring-boot:run

# Terminal 2 - Frontend (in receptionist-frontend folder)
npm install
npm start
```

## What Happens When You Submit the Form

1. ✓ Form validates all required fields on client-side
2. ✓ Password fields must match
3. ✓ Sends JSON data to backend: POST `/api/users/register`
4. ✓ Backend checks if email already exists
5. ✓ If unique, saves user to PostgreSQL database
6. ✓ Returns success/error message to frontend
7. ✓ Frontend displays result to user

## File Locations

### Backend (Your Existing Code)
```
receptionist-backend/
├── src/main/java/com/receptionist/backend/
│   ├── UserController.java
│   ├── UserService.java
│   └── model/User.java
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

### Frontend (Just Created)
```
receptionist-frontend/
├── src/app/
│   ├── components/registration/  (Registration form)
│   ├── services/user.service.ts  (API calls)
│   ├── models/user.model.ts      (Data structure)
│   └── app.component.ts          (Main component)
├── package.json
├── README.md
├── INTEGRATION_GUIDE.md
└── PROJECT_SUMMARY.md
```

## Key Configuration Points

### Frontend API URL
File: `src/app/services/user.service.ts`
- Currently set to: `http://localhost:8080/api`
- Update if backend runs on different port

### Backend Database
File: `application.properties` (backend)
```
Database: users
Username: postgres
Password: meer@2004
Port: 5432
```

## Testing Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 4200
- [ ] PostgreSQL database created and running
- [ ] Open http://localhost:4200 in browser
- [ ] Fill in all required fields
- [ ] Submit form
- [ ] Check for success/error message
- [ ] Verify data in database

## Troubleshooting

**Form can't connect to backend?**
- Check backend is running: `http://localhost:8080/api/users/test`
- Verify ports in configuration

**"Email already registered" error?**
- Use a different email
- Clear database or check existing records

**Form styling looks broken?**
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page (F5)

**Port 4200 or 8080 already in use?**
- Change port in angular.json or backend config
- Or close other applications using those ports

## Form Fields Description

| Field | Validation | Required |
|-------|-----------|----------|
| First Name | Min 2 characters | Yes |
| Last Name | Min 2 characters | Yes |
| Email | Valid email format | Yes |
| Mobile | Exactly 10 digits | Yes |
| Bio | Any text | No |
| Password | Min 6 characters | Yes |
| Confirm Password | Must match password | Yes |

## Next Steps

1. **Immediate**
   - Install dependencies: `npm install` (in frontend folder)
   - Start both backend and frontend
   - Test the registration page

2. **Enhancements**
   - Add login page
   - Add user profile page
   - Add password reset functionality
   - Add email verification
   - Add role-based access control

3. **Production**
   - Implement password hashing
   - Add authentication (JWT)
   - Add HTTPS
   - Deploy to server

## File Documentation

- **README.md** - Installation & running instructions
- **INTEGRATION_GUIDE.md** - Detailed integration architecture
- **PROJECT_SUMMARY.md** - Complete project overview
- **start.bat** - Quick start script for Windows

## Important URLs

- Frontend: http://localhost:4200
- Backend: http://localhost:8080
- API Base: http://localhost:8080/api
- Register Endpoint: http://localhost:8080/api/users/register

## Technologies Used

### Backend
- Java 11+
- Spring Boot
- PostgreSQL
- JPA/Hibernate

### Frontend
- Angular 17
- TypeScript
- SCSS
- RxJS

## Support

For detailed information, refer to:
1. [README.md](README.md) - Getting started
2. [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Architecture details
3. [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete overview

Enjoy your registration page! 🎉
