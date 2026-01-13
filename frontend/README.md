# Medimate Frontend Documentation

## Overview

A React.js single-page application (SPA) built with Vite that provides an intuitive interface for managing medications and receiving reminders. Uses Tailwind CSS for responsive design and Axios for API communication.

## Tech Stack

- **Framework**: React 18 with Hooks
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Port**: 3000 (default)

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Login.jsx            # Login form
│   │   ├── Register.jsx         # Registration form
│   │   ├── Dashboard.jsx        # Main dashboard
│   │   ├── AddMedication.jsx    # Create medication
│   │   ├── MedicationList.jsx   # View all medications
│   │   └── EditMedication.jsx   # Update medication
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation header
│   │   ├── Alert.jsx            # Alert messages
│   │   ├── Button.jsx           # Reusable button
│   │   ├── Loader.jsx           # Loading spinner
│   │   └── ProtectedRoute.jsx   # Route protection
│   ├── services/
│   │   ├── apiClient.js         # Axios instance with interceptors
│   │   ├── apiService.js        # API call functions
│   │   └── notificationService.js   # Notification utilities
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication state
│   ├── hooks/
│   │   └── (custom hooks can be added here)
│   ├── styles/
│   │   └── index.css            # Global Tailwind styles
│   ├── App.jsx                  # Main app with routing
│   └── main.jsx                 # React entry point
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Installation & Running

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000/api

# Start development server (opens at http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The `VITE_` prefix is required for Vite to expose variables to frontend.

## Routing Structure

```
/                   → Home (public)
/login              → Login (public)
/register           → Register (public)
/dashboard          → Dashboard (protected)
/medications        → Medication List (protected)
/add-medication     → Add Medication (protected)
/edit-medication/:id → Edit Medication (protected)
```

## Context API - Authentication

### AuthContext

Manages global authentication state:

```javascript
{
  user,           // Current user object
  token,          // JWT token
  loading,        // Initial load state
  error,          // Error message
  isAuthenticated, // Boolean
  register,       // Function
  login,          // Function
  logout          // Function
}
```

Usage in components:

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user.name}!</p>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

## API Service

### apiClient.js

Axios instance with automatic token injection and error handling:

```javascript
// Automatically adds token to requests
Authorization: Bearer <token>

// Auto logout on 401 (token expired)
```

### apiService.js

Exported API functions:

```javascript
// Auth
authAPI.register(data)
authAPI.login(data)
authAPI.getMe()

// Medications
medicationAPI.getAllMedications()
medicationAPI.getTodayMedications()
medicationAPI.getUpcomingMedications()
medicationAPI.createMedication(data)
medicationAPI.updateMedication(id, data)
medicationAPI.deleteMedication(id)
```

## Components

### Navbar
Navigation header with links and logout button.

### Alert
Dismissible alert messages (success, error, info, warning):

```javascript
<Alert type="success" message="Added!" duration={5000} />
```

### Button
Reusable button with variants and loading state:

```javascript
<Button variant="primary" size="lg" loading={isLoading}>
  Submit
</Button>
```

Variants: `primary`, `secondary`, `danger`, `success`
Sizes: `sm`, `md`, `lg`, `full`

### Loader
Loading spinner:

```javascript
<Loader text="Loading medications..." />
```

### ProtectedRoute
Wraps routes that require authentication:

```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## Pages

### Home
Landing page with feature cards and call-to-action buttons.

### Login & Register
Authentication forms with validation and error handling.

### Dashboard
Main dashboard showing:
- Welcome message with user name
- Statistics cards (today's, total, active medications)
- Today's medications grid
- Quick action buttons

### AddMedication & EditMedication
Forms for creating/updating medications with fields:
- Medicine name
- Dosage
- Frequency (dropdown)
- Time (24-hour format)
- Start/End dates
- Optional notes

### MedicationList
All medications with:
- Filter buttons (all, active, inactive)
- Display of all medication details
- Edit button
- Delete button
- Activate/Deactivate toggle

## Notifications

Request permission on app start:

```javascript
useEffect(() => {
  requestNotificationPermission();
}, []);
```

Notifications trigger when:
1. Time matches medication time
2. Medication is active
3. Current date is within start/end dates

Example notification:
```
Title: 💊 Time for Aspirin
Body: 500mg - Once Daily
```

## Form Validation

All forms include:
- Required field validation
- Date format validation
- Email validation
- Password strength validation
- Confirm password matching

Error messages displayed in alerts.

## Responsive Design

Breakpoints:
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3+ columns)

Example:
```javascript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

## State Management

Local component state for forms using `useState`:

```javascript
const [formData, setFormData] = useState({
  medicineName: '',
  dosage: '',
  // ...
});
```

Global state (auth) using Context API.

## Error Handling

Errors displayed to users as alerts:

```javascript
try {
  await medicationAPI.createMedication(data);
} catch (error) {
  const message = error.response?.data?.message || 'Failed';
  setAlert({ type: 'error', message });
}
```

## Styling

Tailwind CSS utility classes:

```javascript
<div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
  Content
</div>
```

Global styles in `src/styles/index.css`:
- CSS resets
- Scrollbar styling
- Font configuration

## Building & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

Creates optimized build in `dist/` folder.

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Push to GitHub
2. Connect repo to Netlify
3. Set `VITE_API_BASE_URL` in environment
4. Deploy

## Environment Variables for Deployment

When deploying, set these environment variables:

```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

## Performance Optimizations

- Lazy loading pages with React.lazy() (can be added)
- Component memoization with React.memo() (can be added)
- Efficient re-renders with proper dependency arrays
- CSS compression with Tailwind

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 11+, Chrome Android

## Troubleshooting

### API not responding
- Check backend is running on port 5000
- Verify `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

### Notifications not working
- Grant browser notification permission
- Check browser supports notifications
- Ensure time format is correct (HH:MM)

### Login/Register errors
- Check email format
- Password must be 6+ characters
- Email must be unique for registration

### Page not loading
- Check React Router path matches
- Ensure ProtectedRoute wraps protected pages
- Check AuthProvider wraps entire app

---

For more info, see main README.md
