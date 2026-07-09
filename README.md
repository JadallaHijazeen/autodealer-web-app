# autodealer-web-app
Full-stack car rental platform — custom RESTful PHP API with PDO, transactional bookings, password hashing, and an admin dashboard (HTML/CSS/JS + MySQL)
# AutoDealer — Car Rental Web Application

Full-stack car rental platform: customers browse and rent vehicles, admins manage the fleet and rentals through a dedicated dashboard. Built with a custom RESTful PHP API over MySQL — no frameworks, no ORM.

## Features

**Customer side**
- Browse available cars with color filtering and detail modals
- Sign up / login with server-side validation
- Rent a car for 1–30 days with live cost summary and rental receipt
- Contact form

**Admin dashboard**
- Overview of all cars, users, and rentals (with per-user rental counts)
- Rental detail view with cost breakdown (subtotal, tax, insurance)
- Complete active rentals — car automatically returns to the available pool
- Toggle car availability, with a guard preventing release while a rental is active

## Security & data integrity

- **Prepared statements (PDO)** for every query — no string-built SQL
- **Password hashing** with PHP's `password_hash()` / `password_verify()` (bcrypt)
- **Transactional rentals**: renting a car inserts the rental record and flips availability inside a single transaction with rollback on failure — no double-bookings, no orphaned states
- Input validation on every endpoint (email format, value ranges, date format)
- Passwords are never returned in API responses

## API endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `get_cars.php` | GET | List available cars |
| `signup.php` | POST | Register (validated, hashed) |
| `login.php` | POST | Authenticate |
| `rent_car.php` | POST | Create rental (transactional) |
| `admin_get_cars.php` | GET | All cars incl. rented |
| `admin_get_users.php` | GET | Users with rental stats |
| `admin_get_rentals.php` | GET | All rentals with joined customer/car info |
| `admin_get_rental_details.php` | GET/POST | Single rental + cost breakdown |
| `admin_complete_rental.php` | POST | Complete rental, release car |
| `admin_update_car.php` | POST | Toggle availability (guarded) |

All endpoints return uniform JSON (`success`, `message`, payload) via a shared response helper.

## Tech Stack

| Layer    | Technology                       |
|----------|----------------------------------|
| Frontend | HTML, CSS, vanilla JavaScript    |
| Backend  | PHP (PDO)                        |
| Database | MySQL                            |

## Setup

1. Create the database and sample data:
   ```bash
   mysql -u root -p < setup.sql
   ```
2. Adjust credentials in `config.php` if needed
3. Serve the project with PHP's built-in server or XAMPP/Apache:
   ```bash
   php -S localhost:8000
   ```
4. Open `index.html` — demo login: `demo@example.com` / `password123`

## Screenshots

<!-- Add: homepage with car grid, rental modal, admin dashboard -->

## Possible improvements

- Session-based auth (server-side sessions or JWT) instead of client-stored user state
- Rate limiting on login attempts
- Date-range availability instead of a single boolean flag
