# HotelAdmin - Hotel Management Panel

A modern, responsive hotel management application built with Angular 18, TypeScript, and a custom design system.

## Features

### Core Management Pages
- **Dashboard**: Overview of hotel operations and statistics
- **Calendar**: Hotel-style calendar view for visualizing room reservations across dates
- **Reservations**: Full CRUD operations for managing hotel reservations and bookings
- **Rooms**: Complete room management with CRUD functionality
- **Room Types**: Manage room type configurations
- **Guests**: Manage guest information and history
- **Companies**: Manage corporate clients and partners
- **Hotels**: Hotel property management
- **Amenities**: Hotel amenities management
- **Users**: User management system
- **Settings**: Application settings

### Key Features
- **Full CRUD Operations**: Create, Read, Update, Delete functionality across all management pages
- **Advanced Filtering**: Search and filter capabilities with pagination
- **Calendar View**: Interactive hotel-style calendar showing reservations by room and date range
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modal System**: Reusable modal component for forms and details views
- **Authentication**: Login system with route guards
- **Accessibility**: Keyboard navigation, focus management, and ARIA labels

## Tech Stack

- **Angular 18**: Latest version of Angular framework with standalone components
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming for async operations
- **Custom Design System**: Clean, modern UI with consistent styling
- **TailwindCSS**: Utility-first CSS framework (configured)
- **HTTP Client**: Angular HttpClient for API communication

## Architecture

### Service Layer
- **AbstractService**: Base service class extending common CRUD operations
- **Microservice Architecture**: Support for multiple microservices
- **Filter Service**: Advanced filtering and query capabilities
- **Pagination**: Built-in pagination support

### Models
- `ReservationModel`: Reservation data structure with dates, status, user, and room
- `RoomModel`: Room information with hotel and type associations
- `CalendarModel`: Calendar structure grouping rooms by type
- `HotelModel`, `RoomTypeModel`, `CompanyModel`, and more

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn

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
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
hotel-admin/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── icons/          # Custom icon component
│   │   │   ├── modal/          # Reusable modal component
│   │   │   └── sidebar/        # Navigation sidebar
│   │   ├── pages/
│   │   │   ├── dashboard/      # Dashboard page
│   │   │   ├── calendar/        # Calendar view page
│   │   │   ├── reservations/    # Reservations CRUD page
│   │   │   ├── rooms/           # Rooms CRUD page
│   │   │   ├── room-types/      # Room types management
│   │   │   ├── guests/          # Guests management page
│   │   │   ├── companies/       # Companies management page
│   │   │   ├── hotels/          # Hotels management
│   │   │   ├── amenities/       # Amenities management
│   │   │   ├── users/           # User management
│   │   │   ├── login/           # Login page
│   │   │   ├── profile/         # User profile
│   │   │   └── settings/        # Settings page
│   │   ├── services/
│   │   │   ├── base/            # Base services and utilities
│   │   │   │   ├── models/      # Filter models, query criteria
│   │   │   │   └── services/    # Abstract service, filter service
│   │   │   ├── model/           # Data models (interfaces)
│   │   │   ├── reservations.service.ts    # Reservations API service
│   │   │   ├── room.service.ts            # Rooms API service
│   │   │   ├── room-type.service.ts       # Room types API service
│   │   │   ├── hotel.service.ts           # Hotels API service
│   │   │   ├── auth.service.ts            # Authentication service
│   │   │   └── ...                        # Other services
│   │   ├── guards/
│   │   │   └── auth.guard.ts    # Route authentication guard
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts  # HTTP interceptor for auth
│   │   ├── app.component.ts      # Root component
│   │   ├── app.routes.ts         # Route configuration
│   │   └── app.config.ts         # App configuration
│   ├── styles.css                # Global styles
│   └── index.html
├── angular.json
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Pages

### Dashboard
Overview page showing key statistics and metrics about hotel operations.

### Calendar
Hotel-style calendar view displaying:
- **Room Types & Rooms**: Hierarchical display of room types with rooms listed underneath
- **Date Grid**: Monthly calendar grid showing reservations across dates
- **Reservation Blocks**: Color-coded reservation blocks showing guest name and booking ID
- **Month Navigation**: Previous/next month navigation with month/year selector
- **Date Range Display**: Reservations span multiple days correctly

### Reservations
Full CRUD page for managing reservations:
- **Table View**: List of all reservations with guest, room, dates, price, and status
- **Filters**: Search by guest name, filter by status
- **Pagination**: Navigate through reservation pages
- **Add/Edit/View**: Modal forms for creating and editing reservations
- **Delete**: Confirmation modal for deleting reservations
- **Status Management**: Support for NEW, ACTIVE, NOT_ACTIVE statuses

### Rooms
Complete room management:
- **Table View**: List of all rooms with number, hotel, and type
- **Filters**: Search by room number, filter by hotel
- **Pagination**: Navigate through room pages
- **CRUD Operations**: Create, read, update, delete rooms
- **Room Assignment**: Assign rooms to hotels and room types

### Room Types
Manage room type configurations including:
- Room type name, bed count, max occupancy
- Smoking room designation

### Guests
Card-based view of all guests with contact information, visit history, and status.

### Companies
Table view of corporate clients with company details and booking statistics.

### Hotels
Hotel property management with full CRUD operations.

### Amenities
Manage hotel amenities and services.

### Users
User management system for admin users.

## Components

### Sidebar
Responsive navigation sidebar featuring:
- HotelAdmin branding with logo
- Main menu navigation items
- Collapsible sections (User Management, Hotel Management)
- Active route highlighting
- User profile dropdown
- Mobile-responsive (collapses to icon-only on small screens)

### Modal
Reusable modal component used across all pages for:
- Adding new records
- Viewing details
- Editing existing records
- Delete confirmations

Features:
- Keyboard accessible (ESC to close, Tab to navigate)
- Focus trapping
- Backdrop click to close
- Responsive sizing (sm, md, lg)
- Smooth animations

### Icon Component
Custom SVG icon component supporting:
- Multiple icon types (dashboard, calendar, users, bed, etc.)
- Customizable size and color
- Consistent icon styling

## Services

### API Services
All services extend `AbstractService` providing:
- `getAll()`: Fetch all records with optional query parameters
- `getById()`: Fetch single record by ID
- `create()`: Create new record
- `update()`: Update existing record
- `delete()`: Delete record
- `getByQuery()`: Query with filters
- `getByQueryPagination()`: Paginated queries with filters

### Available Services
- `ReservationsService`: Manages reservations (endpoint: `api/reservations`)
- `RoomService`: Manages rooms (endpoint: `api/rooms`)
- `RoomTypeService`: Manages room types (endpoint: `api/room-types`)
- `HotelService`: Manages hotels
- `CompanyService`: Manages companies
- `GuestService`: Manages guests
- `UserService`: Manages users
- `AuthService`: Handles authentication
- And more...

## API Integration

The application is designed to work with a microservice architecture:
- **Base URL**: Configured via `MicroserviceConfigService`
- **Microservice**: `hotelms` (hotel management service)
- **Endpoints**: RESTful API endpoints following standard conventions
- **Filtering**: Advanced filtering using `FilterModel` and `QueryCriteria`
- **Pagination**: Server-side pagination with `X-Total-Count` header

## Styling

The project uses:
- **Custom CSS**: Clean, modern design system
- **TailwindCSS**: Utility-first CSS framework (configured)
- **Consistent Color Palette**:
  - Primary: Teal (#14b8a6)
  - Sidebar: Dark blue-gray gradient (#1e293b, #0f172a)
  - Background: Light gray (#f8fafc)
  - Text: Dark gray (#111827) and medium gray (#6b7280)

### Design Principles
- Clean, modern interface
- Consistent spacing and typography
- Smooth transitions and hover effects
- Responsive grid layouts
- Accessible color contrasts

## Authentication

- **Login Page**: User authentication
- **Auth Guard**: Protects routes requiring authentication
- **Auth Interceptor**: Adds authentication tokens to HTTP requests
- **Current User Service**: Manages logged-in user information

## Filtering & Pagination

All list pages support:
- **Text Search**: Search across relevant fields
- **Dropdown Filters**: Filter by status, hotel, room, etc.
- **Pagination**: Navigate through pages
- **Sorting**: Sort by various fields
- **Query Criteria**: Advanced filtering with `FilterModel` and `FieldType`

## Accessibility

The application includes:
- Keyboard navigation support
- Focus management in modals
- ARIA labels on interactive elements
- Semantic HTML structure
- Screen reader friendly
- Proper heading hierarchy

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Notes

- All routes use lazy loading for optimal performance
- Components are standalone (no NgModules)
- TypeScript strict mode enabled
- Follows Angular best practices and style guide
- Services use RxJS Observables for async operations
- Error handling with user-friendly messages
- Date handling with proper timezone considerations

## License

This project is created for demonstration purposes.

## Recent Updates

- ✅ Added Calendar page with hotel-style calendar UI
- ✅ Implemented full CRUD for Reservations page
- ✅ Created ReservationsService with API integration
- ✅ Added month/year selector to Calendar page
- ✅ Enhanced filtering capabilities across all pages
- ✅ Improved date handling and validation
- ✅ Added status management for reservations
