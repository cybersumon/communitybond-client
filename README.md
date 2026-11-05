
# CommunityBond

### Connect • Care • Change

CommunityBond is a modern, full-stack social development events platform designed to bring communities together through volunteering, meaningful initiatives, and positive social impact.

Users can discover upcoming events, create community initiatives, join volunteering activities, and manage their participation through a responsive and user-friendly platform.

The platform encourages individuals to take small actions that create meaningful changes in society.

## Live Website

**Live Website:** 

**Client Repository:** https://github.com/cybersumon/communitybond-client

**Server Repository:** https://github.com/cybersumon/communitybond-server

## Key Features

### 1. User Authentication
- Secure registration and login using Better Auth.
- Email and password authentication.
- GitHub OAuth integration.
- Persistent user sessions.
- Protected event management features.

### 2. Community Event Creation
- Authenticated users can create community events.
- Add event titles, descriptions, categories, locations, and dates.
- Upload event images from a computer.
- Add event cover images using external URLs.
- Validate event information before submission.

### 3. Upcoming Events
- Browse upcoming community initiatives.
- Discover events by title, category, and location.
- Responsive event cards.
- View detailed event information.

### 4. Event Details
- Premium event details interface.
- Intercepting-route modal navigation.
- Event date, time, category, and location.
- Volunteer guidelines.
- Join event functionality.

### 5. Event Management
- Organizers can edit their events.
- Organizers can delete events with confirmation.
- Event ownership validation.
- My Events dashboard.
- Manage event information and participants.

### 6. Volunteer Registration
- Join community events.
- Prevent duplicate registrations.
- Leave previously joined events.
- View registered activities.
- Track upcoming and past joined events.

### 7. Volunteer Management
- Organizers can view event participants.
- Search registered volunteers.
- View volunteer registration information.
- Refresh participant lists.

### 8. Community Gallery
- Image-based community event gallery.
- Discover meaningful initiatives.
- Browse events directly from the homepage.

### 9. Newsletter Subscription
- Subscribe to community cause alerts.
- Email subscription form.
- Newsletter unsubscribe functionality.

### 10. Responsive Design
- Mobile-friendly navigation.
- Responsive layouts for desktop, tablet, and mobile.
- Modern Tailwind CSS styling.
- Smooth hover effects and interactive components.

### 11. Light and Dark Mode
- Theme switching.
- Theme-aware interface elements.
- Consistent colors across components.

### 12. User Dashboards
- My Events dashboard.
- My Joined Events dashboard.
- Event search and filtering.
- Volunteer registration statistics.
- Event management actions.

## Technology Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React
- Better Auth
- Next Themes

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- JWT Authentication
- Zod Validation
- Multer
- Sharp

## Project Structure

```text
communitybond-client/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── @modal/
│   │   ├── create-event/
│   │   ├── events/
│   │   ├── my-events/
│   │   ├── my-joined-events/
│   │   ├── upcoming-events/
│   │   └── page.tsx
│   ├── components/
│   │   ├── events/
│   │   ├── home/
│   │   ├── layout/
│   │   └── shared/
│   ├── lib/
│   │   └── api/
│   └── types/
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/cybersumon/communitybond-client
cd communitybond-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=secure_secret
MONGODB_URI=mongodb_connection_string
DB_NAME=database_name
```

Additional authentication provider variables may be required depending on the Better Auth configuration.

### 4. Start the Development Server

```bash
npm run dev
```

If your network requires the included DNS bootstrap:

```bash
node --require ./scripts/dns-bootstrap.cjs ./node_modules/next/dist/bin/next dev
```

Open:

http://localhost:3000

### 5. Start the Backend

The Express backend must also be running.

Default local API URL:

http://localhost:5001

## Available Pages

| Page | Route |
|------|-------|
| Homepage | `/` |
| Upcoming Events | `/upcoming-events` |
| Event Details | `/events/[id]` |
| Create Event | `/create-event` |
| My Events | `/my-events` |
| My Joined Events | `/my-joined-events` |
| Login | `/login` |
| Register | `/register` |

## Security Features

- JWT-protected backend operations.
- Organizer ownership verification.
- Protected event management functionality.
- Server-side validation.
- Secure authentication sessions.
- Environment-based secret management.

## Build and Testing

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Run ESLint:

```bash
npx eslint .
```

Create a production build:

```bash
npm run build
```

## Deployment

The frontend is designed for deployment on Vercel.

The Express backend can be deployed separately on a Node.js hosting platform.

Production environment variables must use the deployed API and authentication URLs.

Uploaded event images require persistent storage in production.

## Future Improvements

- Advanced event lifecycle management.
- Automated event notifications.
- Volunteer coordination improvements.
- Community impact statistics.
- Enhanced administrative tools.

## Project Information

**Project Name:** CommunityBond

**Assignment:** B14-A08

**Project Type:** Full-Stack Social Development Events Platform

**Frontend:** Next.js

**Backend:** Express.js

**Database:** MongoDB Atlas

**Purpose:** Connect people through community service, volunteering, and meaningful social development initiatives.

## Author

Developed as part of the B14-A08 full-stack web development assignment.

## License

This project was created for educational purposes.
