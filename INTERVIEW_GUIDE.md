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

## 10. Interview Questions & Answers

The questions below are grouped by topic and ordered from general to specific.
Each answer is written in first person so you can use it directly.

---

### 🔷 Project Overview

**Q1: Can you give a brief overview of the project?**

> "This is an **Online Vehicle Booking Management System** — a full-stack web
> application where users can browse a catalog of vehicles, select dates, and
> submit booking requests. Admins manage the vehicle inventory and approve or
> reject those requests. I built it with **React** on the frontend, **Express**
> on the backend, and **MySQL** as the database. The system has two separate
> React apps — one for users and one for admins — both talking to a single REST
> API."

**Q2: Walk me through the project architecture.**

> "It follows a **three-tier architecture**. The presentation layer has two
> React single-page applications — the user app runs on port 3000 and the admin
> app on port 4000. Both communicate with a single Express REST API on port
> 5000 using Axios with `withCredentials: true` so cookies are sent
> automatically. The API layer handles business logic, JWT-based
> authentication, and talks to a MySQL database that stores customers, managers,
> vehicles, and booking requests."

**Q3: Why did you choose this tech stack?**

> "I chose **React** because its component-based architecture and virtual DOM
> make building interactive UIs efficient. **Express** is lightweight and
> well-suited for REST APIs — it has a large middleware ecosystem. **MySQL** was
> a good fit because the domain is clearly relational (customers book vehicles,
> managers approve requests) and MySQL supports stored procedures, triggers, and
> scheduled events, which I used to keep data consistent. For auth I used
> **JWT** because it is stateless and scales well, and **bcryptjs** for secure
> password hashing."

**Q4: What is the role of each part of the application?**

> "The **client React app** lets users sign up, sign in, browse available
> vehicles, submit booking requests with date ranges, and view their booking
> history. The **admin React app** lets managers log in, add/update/delete
> vehicles, view a dashboard with statistics, and approve or reject pending
> booking requests. The **Express server** exposes REST endpoints for both apps,
> handles authentication middleware, and calls MySQL stored procedures. The
> **MySQL database** stores all data and enforces business rules through
> triggers and events."

---

### 🔷 React & Frontend

**Q5: How did you structure the React frontend?**

> "Each React app has a `components` folder with one file per feature —
> `UserSignIn`, `UserSignUp`, `VehicleListings`, `VehicleBooking`,
> `UserProfile`, and a `Navbar`. Routing is handled by **React Router v6** with
> `BrowserRouter`, `Routes`, and `Route`. I use a custom `AuthContext` (via
> React's Context API) to share authentication state across components, and a
> `ProtectedUserRoute` wrapper that redirects unauthenticated users to the sign
> in page."

**Q6: Explain how you manage state in the React apps.**

> "I use **React Context API** for global auth state — storing whether the user
> is signed in, their email, and name. Each component manages its own local
> state with the `useState` hook. For example, `VehicleListings` has local
> state for the vehicle list and the user's active bookings. I chose Context
> API over Redux because the app's state is simple enough that Redux would be
> overkill."

**Q7: How does the `ProtectedUserRoute` component work?**

> "It reads the `isSignedIn` flag from the `AuthContext`. If the user is signed
> in, it renders the child component. If not, it redirects to `/UserSignIn`
> using React Router's `Navigate` component. The admin app has an equivalent
> `ProtectedAdminRoute` that checks admin auth state. This pattern keeps route
> protection declarative and reusable."

**Q8: How do you make API calls from the frontend?**

> "I use **Axios** with `withCredentials: true` on every request so the
> browser automatically sends the JWT cookie. For example, when the user opens
> the vehicle listings page, a `useEffect` hook calls
> `axios.get('http://localhost:5000/VehicleListings')`. The response data is
> stored in local state with `setVehicles`. Error handling shows an alert or
> sets an error message in state."

**Q9: How do you handle routing in the React apps?**

> "I use **React Router v6**. In `App.js`, I wrap the app in `BrowserRouter`
> and define routes with `Routes` and `Route`. Public routes like
> `/VehicleListings` and `/UserSignIn` render directly. Protected routes like
> `/UserProfile` and `/VehicleBooking/:id` are wrapped in
> `ProtectedUserRoute`, which redirects to sign in if the user is not
> authenticated."

**Q10: How does the vehicle booking form work?**

> "The `VehicleBooking` component takes a vehicle ID from the URL params using
> `useParams()`. On mount, a `useEffect` fetches the vehicle details. The form
> has two date inputs — `from_date` and `to_date` — with the minimum set to
> today and the maximum to 7 days from now. On submit, it sends a POST request
> to `/VehicleBooking/:id` with the dates. On success, it navigates the user
> to their profile page to see the pending booking."

**Q11: How does `VehicleListings` show a user's active bookings?**

> "When the component mounts, if the user is signed in, it makes an additional
> GET request to `/UserProfile` which returns the user's bookings. It then
> filters for bookings with status 'Pending' or 'Approved' and extracts their
> vehicle IDs. When rendering each vehicle card, it checks if that vehicle's
> license number is in the active bookings set. If so, it shows a 'Booked'
> badge instead of the 'Book Now' button."

---

### 🔷 Node.js & Express Backend

**Q12: Describe the structure of your Express server.**

> "The entire backend lives in a single `server.js` file. It sets up two
> MySQL connections — one with limited privileges for client-facing queries and
> one with admin privileges. It defines JWT authentication middleware for both
> users and admins, then registers all the REST endpoints. I used a single-file
> approach to keep things simple for this project size, but in production I
> would split routes into separate modules."

**Q13: How does the JWT authentication middleware work?**

> "I have two middleware functions — `userAuthenticateToken` and
> `adminAuthenticateToken`. Each reads the JWT from a cookie
> (`access_token` for users, `admin_access_token` for admins), verifies it
> with the corresponding secret key using `jsonwebtoken.verify()`, and attaches
> the decoded payload to `req.user`. If the cookie is missing it returns 401;
> if the token is invalid it returns 403. I apply this middleware to any route
> that requires authentication."

**Q14: Why do you have two separate database connections?**

> "I have a `ClientDB` connection with a MySQL user that only has SELECT and
> EXECUTE privileges, and an `AdminDB` connection with a user that has full
> CRUD privileges. This follows the **principle of least privilege** — even if
> there is a vulnerability in the user-facing code, the database user cannot
> delete or modify records beyond what is exposed through stored procedures."

**Q15: How does the UserSignUp endpoint work?**

> "The POST `/UserSignUp` endpoint receives the user's name, email, password,
> license number, mobile number, and date of birth. It first hashes the
> password using `bcryptjs.hash()` with a salt rounds value of 10. Then it
> inserts the user into the `customer` table. If the email already exists,
> MySQL returns a duplicate key error which I catch and send back as a 409
> Conflict response."

**Q16: How does the UserSignIn endpoint work?**

> "The POST `/UserSignIn` endpoint receives email and password. It queries the
> `customer` table for that email. If no user is found, it returns 404. If
> found, it compares the submitted password with the stored hash using
> `bcryptjs.compare()`. On success, it generates a JWT containing the user's
> email and name, sets it as an HTTP-only cookie with `res.cookie()`, and
> returns the user info. The `httpOnly: true` flag ensures JavaScript cannot
> read the cookie, protecting against XSS."

**Q17: How do you handle CORS?**

> "I use the `cors` middleware configured to allow requests from
> `http://localhost:3000` (user app) and `http://localhost:4000` (admin app)
> with `credentials: true` so cookies are included. Without this, the browser
> would block cross-origin requests from the React apps to the Express API
> running on a different port."

**Q18: How does the booking approval/rejection endpoint work?**

> "The POST `/BookingRequest/:requestId` endpoint receives the action
> ('Approved' or 'Rejected') and the manager's email from the authenticated
> admin. It calls the `HandleBookingRequest` stored procedure with the request
> ID, action, and manager ID. The stored procedure updates the request status,
> records who handled it and when. Then a database trigger fires and
> automatically updates the vehicle's availability — 'Unavailable' if approved,
> 'Available' if rejected."

---

### 🔷 MySQL & Database Design

**Q19: Explain the database schema.**

> "There are four tables. `customer` stores user accounts keyed by email, with
> name, hashed password, license ID, mobile, and date of birth. `manager`
> stores admin accounts keyed by email. `vehicles` stores the vehicle
> inventory keyed by license number, including name, model year, price per day,
> seating capacity, fuel type, image URL, overview text, the manager who added
> it, and an availability status. `booking_requests` is the main transaction
> table — it links a customer to a vehicle with date ranges, a UUID request ID,
> status (Pending/Approved/Rejected/Completed), and which manager acted on it."

**Q20: What are the foreign key relationships?**

> "`vehicles.manager_id` references `manager.email` — tracking which admin
> added each vehicle. `booking_requests.customer_id` references
> `customer.email`, `booking_requests.vehicle_id` references
> `vehicles.license_no`, and `booking_requests.manager_id` references
> `manager.email` (the admin who approved or rejected). These foreign keys
> enforce referential integrity so you cannot have a booking for a non-existent
> vehicle or customer."

**Q21: What stored procedures do you have and why?**

> "I have two. `BookVehicle` takes a customer email, vehicle license number,
> and from/to dates — it generates a UUID, inserts a booking request with
> 'Pending' status, and sets the vehicle availability to 'Waiting' all in one
> call. `HandleBookingRequest` takes a request ID, an action (Approved or
> Rejected), and the manager's email — it updates the request status, records
> the action type, manager, and timestamp. Using stored procedures ensures
> these multi-step operations are atomic."

**Q22: How does the database trigger work?**

> "The `booking_requests_AFTER_UPDATE` trigger fires whenever a row in
> `booking_requests` is updated. It checks the new `request_status` value: if
> it is 'Rejected', it sets the corresponding vehicle's availability back to
> 'Available'; if it is 'Approved', it sets it to 'Unavailable'. This keeps
> vehicle availability in sync with booking decisions without relying on the
> application layer."

**Q23: What is the scheduled event and what does it do?**

> "The `CheckCompletedBookings` event runs on a daily schedule. It finds all
> bookings where the `to_date` has passed and the status is still 'Approved',
> marks them as 'Completed', and sets the vehicle availability back to
> 'Available'. This automates the end-of-rental process so vehicles become
> bookable again without any manual admin action."

**Q24: Why did you use UUIDs for booking request IDs?**

> "UUIDs are globally unique and non-sequential. Sequential integer IDs would
> let someone guess other booking IDs by incrementing — for example, if my
> booking is #42, I could try to access #41 or #43. With UUIDs, the IDs are
> random 128-bit values, making enumeration attacks impractical."

**Q25: Why did you use email as the primary key for customer and manager?**

> "Emails are naturally unique per user and are the login credential, so they
> serve as a convenient primary key. It simplifies queries because I can join
> on the email directly without needing a separate user ID column. The downside
> is that if a user wants to change their email, it would require updating
> every foreign key reference — in a production system I would use an
> auto-increment or UUID primary key instead."

---

### 🔷 Authentication & Security

**Q26: How does authentication work end to end?**

> "When a user signs in, the server validates the email and password by
> comparing the bcrypt hash. On success, it creates a JWT containing the user's
> email and name, and sets it as an HTTP-only cookie. On every subsequent
> request, the browser sends this cookie automatically. My authentication
> middleware reads the cookie, verifies the JWT signature, and attaches the
> decoded payload to the request object. If verification fails, it returns 401
> or 403."

**Q27: Why did you store the JWT in an HTTP-only cookie instead of localStorage?**

> "HTTP-only cookies cannot be accessed by JavaScript, so even if an attacker
> injects a malicious script (XSS attack), they cannot steal the token.
> LocalStorage is vulnerable to XSS because any script on the page can read it.
> Cookies are also sent automatically with every request, so I do not need to
> manually attach the token to each Axios call."

**Q28: How do you separate user and admin authentication?**

> "I use two different JWT secrets — `userjwtkey` for users and `adminjwtkey`
> for admins — and two different cookie names — `access_token` and
> `admin_access_token`. Each set of routes has its own middleware that only
> accepts the matching secret. This means a user's token cannot pass admin
> middleware and vice versa. Even if someone intercepts a user token, they
> cannot use it to access admin routes."

**Q29: How does password hashing work in your system?**

> "During sign-up, I hash the password with `bcryptjs.hash(password, 10)` —
> the 10 is the salt rounds, meaning bcrypt performs 2^10 iterations of the
> hashing algorithm. This makes brute-force attacks computationally expensive.
> During sign-in, I use `bcryptjs.compare(inputPassword, storedHash)` which
> extracts the salt from the stored hash and re-hashes the input to see if
> they match."

**Q30: What security improvements would you make?**

> "First, move all secrets and database credentials to environment variables
> using `dotenv`. Second, add input validation and sanitization with
> `express-validator` to prevent SQL injection and XSS. Third, add rate
> limiting with `express-rate-limit` to prevent brute-force login attempts.
> Fourth, add CSRF protection since cookie-based auth is vulnerable to
> cross-site request forgery. Fifth, set token expiration times on JWTs —
> currently they do not expire."

---

### 🔷 REST API Design

**Q31: How did you design your REST API?**

> "I followed RESTful conventions — using HTTP methods to indicate the
> operation: GET for reading data, POST for creating, PUT for updating, and
> DELETE for removing. Each endpoint represents a resource — `/VehicleListings`
> for the vehicle collection, `/VehicleBooking/:id` for a specific vehicle
> booking, `/BookingRequest/:requestId` for a specific booking request. I use
> appropriate status codes: 200 for success, 201 for created, 401/403 for auth
> errors, 404 for not found, and 409 for conflicts like duplicate emails."

**Q32: How do the user-facing and admin-facing APIs differ?**

> "User endpoints (`/UserSignUp`, `/UserSignIn`, `/VehicleListings`,
> `/VehicleBooking/:id`, `/UserProfile`) use the `ClientDB` connection with
> limited database privileges. Admin endpoints (`/AdminLogin`, `/AddVehicle`,
> `/UpdateVehicle/:id`, `/Admin/:id`, `/BookingRequest`) use the `AdminDB`
> connection with full CRUD privileges. The middleware is also different —
> user routes use `userAuthenticateToken` and admin routes use
> `adminAuthenticateToken`."

**Q33: How does the dashboard statistics endpoint work?**

> "The GET `/AdminDashboard` endpoint runs three separate COUNT queries —
> total users from `customer`, total vehicles from `vehicles`, and total
> bookings from `booking_requests`. It returns a JSON object with
> `total_users`, `total_vehicles`, and `total_bookings`. The admin dashboard
> component displays these as summary cards at the top of the page."

---

### 🔷 Booking Workflow

**Q34: Explain the complete booking lifecycle.**

> "A booking goes through these states: First, the user selects a vehicle and
> submits dates — the stored procedure creates a 'Pending' request and sets
> the vehicle to 'Waiting'. Second, an admin reviews the request and either
> approves or rejects it. If approved, a trigger sets the vehicle to
> 'Unavailable'. If rejected, the trigger sets it back to 'Available'. Third,
> when the rental period ends (the `to_date` passes), a daily MySQL event
> automatically marks the booking as 'Completed' and makes the vehicle
> 'Available' again."

**Q35: How do you prevent double-booking of a vehicle?**

> "When a user submits a booking, the stored procedure immediately changes the
> vehicle's availability to 'Waiting'. The vehicle listings page only shows
> vehicles with 'Available' status, so other users will not see or be able to
> select a vehicle that is already being reviewed. This effectively prevents
> double-booking at the application level."

**Q36: What happens if an admin rejects a booking?**

> "When an admin clicks reject, the frontend sends a POST to
> `/BookingRequest/:requestId` with action 'Rejected'. The server calls the
> `HandleBookingRequest` stored procedure, which updates the request status to
> 'Rejected' and records the manager's email and timestamp. The
> `booking_requests_AFTER_UPDATE` trigger then fires and sets the vehicle's
> availability back to 'Available', so other users can book it."

**Q37: Why did you limit the booking duration to 7 days?**

> "The booking form sets the `max` attribute on the date inputs to 7 days from
> today. This is a business rule to keep the fleet available for more users and
> prevent long-term holds on vehicles. In a real system, this limit could be
> configurable per vehicle type or user tier."

---

### 🔷 Error Handling & Edge Cases

**Q38: How do you handle errors in the application?**

> "On the backend, each endpoint has a try-catch or callback error check. For
> example, if a database query fails, I return a 500 status with an error
> message. For specific cases like duplicate email on sign-up, I return 409. On
> the frontend, Axios errors are caught in `.catch()` blocks and displayed to
> the user via alert or by setting an error state variable that renders an
> error message in the UI."

**Q39: What happens if the database is down?**

> "If the MySQL connection fails, the Express server logs the connection error
> at startup. Subsequent API calls that try to query the database will receive
> an error in the callback, and the server returns a 500 status to the client.
> The React app displays an error message. To improve this, I would add a
> health check endpoint, connection retry logic, and connection pooling instead
> of a single persistent connection."

**Q40: How do you handle a user trying to access a protected page without signing in?**

> "The `ProtectedUserRoute` component checks the `isSignedIn` value from the
> auth context. If the user is not signed in, it uses React Router's
> `Navigate` component to redirect them to `/UserSignIn`. The same pattern
> exists for admin routes with `ProtectedAdminRoute` redirecting to
> `/AdminLogin`."

---

### 🔷 Scalability & Improvements

**Q41: What would you improve if you had more time?**

> "First, move all secrets and credentials to environment variables using
> `dotenv`. Second, add server-side input validation with `express-validator`.
> Third, write comprehensive unit and integration tests. Fourth, modularize the
> backend into separate route files, controllers, and a service layer. Fifth,
> add pagination for vehicle listings and booking history. Sixth, implement
> connection pooling in MySQL instead of single connections. Seventh, add image
> upload support instead of storing image URLs."

**Q42: How would you scale this application for production?**

> "First, I would containerize each service with Docker and use a reverse proxy
> like Nginx to serve the React builds and proxy API requests. Second, I would
> switch to MySQL connection pooling. Third, I would add Redis for session
> caching and rate limiting. Fourth, I would split the Express server into
> microservices or at least modular route files. Fifth, I would deploy the
> React apps as static builds behind a CDN. Sixth, I would add proper logging
> with Winston and monitoring with tools like Prometheus and Grafana."

**Q43: How would you add role-based access control (RBAC)?**

> "Currently I have two roles — user and admin — separated by different JWT
> secrets and middleware. To add more granular RBAC, I would add a `roles`
> table and a `user_roles` junction table in the database. The JWT payload
> would include the user's role. The middleware would check if the user's role
> has permission for the requested resource. This way I could add roles like
> 'fleet manager', 'regional admin', or 'super admin' without changing the
> auth flow."

**Q44: How would you add real-time notifications?**

> "I would use **WebSockets** with a library like Socket.io. When an admin
> approves or rejects a booking, the server would emit an event to the user's
> socket connection. On the React side, I would listen for that event and
> display a notification toast. This would give users instant feedback instead
> of having to refresh their profile page."

---

### 🔷 Challenges & Learnings

**Q45: What challenges did you face during development?**

> "The biggest challenge was keeping vehicle availability in sync with booking
> status. Initially, I handled both the booking insert and the vehicle status
> update in separate Express queries. If the server crashed between those two
> queries, the data would be inconsistent. I solved this by moving the logic
> into MySQL stored procedures and triggers, which guarantee atomicity.
> Another challenge was managing authentication across two separate React apps
> talking to the same API — I solved it by using separate JWT secrets and
> cookie names."

**Q46: What did you learn from building this project?**

> "I learned the importance of pushing business logic to the database layer
> when data consistency is critical — triggers and stored procedures are
> powerful tools for this. I also deepened my understanding of JWT-based
> authentication and the security tradeoffs between cookie and localStorage
> storage. On the React side, I got comfortable with the Context API for
> global state management and React Router v6's new API for route protection."

**Q47: If you were to start over, what would you do differently?**

> "I would set up the project with TypeScript for type safety on both frontend
> and backend. I would use environment variables from day one instead of
> hardcoding secrets. I would structure the Express server with a proper MVC
> pattern — separate route, controller, and model files. And I would write
> tests alongside the features rather than leaving them for later."

---

### 🔷 Code-Specific Deep Dives

**Q48: Explain how the `AuthContext` works in the client app.**

> "The `AuthContext` is a React context created with `createContext()`. The
> `AuthProvider` component wraps the app and provides a `value` object
> containing `isSignedIn`, `userEmail`, `userName`, a `UserSignIn` function,
> and a `UserSignOut` function. The `UserSignIn` function sends a POST to
> `/UserSignIn`, and on success sets the state and saves to localStorage so
> the session persists across page refreshes. Child components access these
> values via the `useContext(AuthContext)` hook."

**Q49: How does the admin `BookingRequest` component render the dashboard?**

> "The component has two `useEffect` hooks — one fetches dashboard stats from
> `/AdminDashboard` (total users, vehicles, bookings) and another fetches all
> booking requests from `/BookingRequest`. It renders three stat cards at the
> top showing the counts, then a table of booking requests with columns for
> request ID, customer email, vehicle name, dates, status, and action buttons.
> Pending requests show 'Approve' and 'Reject' buttons. Each row is
> color-coded by status: green for Approved, red for Rejected, yellow for
> Pending, and gray for Completed."

**Q50: Walk me through what happens when a user clicks 'Book Now'.**

> "First, the user clicks 'Book Now' on a vehicle card in `VehicleListings`,
> which navigates to `/VehicleBooking/:license_no`. The `VehicleBooking`
> component extracts the ID from the URL with `useParams()`, fetches the
> vehicle details via GET `/VehicleBooking/:id`, and displays them with a date
> form. The user picks dates and clicks submit. The component sends a POST to
> `/VehicleBooking/:id` with `from_date` and `to_date`. The server's endpoint
> reads the authenticated user's email from the JWT, then calls the
> `BookVehicle` stored procedure with the customer email, vehicle license
> number, and dates. The procedure inserts a booking request and sets the
> vehicle to 'Waiting'. The server returns success, and the component
> navigates to `/UserProfile` where the user can see the pending booking."

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
