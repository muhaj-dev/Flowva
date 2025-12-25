# Flowva Rewards Hub

A comprehensive rewards and gamification platform built with React, TypeScript, and Supabase. This application enables users to earn points through various activities, maintain daily streaks, refer friends, and redeem rewards.

## Features

- **Points System**: Earn points through daily check-ins, task completion, and referrals
- **Daily Streaks**: Track consecutive login days with visual streak indicators
- **Referral Program**: Generate unique referral codes and earn points for successful referrals
- **Rewards Catalog**: Browse and redeem various rewards using earned points
- **Real-time Updates**: Live point balance and activity tracking
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Authentication**: Secure user authentication with Supabase Auth

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **Backend**: Supabase (PostgreSQL database, Authentication, Real-time subscriptions)
- **UI Components**: Custom component library with loading states
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/muhaj-dev/Flowva.git
cd rewards-hub
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up your Supabase database with the required tables:
   - `users` - User profiles with points balance, streak data, and referral codes
   - `user_activities` - Activity log for point transactions
   - `referrals` - Referral relationship tracking
   - `rewards` - Available rewards catalog
   - `reward_redemptions` - User reward redemption history

5. Run the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist` folder.

## Architecture & Design Decisions

### Component Structure

The application follows a modular component architecture:

- **Pages**: Top-level route components (`RewardsHub`, `AuthPage`)
- **Components**: Reusable UI components organized by feature
  - `ui/` - Base UI components (Button, Card, Modal, Tabs, Skeleton)
  - `rewards/` - Feature-specific components (PointsBalance, DailyStreak, RewardsGrid)
- **Contexts**: React Context for global state management (`AuthContext`)
- **Services**: API service layer for Supabase interactions (`userService`)

### State Management

- **Authentication State**: Managed via `AuthContext` using React Context API
- **Local Component State**: React hooks (`useState`, `useEffect`) for UI state
- **Real-time Updates**: Supabase real-time subscriptions for live data

### Loading, Empty, and Error State Handling

#### Loading States

The application implements comprehensive loading states at multiple levels:

1. **Full Page Loading** (`FullPageLoader` component):
   - Displayed during initial authentication and profile loading
   - Features the Flowva logo with animated loading dots
   - Located in [src/components/ui/Skeleton.tsx](src/components/ui/Skeleton.tsx)

2. **Card Skeleton Loading** (`CardSkeleton` component):
   - Displayed while individual sections load (rewards journey, rewards grid)
   - Matches the layout of actual cards for smooth transition
   - Uses pulse animation for visual feedback

3. **Component-Level Loading**:
   - Individual components handle their own loading states
   - Examples: Daily check-in button shows loading spinner during API calls
   - Implemented in [src/pages/RewardsHub.tsx](src/pages/RewardsHub.tsx)

#### Empty States

Empty states are handled gracefully throughout the application:

- **No User Profile**: Displays a message prompting sign-in ([RewardsHub.tsx:86-95](src/pages/RewardsHub.tsx#L86-L95))
- **No Rewards Available**: RewardsGrid component can handle empty reward arrays
- **Zero Points Balance**: PointsBalance component displays progress toward first reward

#### Error Handling

Error handling is implemented at multiple layers:

1. **API Error Handling**:
   - Try-catch blocks wrap all Supabase API calls
   - Errors are logged to console for debugging
   - User-friendly error messages via alerts
   - Example in daily check-in: [RewardsHub.tsx:55-75](src/pages/RewardsHub.tsx#L55-L75)

2. **Authentication Errors**:
   - Handled in AuthContext with error propagation to UI
   - Failed profile creation triggers automatic retry with profile creation

3. **Network Errors**:
   - Supabase client handles network failures with automatic retries
   - UI remains responsive during network issues

### Assumptions & Trade-offs

#### Assumptions

1. **Supabase Backend**: Assumes a fully configured Supabase project with appropriate tables and Row Level Security (RLS) policies
2. **Email Verification**: Users can access the app immediately after signup (email verification not enforced)
3. **Referral Codes**: Auto-generated unique 8-character alphanumeric codes for each user
4. **Points Economy**: Fixed point values for activities (10 for signup, 5 for daily check-in, etc.)
5. **Browser Support**: Modern browsers with ES2020+ JavaScript support

#### Trade-offs

1. **Client-Side Validation vs Server-Side**:
   - Trade-off: Implemented primary validation on client-side for better UX
   - Reason: Faster feedback, reduced server load
   - Mitigation: Supabase RLS policies enforce server-side security

2. **Real-time vs Polling**:
   - Trade-off: Using Supabase real-time subscriptions instead of polling
   - Reason: Better performance and instant updates
   - Consideration: Requires maintaining websocket connections

3. **Component Library**:
   - Trade-off: Custom UI components instead of pre-built library (Material-UI, Chakra)
   - Reason: Full design control, smaller bundle size, matches Flowva brand
   - Consideration: Requires more development time upfront

4. **State Management**:
   - Trade-off: React Context instead of Redux/Zustand
   - Reason: Simpler for this application size, less boilerplate
   - Consideration: May need refactoring if state complexity grows

5. **Loading Strategy**:
   - Trade-off: Skeleton screens instead of spinners
   - Reason: Better perceived performance, reduces layout shift
   - Consideration: Requires maintaining skeleton variants

## React Fundamentals Demonstrated

This project showcases solid React fundamentals and best practices:

### Hooks Usage
- `useState` for local component state
- `useEffect` for side effects and data fetching
- `useContext` for consuming global auth state
- Custom hooks (`useAuth`) for encapsulated logic

### Component Patterns
- Functional components with TypeScript interfaces
- Props typing for type safety
- Conditional rendering for different UI states
- Component composition and reusability

### Performance Optimizations
- Conditional rendering to minimize re-renders
- Proper dependency arrays in `useEffect`
- Event handler memoization where appropriate

### Best Practices
- Separation of concerns (UI, logic, services)
- Single Responsibility Principle in components
- Proper error boundaries and error handling
- Accessible UI with semantic HTML and ARIA labels

## Key Features Implementation

### Daily Check-in System
- Tracks user's last check-in timestamp in Supabase
- Calculates streak based on consecutive days
- Awards 5 points per check-in with confetti animation
- Resets streak if a day is missed

### Points Balance with Progress Tracking
- Real-time points display with coin icon
- Visual progress bar toward next reward milestone
- Motivational messages based on progress
- Gradient styling matching Flowva brand

### Referral System
- Auto-generated unique referral codes
- Tracks referral stats (total referrals, points earned)
- Copy-to-clipboard functionality for easy sharing
- Awards points to both referrer and referee

### Rewards Redemption
- Filterable rewards catalog
- Point-based eligibility checking
- Locked state for insufficient points
- Redemption history tracking

## Project Structure

```
rewards-hub/
├── src/
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Tabs.tsx
│   │   └── rewards/         # Feature components
│   │       ├── PointsBalance.tsx
│   │       ├── DailyStreak.tsx
│   │       ├── EarnMorePoints.tsx
│   │       ├── ReferralSection.tsx
│   │       └── RewardsGrid.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Auth state management
│   ├── pages/
│   │   ├── RewardsHub.tsx   # Main rewards page
│   │   └── AuthPage.tsx     # Login/Signup page
│   ├── services/
│   │   └── userService.ts   # Supabase API calls
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── lib/
│   │   └── supabase.ts      # Supabase client
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Contributing

This project demonstrates the ability to recreate existing product features with working logic, proper state management, and a focus on user experience. The implementation includes:

- Complete authentication flow
- Real-time data synchronization
- Responsive UI with loading states
- Error handling and recovery
- Type-safe code with TypeScript
- Component reusability and composition

## License

This project is part of the Flowva ecosystem.
