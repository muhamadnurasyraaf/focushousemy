# FocusHouse - Photography Studio Booking System

A fullstack Next.js application for managing photography session bookings, inspired by [sewacamerajb.com](https://sewacamerajb.com). Photographers can manage their photography packages and clients can book sessions for graduations, family portraits, and special events with email notifications and calendar scheduling.

## Features

### Photography Session Booking Module (Completed)

- **Client Features:**
  - Browse available photography packages
  - View package details (price, session type, duration, location)
  - Book photography sessions with date/time selection
  - Automatic price calculation based on session duration
  - Email notifications for session confirmation/cancellation

- **Photographer Admin Features:**
  - Dashboard with session statistics
  - Photography package management (Create, Read, Update, Delete)
  - Session booking management with confirmation/cancellation
  - Calendar view showing all confirmed sessions
  - Email notifications (confirmation/cancellation with optional reason)

### Future Modules (Planned)
- Accessory/Camera Rental
- Repair Service

## Design

Modern minimalist black and white theme inspired by [veltontech.com](https://www.veltontech.com):
- Clean, high-contrast design with black background and white text
- Smooth animations and transitions
- Hero section with professional studio photography background
- Glass-morphism effects with backdrop blur
- Responsive grid layouts optimized for all devices

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma 7
- **Authentication:** NextAuth.js
- **Email:** Nodemailer (SMTP via Brevo)
- **Calendar:** React Big Calendar

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- PostgreSQL database (Neon recommended)
- SMTP credentials (Brevo or similar)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd focushouse
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
DATABASE_URL='your-postgresql-connection-string'
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_LOGIN=your-smtp-login
SMTP_PASSWORD=your-smtp-password
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database with admin user:
```bash
pnpm seed
```

This creates an admin account:
- **Email:** admin@focushouse.com
- **Password:** admin123

6. Start the development server:
```bash
pnpm dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
focushouse/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── bookings/     # Booking CRUD + status updates
│   │   └── studios/      # Studio CRUD
│   ├── admin/            # Admin dashboard pages
│   │   ├── bookings/     # Booking management
│   │   ├── calendar/     # Calendar view
│   │   └── studios/      # Studio management
│   ├── studios/          # Public booking pages
│   └── page.tsx          # Home page (studio listing)
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── email.ts          # Email utilities
│   └── prisma.ts         # Prisma client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
└── types/
    └── next-auth.d.ts    # NextAuth TypeScript types
```

## Database Schema

### Models

- **User** - Admin and customer accounts
- **Studio** - Studio spaces available for booking
- **Booking** - Booking records with status tracking

### Booking Statuses

- `PENDING` - Awaiting admin approval
- `APPROVED` - Approved by admin (appears in calendar)
- `CANCELLED` - Cancelled by admin
- `COMPLETED` - Past booking

## API Endpoints

### Studios

- `GET /api/studios` - List all active studios
- `POST /api/studios` - Create studio (admin)
- `GET /api/studios/[id]` - Get studio details
- `PUT /api/studios/[id]` - Update studio (admin)
- `DELETE /api/studios/[id]` - Delete studio (admin)

### Bookings

- `GET /api/bookings` - List bookings (with filters)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Get booking details
- `DELETE /api/bookings/[id]` - Delete booking
- `PUT /api/bookings/[id]/status` - Update booking status (admin)

### Authentication

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

## Usage

### For Clients

1. Browse photography packages on the home page
2. Click "Book Session" on a package
3. Fill in your details and select preferred date/time
4. Submit session request
5. Wait for photographer confirmation
6. Receive email notification when confirmed/cancelled

### For Photographers (Admin)

1. Visit `/auth/signin` to access the photographer portal
2. Sign in with credentials: `admin@focushouse.com` / `admin123`
3. **Manage Packages:** Add, edit, or delete photography packages
4. **Manage Sessions:** View all session requests, filter by status
5. **Confirm/Cancel:** Update session status with optional reason
6. **Calendar View:** See all confirmed sessions in calendar format

## Email Notifications

The system automatically sends styled HTML emails for:

- **Session Confirmed:** Sent when photographer confirms a session, includes preparation tips
- **Session Cancelled:** Sent when photographer cancels, includes reason and rebooking options

Email templates are in `lib/email.ts` and can be customized.

## Development

### Running Migrations

```bash
npx prisma migrate dev --name <migration-name>
```

### Viewing Database

```bash
npx prisma studio
```

### Type Generation

Prisma types are auto-generated. After schema changes:
```bash
npx prisma generate
```

## Deployment

### Environment Variables for Production

Make sure to update:
- `NEXTAUTH_SECRET` - Use a strong random string
- `NEXTAUTH_URL` - Your production URL
- `DATABASE_URL` - Production database connection

### Build

```bash
pnpm build
pnpm start
```

## Security Notes

- Change default admin password immediately
- Update `NEXTAUTH_SECRET` in production
- Implement proper authentication middleware for admin routes
- Validate all user inputs
- Use environment variables for sensitive data

## Future Enhancements

- [ ] Add authentication middleware to protect admin routes
- [ ] Implement accessory/camera rental module
- [ ] Implement repair service module
- [ ] Add image upload for studios
- [ ] Add payment integration
- [ ] Add user dashboard for viewing their bookings
- [ ] Add booking conflicts validation UI
- [ ] Add timezone support
- [ ] Add booking reminders
- [ ] Add analytics dashboard

## License

MIT

## Credits

Inspired by [sewacamerajb.com](https://sewacamerajb.com)
