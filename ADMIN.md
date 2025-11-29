# Admin Panel Documentation

## Overview
The admin panel provides role-based access control for managing users and signs in the SignBuddy application. It includes functionality for user management, sign review, and role assignment.

## User Roles
1. **User** - Regular user with basic access
2. **Verified User** - Can upload signs that are auto-approved
3. **Super User** - Can review and approve/reject signs
4. **Admin** - Full access to all admin features

## Admin Features

### User Management
- View all users in the system
- Promote/demote users to different roles
- Deactivate user accounts

### Sign Management
- Review pending signs uploaded by regular users
- Approve or reject signs
- View signs with their approval status

## Implementation Details

### Backend
- **Models**: Updated User model with `role` and `isActive` fields
- **Controllers**: Added admin routes in userController and dictionaryController
- **Middleware**: Created role-based access control middleware
- **Routes**: Added protected admin routes

### Frontend
- **Admin Layout**: Custom tab navigation for admin panel
- **Screens**: 
  - Dashboard: Overview of system statistics
  - Users: User management interface
  - Signs: Sign review interface
- **Services**: Admin service for API calls
- **Components**: AdminGuard for route protection

## Setup Instructions

1. Create an admin user in the database with `role: 'admin'`
2. Log in with admin credentials
3. You will be automatically redirected to the admin panel

## Testing

Run the test script to create sample data:
```bash
node backend/test-admin.js
```

This creates:
- Admin user (admin@test.com / admin123)
- Verified user (verified@test.com / verified123)
- Regular user (user@test.com / user123)
- Sample signs for testing

## API Endpoints

### User Management
- `GET /api/users/admin/users` - Get all users (Admin only)
- `PUT /api/users/admin/user-role` - Update user role (Admin only)
- `PUT /api/users/admin/deactivate-user` - Deactivate user (Admin only)

### Sign Management
- `GET /api/dictionary/admin/pending` - Get pending signs (Admin/Super User only)
- `PUT /api/dictionary/admin/status` - Update sign status (Admin/Super User only)

## Security
- All admin routes are protected with authentication and role-based access control
- Only users with the correct roles can access admin features
- AdminGuard component prevents unauthorized access to admin screens