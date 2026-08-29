# Ticktock - Timesheet Management Application

A modern, full-stack timesheet management application built with **Next.js 16**, **React 19**, **TypeScript**, and **NextAuth** for secure employee timesheet tracking and management developed by Ashutosh Maurya.

**Project Name:** Ticktock  
**Author:** Ashutosh Maurya  
**Version:** 0.1.0  
**Status:** Active Development

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Database & Mock Data](#database--mock-data)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 📱 Overview

**Ticktock** is a comprehensive timesheet management system designed to streamline employee time tracking, project allocation, and work management. The application provides a user-friendly interface for employees to log their daily work activities and enables managers to track project hours and team productivity.

### Key Capabilities:
- Employee timesheet creation and management
- Weekly timesheet views with detailed work entries
- Real-time status tracking (Completed, Incomplete, Missing)
- Secure authentication and authorization
- Responsive design for desktop and mobile devices
- RESTful API for timesheet operations

---

## ✨ Features

### 1. **Authentication & Authorization**
- Secure credential-based login using NextAuth v5
- Session management and automatic logout
- Protected routes and private dashboard access
- User role-based access control
- Unauthorized access handling

### 2. **Timesheet Management**
- Create and manage weekly timesheets
- View all submitted and pending timesheets
- Track timesheet status: Completed, Incomplete, Missing
- Pagination support for large timesheet lists
- Filter and search capabilities

### 3. **Time Entry Management**
- Add, edit, and delete daily work entries
- Capture project name, work type, and description
- Log hours for each task/project
- Date-based entry organization
- Bulk operations on entries

### 4. **Dashboard & Reporting**
- Comprehensive dashboard with overview statistics
- Visual status indicators with color-coded badges
- Timesheet filtering by date range and status
- Responsive data tables with sorting
- Empty state handling

### 5. **User Interface**
- Modern, intuitive design with Tailwind CSS
- Responsive layout for all devices
- Modal dialogs for entry management
- Loading states and error handling
- Empty state indicators
- Interactive forms with validation

### 6. **Data Management**
- Mock database for development and testing
- In-memory data persistence
- Realistic data models
- Support for concurrent operations

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.3.3 (App Router)
- **UI Library:** React 19.2.8
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 (with PostCSS)
- **Form Handling:** React Hook Form 7.86.0
- **Form Validation:** Zod 4.4.3
- **Icons:** Lucide React 1.35.0
- **Utilities:** clsx 2.1.1

### Backend & Authentication
- **Runtime:** Node.js
- **Authentication:** NextAuth v5.0.0-beta.32
- **API Routes:** Next.js API Routes (built-in)

### Development & Testing
- **Testing Framework:** Vitest 4.1.11
- **Testing Library:** 
  - @testing-library/react 16.3.3
  - @testing-library/jest-dom 6.9.1
  - @testing-library/user-event 14.6.6
- **Test Environment:** jsdom 29.1.1
- **Linting:** ESLint 9
- **Type Checking:** Included in TypeScript

### Build & Deployment
- **Package Manager:** npm (or yarn, pnpm, bun)
- **Build Tool:** Next.js built-in
- **Server Runtime:** Next.js Server Components

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required:
- **Node.js:** v18.0.0 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **npm:** v9.0.0 or higher (comes with Node.js)
  - Verify: `npm --version`
  - Alternative: Use yarn, pnpm, or bun

### Recommended:
- **Git:** Latest version (for version control)
  - Download from [git-scm.com](https://git-scm.com/)

- **VS Code:** Latest version (for development)
  - Download from [code.visualstudio.com](https://code.visualstudio.com/)
  - Recommended extensions:
    - ES7+ React/Redux/React-Native snippets
    - Tailwind CSS IntelliSense
    - TypeScript Vue Plugin
    - Prettier - Code formatter
    - ESLint

- **Terminal/Command Line:**
  - PowerShell (Windows)
  - Terminal (macOS)
  - bash/zsh (Linux)

---

## 📦 Installation & Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd timesheet-management-ashutosh
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install

# Or using bun
bun install
```

This will install all dependencies listed in `package.json` including:
- Next.js and React
- NextAuth for authentication
- Tailwind CSS for styling
- Testing libraries
- Type definitions

### Step 3: Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-generate-a-secure-random-string
NEXTAUTH_URL=http://localhost:3000

# Optional: Add additional environment variables as needed
NODE_ENV=development
```

**To generate a secure `NEXTAUTH_SECRET`:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

### Step 4: Verify Installation

```bash
# Check if all dependencies are installed correctly
npm list

# Run the linter to verify code quality
npm run lint

# Build the project to verify there are no build errors
npm run build
```

---

## 📁 Project Structure

```
timesheet-management-ashutosh/
├── app/                          # Next.js app directory
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout component
│   ├── not-found.tsx             # 404 page
│   ├── page.tsx                  # Home/landing page
│   ├── (protected)/              # Protected routes group
│   │   ├── layout.tsx            # Protected layout wrapper
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard home
│   │       └── timesheets/
│   │           └── [weekId]/
│   │               └── page.tsx  # Weekly timesheet detail page
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # NextAuth handler
│   │   └── timesheets/
│   │       ├── route.ts          # GET/POST timesheets
│   │       └── [id]/
│   │           ├── route.ts      # GET/PUT/DELETE specific timesheet
│   │           └── entries/
│   │               └── [entryId]/
│   │                   └── route.ts  # GET/PUT/DELETE timesheet entries
│   ├── login/
│   │   └── page.tsx              # Login page
│   └── unauthorized/
│       └── page.tsx              # Unauthorized access page
│
├── components/                    # React components
│   ├── auth/
│   │   └── LoginForm.tsx         # Login form component
│   ├── common/
│   │   ├── EmptyState.tsx        # Empty state UI
│   │   ├── Loader.tsx            # Loading spinner
│   │   └── Modal.tsx             # Modal dialog component
│   ├── dashboard/
│   │   ├── DashboardFilterProvider.tsx  # Filter context provider
│   │   ├── DashboardHeader.tsx          # Dashboard header
│   │   ├── Pagination.tsx               # Pagination controls
│   │   ├── StatusBadge.tsx              # Status badge component
│   │   ├── StatusBadge.test.tsx         # Badge component tests
│   │   ├── TimesheetFilters.tsx         # Filter UI
│   │   └── TimesheetTable.tsx           # Timesheet list table
│   └── timesheet/
│       ├── DayEntries.tsx        # Daily entries view
│       ├── DeleteEntryModal.tsx  # Delete confirmation modal
│       ├── EntryActions.tsx      # Entry action buttons
│       ├── EntryModal.tsx        # Add/edit entry modal
│       └── WeeklyTimesheet.tsx   # Weekly timesheet container
│
├── lib/                          # Utility functions and helpers
│   ├── api-client.ts            # API client utilities
│   ├── mock-db.ts               # Mock database
│   ├── timesheet-utils.ts       # Timesheet utilities
│   └── timesheet-utils.test.ts  # Utility function tests
│
├── types/                        # TypeScript type definitions
│   ├── auth.ts                  # Authentication types
│   └── timesheet.ts             # Timesheet data types
│
├── public/                       # Static assets
│   └── (icons, images, etc.)
│
├── auth.ts                       # NextAuth configuration
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
├── vitest.config.ts             # Vitest configuration
├── vitest.setup.ts              # Vitest setup
├── eslint.config.mjs            # ESLint configuration
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── package.json                 # Project dependencies and scripts
├── README.md                    # This file
└── .env.local                   # Environment variables (not in git)
```

---

## ⚙️ Configuration

### TypeScript Configuration (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "noEmit": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Next.js Configuration (`next.config.ts`)

- Configured for App Router
- TypeScript support enabled
- Tailwind CSS integration
- API routes support
- Middleware support

### Tailwind CSS Configuration

- Built with Tailwind CSS 4
- PostCSS integration
- Responsive design utilities
- Custom color schemes and components

### ESLint Configuration (`eslint.config.mjs`)

- Standard ESLint rules enabled
- Next.js specific linting rules
- TypeScript support
- React best practices

### Authentication Configuration (`auth.ts`)

```typescript
// NextAuth configuration with Credentials provider
// Users: stored in mock database
// Session management: automatic
// Protected routes: handled via middleware
```

---

## 🚀 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

- Hot Module Replacement (HMR) enabled
- Automatic rebuilds on file changes
- Development error overlay
- Detailed console logging

**Default Login Credentials:**
```
Email: ashu@email.com
Password: 123 (I set this to test more easily)
```

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

The application will be optimized and ready for production deployment.

### Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:run

# Run specific test file
npm run test -- filename.test.ts

# Run tests with coverage
npm run test -- --coverage
```

### Linting

```bash
# Run ESLint to check code quality
npm run lint

# Fix auto-fixable linting issues
npm run lint -- --fix
```

---

## 📡 API Documentation

All API endpoints are RESTful and use JSON for request/response bodies.

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Login
```
POST /auth/signin
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com"
}

Status Codes:
- 200: Login successful
- 401: Invalid credentials
- 400: Missing required fields
```

#### Logout
```
POST /auth/signout

Response:
204 No Content

Status Codes:
- 204: Logout successful
- 401: Not authenticated
```

### Timesheet Endpoints

#### Get All Timesheets
```
GET /timesheets
Query Parameters:
  - page: number (default: 1)
  - pageSize: number (default: 10)
  - status: "COMPLETED" | "INCOMPLETE" | "MISSING" (optional)
  - startDate: string (YYYY-MM-DD, optional)
  - endDate: string (YYYY-MM-DD, optional)

Response:
{
  "data": [
    {
      "id": "week-1",
      "weekNumber": 1,
      "startDate": "2026-08-25",
      "endDate": "2026-08-31",
      "status": "COMPLETED",
      "entries": [...]
    }
  ],
  "total": 52,
  "page": 1,
  "pageSize": 10
}

Status Codes:
- 200: Success
- 401: Unauthorized
- 400: Invalid query parameters
```

#### Get Specific Timesheet
```
GET /timesheets/{id}

Response:
{
  "id": "week-1",
  "weekNumber": 1,
  "startDate": "2026-08-25",
  "endDate": "2026-08-31",
  "status": "COMPLETED",
  "entries": [
    {
      "id": "entry-1",
      "date": "2026-08-25",
      "projectName": "Project Alpha",
      "workType": "Development",
      "description": "API implementation",
      "hours": 8
    }
  ]
}

Status Codes:
- 200: Success
- 401: Unauthorized
- 404: Timesheet not found
```

#### Create Timesheet Entry
```
POST /timesheets/{id}/entries
Content-Type: application/json

Request Body:
{
  "date": "2026-08-25",
  "projectName": "Project Alpha",
  "workType": "Development",
  "description": "API implementation",
  "hours": 8
}

Response:
{
  "id": "entry-1",
  "date": "2026-08-25",
  "projectName": "Project Alpha",
  "workType": "Development",
  "description": "API implementation",
  "hours": 8
}

Status Codes:
- 201: Entry created successfully
- 401: Unauthorized
- 400: Invalid request body
- 404: Timesheet not found
```

#### Update Timesheet Entry
```
PUT /timesheets/{id}/entries/{entryId}
Content-Type: application/json

Request Body (all fields optional):
{
  "projectName": "Project Beta",
  "workType": "Testing",
  "description": "Unit testing",
  "hours": 6
}

Response:
{
  "id": "entry-1",
  "date": "2026-08-25",
  "projectName": "Project Beta",
  "workType": "Testing",
  "description": "Unit testing",
  "hours": 6
}

Status Codes:
- 200: Entry updated successfully
- 401: Unauthorized
- 400: Invalid request body
- 404: Entry or timesheet not found
```

#### Delete Timesheet Entry
```
DELETE /timesheets/{id}/entries/{entryId}

Response:
204 No Content

Status Codes:
- 204: Entry deleted successfully
- 401: Unauthorized
- 404: Entry or timesheet not found
```

#### Update Timesheet Status
```
PUT /timesheets/{id}
Content-Type: application/json

Request Body:
{
  "status": "COMPLETED" | "INCOMPLETE" | "MISSING"
}

Response:
{
  "id": "week-1",
  "status": "COMPLETED"
}

Status Codes:
- 200: Timesheet updated successfully
- 401: Unauthorized
- 400: Invalid status value
- 404: Timesheet not found
```

---

## 🔐 Authentication

### NextAuth Configuration

The application uses **NextAuth v5** with **Credentials Provider** for authentication.

#### How It Works:

1. **Login Flow:**
   - User submits email and password via login form
   - Credentials are verified against mock database
   - Session is created upon successful authentication
   - User is redirected to dashboard

2. **Session Management:**
   - Sessions are stored in HTTP-only cookies
   - Automatic session validation on each request
   - Sessions expire after configured duration
   - Automatic redirect to login on expiration

3. **Protected Routes:**
   - Dashboard routes require authentication
   - Middleware checks session validity
   - Unauthorized users redirected to login
   - Public routes: `/`, `/login`, `/unauthorized`
   - Protected routes: `/dashboard`, `/dashboard/timesheets/*`

4. **Logout:**
   - Destroys current session
   - Clears authentication cookies
   - Redirects to login page

#### Authentication Types

```typescript
// User Session
interface User {
  id: string;
  name: string;
  email: string;
}

// Auth Types
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';
```

#### Using Authentication in Components

```typescript
// Check session status
import { useSession } from "next-auth/react";

const MyComponent = () => {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <Loader />;
  if (status === 'unauthenticated') return <Redirect to="/login" />;
  
  return <Dashboard user={session?.user} />;
};
```

#### Sign Out

```typescript
import { signOut } from "next-auth/react";

const handleLogout = () => {
  signOut({ redirect: true, redirectTo: '/login' });
};
```

---

## 💾 Database & Mock Data

### Mock Database Overview

The application uses an **in-memory mock database** for development and testing purposes. All data is stored in `lib/mock-db.ts`.

### Mock Data Structure

#### Users Database

```typescript
// lib/mock-db.ts
export const users = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123"
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123"
  }
];
```

#### Timesheets Database

```typescript
export const timesheets = [
  {
    id: "week-1",
    weekNumber: 1,
    startDate: "2026-08-25",
    endDate: "2026-08-31",
    status: "COMPLETED" | "INCOMPLETE" | "MISSING",
    entries: [
      {
        id: "entry-1",
        date: "2026-08-25",
        projectName: "Project Alpha",
        workType: "Development",
        description: "API implementation",
        hours: 8
      }
    ]
  }
];
```

### Data Persistence

- **Session Duration:** In-memory (cleared on server restart)
- **Data Reset:** Occurs automatically on application restart
- **Concurrent Operations:** Supported for testing
- **Production Migration:** Replace mock database with actual database

### Adding Test Data

To add more mock data, edit `lib/mock-db.ts`:

```typescript
// Add new users
users.push({
  id: "user-3",
  name: "Bob Wilson",
  email: "bob@example.com",
  password: "password123"
});

// Add new timesheets
timesheets.push({
  id: "week-2",
  // ... timesheet data
});
```

---

## 🧪 Testing

### Testing Framework: Vitest

Vitest is used for unit testing with React Testing Library for component testing.

### Running Tests

```bash
# Run tests in watch mode (recommended for development)
npm run test

# Run tests once (CI mode)
npm run test:run

# Run specific test file
npm run test -- src/lib/timesheet-utils.test.ts

# Run tests with coverage report
npm run test -- --coverage

# Run tests matching pattern
npm run test -- --grep "timesheet"

# Debug tests
npm run test -- --inspect-brk
```

### Test Files

```
lib/
  ├── timesheet-utils.test.ts    # Utility function tests
components/
  └── dashboard/
      └── StatusBadge.test.tsx   # Component tests
```

### Writing Tests

#### Unit Test Example

```typescript
// lib/timesheet-utils.test.ts
import { describe, it, expect } from 'vitest';
import { calculateTotalHours } from '@/lib/timesheet-utils';

describe('timesheet-utils', () => {
  it('should calculate total hours correctly', () => {
    const entries = [
      { hours: 8 },
      { hours: 7.5 },
      { hours: 8 }
    ];
    
    expect(calculateTotalHours(entries)).toBe(23.5);
  });
});
```

#### Component Test Example

```typescript
// components/dashboard/StatusBadge.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from '@/components/dashboard/StatusBadge';

describe('StatusBadge', () => {
  it('should render COMPLETED status', () => {
    render(<StatusBadge status="COMPLETED" />);
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
  });
});
```

### Test Configuration

**vitest.config.ts:**
- jsdom environment for DOM testing
- React Testing Library integration
- File type coverage
- Watch mode enabled by default

**vitest.setup.ts:**
- Jest DOM matchers setup
- Global test configuration
- Mock setup

---

## 🚀 Deployment

### Deployment Options

#### Option 1: Vercel (Recommended)

Vercel is the official platform for Next.js and provides seamless deployment.

**Steps:**

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables

3. **Set Environment Variables**
   ```
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=your-production-domain.com
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys

#### Option 2: Docker & Container Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

**Build and run:**

```bash
# Build Docker image
docker build -t ticktock-app .

# Run container
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  ticktock-app
```

#### Option 3: Traditional Node.js Hosting

**Steps:**

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Install dependencies in production mode**
   ```bash
   npm install --production
   ```

3. **Set environment variables**
   ```bash
   export NEXTAUTH_SECRET=your-secret
   export NEXTAUTH_URL=your-domain.com
   export NODE_ENV=production
   ```

4. **Start application**
   ```bash
   npm start
   ```

### Pre-deployment Checklist

- [ ] All tests passing (`npm run test:run`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Database migration completed (if applicable)
- [ ] Security review completed
- [ ] Performance optimization done
- [ ] Error logging configured
- [ ] Monitoring setup completed
- [ ] Backup strategy in place

### Production Best Practices

1. **Security:**
   - Use strong, unique NEXTAUTH_SECRET
   - Enable HTTPS only
   - Set secure cookie flags
   - Regular security updates

2. **Performance:**
   - Enable caching headers
   - Compress assets
   - Optimize images
   - Use CDN for static content

3. **Monitoring:**
   - Setup error tracking (Sentry, etc.)
   - Monitor application logs
   - Setup alerts for errors
   - Performance monitoring

4. **Backup & Recovery:**
   - Regular database backups
   - Document recovery procedures
   - Test backup restoration
   - Maintain redundancy

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Port 3000 Already in Use

**Problem:** Error like "Port 3000 is already in use"

**Solution:**

```bash
# Find process using port 3000 (Windows)
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

#### Issue 2: Dependencies Installation Fails

**Problem:** `npm install` fails with dependency conflicts

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue 3: Session Not Persisting

**Problem:** User gets logged out immediately or session doesn't persist

**Solution:**

1. Verify `NEXTAUTH_SECRET` is set:
   ```bash
   echo $NEXTAUTH_SECRET
   ```

2. Check browser cookies are enabled

3. Verify `NEXTAUTH_URL` matches your domain

4. Clear browser cookies and try again

#### Issue 4: Environment Variables Not Loading

**Problem:** `.env.local` variables not accessible

**Solution:**

```bash
# Make sure .env.local exists in root directory
ls -la .env.local

# Restart development server
npm run dev

# Verify variables are loaded
console.log(process.env.NEXTAUTH_SECRET) // Should not be undefined
```

#### Issue 5: TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**

```bash
# Clear TypeScript cache
rm -rf .next

# Rebuild
npm run build

# Check for errors
npx tsc --noEmit
```

#### Issue 6: Mock Data Not Appearing

**Problem:** Database seems empty or data not persisting

**Solution:**

- Mock data is in-memory and resets on server restart
- Check `lib/mock-db.ts` for data initialization
- All data is lost when server stops
- Use a real database for persistent data storage

#### Issue 7: Build Fails

**Problem:** `npm run build` fails

**Solution:**

```bash
# Check for errors
npm run lint

# Run tests
npm run test:run

# Clear build cache
rm -rf .next

# Try building again
npm run build
```

#### Issue 8: Middleware Errors

**Problem:** Middleware not redirecting to login

**Solution:**

1. Check `middleware.ts` or auth configuration
2. Verify protected routes in route configuration
3. Clear browser cache and cookies
4. Restart development server

### Debug Mode

Enable debug logging:

```bash
# Windows PowerShell
$env:DEBUG='*'
npm run dev

# macOS/Linux
DEBUG=* npm run dev
```

### Getting Help

1. Check the console for error messages
2. Review browser DevTools network tab
3. Check server logs in terminal
4. Review GitHub issues
5. Create detailed issue report with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Expected vs actual behavior

---

## 👥 Contributing

### Contributing Guidelines

We welcome contributions! Follow these steps:

1. **Fork the repository**
   ```bash
   git clone <your-fork-url>
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Describe changes clearly
   - Link related issues
   - Ensure tests pass
   - Follow code style guide

### Code Style Guidelines

- Use TypeScript strict mode
- Follow ESLint configuration
- Use React best practices
- Write descriptive commit messages
- Add tests for new features

### Commit Message Format

```
type(scope): subject

feat(auth): add login functionality
fix(dashboard): correct filter bug
docs(readme): update installation steps
style(components): format code
test(timesheet): add unit tests
```

### Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Tests are passing
- [ ] No console errors/warnings
- [ ] Documentation is updated
- [ ] Commit messages are descriptive

---

## 📄 License

This project is created by **Ashutosh Maurya** as a timesheet management demonstration.

- **Author:** Ashutosh Maurya
- **Email:** [Add your email if needed]
- **Status:** Open for learning and demonstration purposes

### License Type

[Specify your license here - e.g., MIT, Apache 2.0, or Commercial]

---

## 📚 Additional Resources

### Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Vitest Documentation](https://vitest.dev)
- [React Hook Form Documentation](https://react-hook-form.com)

### Useful Commands Reference

```bash
# Development
npm run dev                  # Start development server
npm run build              # Build for production
npm start                  # Start production server

# Testing & Quality
npm run test               # Run tests in watch mode
npm run test:run           # Run tests once
npm run lint               # Check code quality

# Environment
# Set production variables before deployment
export NEXTAUTH_SECRET=...
export NEXTAUTH_URL=...
```

---

## 📞 Support

For issues, questions, or suggestions:

1. **Check Existing Issues:** Search GitHub issues
2. **Create New Issue:** Detailed description with steps to reproduce
3. **Discussion:** Start a discussion for questions
4. **Contact:** [Add contact information if applicable]

---

## ✅ Project Checklist

- ✅ Authentication system implemented
- ✅ Timesheet management features
- ✅ REST API endpoints
- ✅ Responsive UI design
- ✅ Testing framework setup
- ✅ Documentation
- ✅ Project structure organized
- ✅ Environment configuration
- ✅ Error handling
- ✅ Loading states

---

## 🎯 Future Enhancements

Planned features for future versions:

- [ ] Real database integration (PostgreSQL, MongoDB)
- [ ] Multi-user team features
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Two-factor authentication
- [ ] Approval workflow
- [ ] Time tracking automation
- [ ] Export to PDF/Excel
- [ ] Dark mode support

---

**Last Updated:** August 29, 2026  
**Project Version:** 0.1.0  
**Status:** Active Development

---

**Built with Ashutosh Maurya ❤️ using Next.js + Tailwind css and Next Auth**
