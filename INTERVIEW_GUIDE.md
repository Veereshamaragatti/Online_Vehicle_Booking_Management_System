# Interview Guide — Online Vehicle Booking Management System (OVBMS)

> Use this document to quickly recall the project's purpose, architecture, and
> design decisions before an interview.

---

## 1. Elevator Pitch (30 seconds)

"I built a **full-stack Online Vehicle Booking Management System** using
**React**, **Node.js/Express**, and **MySQL**. The application has two portals —
a **User portal** where customers browse available vehicles and request bookings
for specific dates, and an **Admin portal** where managers add vehicles, review
booking requests, and approve or reject them. Authentication is handled with
**JWT tokens** stored in HTTP-only cookies, and the database uses **stored
procedures** and **triggers** to keep vehicle availability consistent
automatically."

---

## 2. Tech Stack at a Glance

| Layer | Technology | Why chosen |
|-------|-----------|------------|
| **Frontend (User)** | React 18, React Router, Bootstrap 5 | Component-based UI, fast SPA routing, responsive design |
| **Frontend (Admin)** | React 18, React Router, Bootstrap 5 | Separate app so admin features are isolated from public users |
| **Backend API** | Node.js + Express 4 | Lightweight, non-blocking I/O, quick to prototype REST APIs |
| **Database** | MySQL 8 | Relational schema fits the domain; supports stored procedures, triggers, and scheduled events |
| **Auth** | JWT + bcryptjs | Stateless authentication; passwords hashed before storage |
| **HTTP Client** | Axios | Promise-based HTTP client with cookie/credential support |

---

## 3. High-Level Architecture

```
┌─────────────┐   HTTP (port 3000)   ┌──────────────────┐
│  User React  │ ──────────────────▶ │                  │
│    App       │                      │                  │
└─────────────┘                      │   Express API    │    ┌──────────┐
                                     │   (port 5000)    │───▶│  MySQL   │
┌─────────────┐   HTTP (port 4000)   │                  │    │  (ovbms) │
│ Admin React  │ ──────────────────▶ │                  │    └──────────┘
│    App       │                      └──────────────────┘
└─────────────┘
```

- **Three-tier architecture**: Presentation → Business Logic → Data
- Two separate React apps communicate with a single Express REST API
- The API connects to MySQL using two database users (`client` with limited
  privileges, `admin` with broader privileges) for defense-in-depth

---

## 4. Database Design (4 Tables)

### Entity-Relationship Summary

```
customer ──< booking_requests >── vehicles ──> manager
```

### Tables

| Table | Primary Key | Purpose |
|-------|------------|---------|
| `customer` | `email` | Stores registered users (name, hashed password, license ID, mobile, DOB) |
| `manager` | `email` | Stores admin/manager accounts (name, hashed password) |
| `vehicles` | `license_no` | Vehicle inventory (name, model year, price/day, seats, fuel type, image URL, overview, availability status, owning manager) |
| `booking_requests` | `request_id` (UUID) | Booking records linking customer → vehicle → manager, with dates, status, and action history |

### Key Relationships

- `vehicles.manager_id` → `manager.email` (which admin added the vehicle)
- `booking_requests.customer_id` → `customer.email`
- `booking_requests.vehicle_id` → `vehicles.license_no`
- `booking_requests.manager_id` → `manager.email` (who approved/rejected)

### Automated Database Logic

| Object | Type | What it does |
|--------|------|-------------|
| `booking_requests_AFTER_UPDATE` | **Trigger** | When a booking is approved → vehicle becomes 'Unavailable'; rejected → 'Available' |
| `CheckCompletedBookings` | **Scheduled Event** | Runs daily; marks expired bookings as 'Completed' and sets the vehicle back to 'Available' |
| `BookVehicle` | **Stored Procedure** | Creates a new booking request and sets the vehicle to 'Waiting' |
| `HandleBookingRequest` | **Stored Procedure** | Processes approve/reject, records the manager and timestamp |

**Interview tip:** Mention that using triggers and stored procedures keeps
vehicle availability consistent even if the application crashes mid-operation.

---

## 5. Core Features

### User Portal

| Feature | Route | Details |
|---------|-------|---------|
| Sign Up | `/UserSignUp` | Registers with email, name, password, license ID, mobile, DOB |
| Sign In | `/UserSignIn` | Email + password → JWT cookie |
| Browse Vehicles | `/VehicleListings` | Lists all vehicles with status 'Available' |
| Book a Vehicle | `/VehicleBooking/:id` | Select from/to dates (max 7-day window) |
| My Bookings | `/UserProfile` | View booking history with status (Pending / Approved / Rejected / Completed) |

### Admin Portal

| Feature | Route | Details |
|---------|-------|---------|
| Login | `/AdminLogin` | Separate JWT for admins |
| Dashboard | `/BookingRequest` | Stats (total users, vehicles, bookings) + pending requests |
| Manage Vehicles | `/Admin` | List, add, update, delete vehicles |
| Booking Decisions | `/BookingRequest/:id` | Approve or reject a pending booking |
| Add Admin | `/AddAdmin` | Create new admin accounts |

---

## 6. REST API Endpoints

### User Endpoints (prefix: `http://localhost:5000`)

| Method | Path | Auth? | Description |
|--------|------|-------|-------------|
| POST | `/UserSignUp` | No | Register a new user |
| POST | `/UserSignIn` | No | Login → returns JWT in HTTP-only cookie |
| POST | `/UserSignOut` | Yes | Clears auth cookie |
| GET | `/VehicleListings` | No | All available vehicles |
| GET | `/VehicleBooking/:id` | Yes | Vehicle details for booking page |
| POST | `/VehicleBooking/:id` | Yes | Submit a booking request (calls stored procedure) |
| GET | `/UserProfile` | Yes | User's bookings joined with vehicle details |

### Admin Endpoints

| Method | Path | Auth? | Description |
|--------|------|-------|-------------|
| POST | `/AdminLogin` | No | Admin login → JWT cookie |
| POST | `/AdminLogout` | Yes | Clears admin cookie |
| POST | `/AddAdmin` | Yes | Create new admin |
| GET | `/Admin` | Yes | All vehicles (Available + Waiting) |
| POST | `/AddVehicle` | Yes | Add new vehicle |
| DELETE | `/Admin/:id` | Yes | Delete vehicle by license number |
| GET | `/UpdateVehicle/:id` | Yes | Get vehicle for edit form |
| PUT | `/UpdateVehicle/:id` | Yes | Update vehicle record |
| GET | `/AdminDashboard` | Yes | Dashboard stats (counts) |
| GET | `/BookingRequest` | Yes | All booking requests with user and vehicle info |
| POST | `/BookingRequest/:requestId` | Yes | Approve or reject a request (calls stored procedure) |

---

## 7. Authentication & Security

### Authentication Flow

```
1. User submits email + password
2. Server queries DB, compares hash with bcryptjs
3. On success → sign JWT with secret key
4. JWT set as HTTP-only cookie (not accessible via JS → XSS protection)
5. Every subsequent request carries the cookie automatically
6. Middleware verifies token; rejects if missing/expired
```

### Security Measures

- **Password hashing** with `bcryptjs` (salted hash)
- **HTTP-only cookies** to prevent JavaScript access to tokens
- **Separate JWT secrets** for users (`userjwtkey`) and admins (`adminjwtkey`)
- **Two database users** with different privilege levels
- **CORS** restricted to `localhost:3000` and `localhost:4000`

### Areas for Improvement (good to mention in interviews)

- Move hardcoded DB credentials and JWT secrets to environment variables
- Add input validation/sanitization on the server
- Implement rate limiting to prevent brute-force login attacks
- Add CSRF protection alongside the cookie-based auth

---

## 8. Booking Lifecycle (State Machine)

```
User requests booking          Admin approves
       │                            │
       ▼                            ▼
   ┌────────┐    ┌─────────┐    ┌───────────┐    ┌───────────┐
   │Pending │───▶│ Waiting │───▶│ Approved  │───▶│ Completed │
   └────────┘    └─────────┘    └───────────┘    └───────────┘
                      │                               ▲
                      │  Admin rejects                │ Daily event
                      ▼                               │ (to_date passed)
                 ┌──────────┐                         │
                 │ Rejected │                         │
                 └──────────┘                         │
                                                      │
                                     (auto-complete) ─┘
```

- **Pending / Waiting**: Vehicle shows as 'Waiting' so no other user can book it
- **Approved**: Vehicle becomes 'Unavailable'
- **Rejected**: Vehicle goes back to 'Available'
- **Completed**: Triggered automatically by the daily MySQL event when `to_date` passes

---

## 9. Key Design Decisions (Why I Built It This Way)

| Decision | Reasoning |
|----------|-----------|
| **Two separate React apps** | Admin features are completely isolated from the public-facing user app, reducing the attack surface and making deployment independent |
| **Single Express server** | For a project of this size, one server file keeps things simple; in production I would split into route modules |
| **Stored procedures for booking** | Encapsulates complex multi-step logic (insert request + update vehicle status) in the database, ensuring atomicity |
| **Triggers for status sync** | Vehicle availability is always consistent with booking status — the app layer cannot leave them out of sync |
| **JWT in HTTP-only cookies** | More secure than storing tokens in localStorage; cookies are sent automatically with requests |
| **Separate DB users** | The client-facing connection has fewer privileges, limiting damage if the user-facing code is compromised |
| **Bootstrap for styling** | Rapid prototyping with responsive design out of the box |
| **UUID for booking IDs** | Globally unique, non-sequential IDs prevent enumeration attacks on booking records |

---

## 10. Common Interview Questions & Answers

### Q: Walk me through the project architecture.

> "It is a three-tier application. The presentation layer has two React SPAs —
> one for users and one for admins. Both talk to a single Express REST API on
> port 5000 using Axios with credentials (cookies). The API layer handles
> business logic and authentication via JWT middleware, then communicates with a
> MySQL database that stores customers, managers, vehicles, and booking
> requests."

### Q: How does authentication work?

> "When a user or admin logs in, the server verifies the password hash with
> bcryptjs, generates a JWT, and sets it as an HTTP-only cookie. A middleware
> function on protected routes reads the cookie, verifies the token, and
> attaches the decoded user info to the request object. If the token is missing
> or invalid, the middleware returns a 401 or 403 status."

### Q: How do you handle the booking workflow?

> "When a user books a vehicle, the backend calls a MySQL stored procedure
> `BookVehicle` that inserts a booking request with 'Pending' status and sets
> the vehicle to 'Waiting'. An admin then reviews and approves or rejects the
> request via another stored procedure `HandleBookingRequest`. A database
> trigger automatically updates the vehicle's availability based on the
> decision. A daily MySQL event auto-completes bookings whose rental period has
> ended."

### Q: Why did you use stored procedures instead of handling everything in Express?

> "Stored procedures group multiple SQL statements into a single atomic
> operation. For example, booking a vehicle requires both inserting a request
> and updating the vehicle status — if the app crashed between those two steps,
> data would be inconsistent. By putting both in a stored procedure, I get
> transactional safety at the database level."

### Q: What would you improve if you had more time?

> "First, I would move all secrets and credentials to environment variables
> using dotenv. Second, I would add server-side input validation with a library
> like Joi or express-validator. Third, I would add comprehensive tests —
> currently there is basic test scaffolding but no test cases. Fourth, I would
> modularize the backend into separate route files and a service layer. Finally,
> I would add pagination for the vehicle listings and booking history."

### Q: How do you prevent one user from booking a vehicle that's already being reviewed?

> "When a user submits a booking request, the stored procedure immediately sets
> the vehicle's availability to 'Waiting'. The vehicle listings page only shows
> vehicles with 'Available' status, so other users will not see or be able to
> book a vehicle that is pending review."

### Q: How is the admin portal secured from regular users?

> "The admin portal uses a separate JWT secret (`adminjwtkey`) and stores its
> token in a different cookie (`admin_access_token`). The admin routes have
> their own authentication middleware that only accepts admin tokens. Even if a
> regular user tries to call an admin endpoint, the token verification will fail
> because the secrets are different."

### Q: Explain the database schema.

> "There are four tables: `customer` for user accounts, `manager` for admin
> accounts, `vehicles` for the vehicle inventory, and `booking_requests` for
> booking records. The `booking_requests` table links customers, vehicles, and
> managers through foreign keys. I also have a trigger that updates vehicle
> availability when booking status changes, and a scheduled event that
> auto-completes expired bookings."

### Q: What challenges did you face?

> "One challenge was keeping vehicle availability in sync with booking status.
> Initially I handled this in Express, but if a request failed mid-update, the
> vehicle could end up in a wrong state. Moving to stored procedures and
> triggers solved this. Another challenge was managing authentication across two
> separate React apps talking to the same API — I solved it with separate JWT
> secrets and cookie names for users and admins."

---

## 11. Quick Reference Card

```
Tech:       React 18 · Express 4 · MySQL 8 · JWT · bcryptjs · Bootstrap 5
Ports:      User app → 3000 | Admin app → 4000 | API → 5000
Tables:     customer, manager, vehicles, booking_requests
Auth:       JWT in HTTP-only cookies, separate secrets for user/admin
Key logic:  Stored procedures (BookVehicle, HandleBookingRequest)
            Trigger (auto-update vehicle availability)
            Scheduled event (auto-complete expired bookings)
Patterns:   Three-tier architecture, REST API, Context API state management
```

---

*This guide was created to help quickly recall the project's details for
interview preparation.*
