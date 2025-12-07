# HotelAdmin - Hotel Management Panel

A modern, responsive hotel management application built with Angular 18, TailwindCSS, and PrimeNG.

## Features

- **Dashboard**: Overview of hotel operations and statistics
- **Rooms Management**: View and manage all hotel rooms with availability status
- **Reservations**: Track and manage hotel reservations and bookings
- **Guests**: Manage guest information and history
- **Companies**: Manage corporate clients and partners
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modal System**: Reusable modal component for forms and details views
- **Accessibility**: Keyboard navigation, focus management, and ARIA labels

## Tech Stack

- **Angular 18**: Latest version of Angular framework
- **TailwindCSS**: Utility-first CSS framework
- **PrimeNG 18**: UI component library
- **PrimeIcons**: Icon library
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Navigate to the project directory:
```bash
cd hotel-admin
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the development server:

```bash
npm start
```

The application will be available at `http://localhost:4200`

## Build

Build the project for production:

```bash
npm build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
hotel-admin/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── modal/          # Reusable modal component
│   │   │   └── sidebar/        # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── rooms/          # Rooms management page
│   │   │   ├── reservations/   # Reservations page
│   │   │   ├── guests/         # Guests management page
│   │   │   └── companies/      # Companies management page
│   │   ├── services/           # Mock data services
│   │   ├── app.component.ts    # Root component
│   │   ├── app.routes.ts       # Route configuration
│   │   └── app.config.ts       # App configuration
│   ├── styles.css              # Global styles
│   └── index.html
├── angular.json
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Pages

### Dashboard
Overview page showing key statistics and metrics about the hotel operations.

### Rooms
Grid view of all hotel rooms with their status (available, occupied, maintenance), type, capacity, and pricing. Click "View Details" to see more information.

### Reservations
Table view of all hotel reservations with guest information, room assignments, check-in/check-out dates, and status.

### Guests
Card-based view of all guests with their contact information, visit history, current room assignments, and status (checked-in, checked-out, upcoming).

### Companies
Table view of corporate clients and partners with company details, contact information, booking statistics, and status.

## Components

### Sidebar
Responsive navigation sidebar that appears on all pages. Features:
- HotelAdmin branding with logo
- Main menu navigation items
- Active route highlighting
- Mobile-responsive (collapses to icon-only on small screens)

### Modal
Reusable modal component used across all pages for:
- Adding new records
- Viewing details
- Editing existing records

Features:
- Keyboard accessible (ESC to close, Tab to navigate)
- Focus trapping
- Backdrop click to close
- Responsive sizing (sm, md, lg)

## Services

Mock data services are provided for:
- `CompanyService`: Manages company data
- `RoomService`: Manages room data
- `GuestService`: Manages guest data

These services return Observables and can be easily replaced with real API calls.

## Styling

The project uses:
- **TailwindCSS** for utility-first styling
- **PrimeNG themes** for component styling
- **Custom CSS** for precise design matching

Colors:
- Primary: Teal (#14b8a6)
- Sidebar: Dark blue-gray (#1e293b, #0f172a)
- Background: Light gray (#f8fafc)

## Accessibility

The application includes:
- Keyboard navigation support
- Focus management in modals
- ARIA labels on interactive elements
- Semantic HTML structure
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for demonstration purposes.

## Development Notes

- All routes use lazy loading for optimal performance
- Components are standalone (no NgModules)
- TypeScript strict mode enabled
- Follows Angular best practices and style guide
