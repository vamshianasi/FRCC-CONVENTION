# FRCC CONVENTIONS — Convention Hall Booking Website

A multi-page booking web app for convention/function halls. This module covers **only** the convention hall booking flow.

## Tech Stack
- **Frontend:** React + Vite, React Router, Tailwind CSS (Playfair Display / Inter, navy + gold)
- **Backend:** Node.js + Express, JSON-file store (kept behind `server/db.js` so it can be swapped for SQLite), bcryptjs password hashing, JWT auth
- All wizard steps are separate routes; auth-gated with redirects

## Setup
```bash
# 1. Backend (http://localhost:5000)
cd server
npm install
npm start

# 2. Frontend (http://localhost:5173) — in a second terminal
cd client
npm install
npm run dev
```
Then open http://localhost:5173.

## End-to-end flow
1. Sign Up → Sign In (redirects to `/home`)
2. **Book Convention Hall** → Step 1 Hall → Step 2 Date/Time (booked slots shown & blocked) → Step 3 Details (guest count vs capacity, live price + GST) → Step 4 Payment (UPI verify → confirm → Pay) → Step 5 Confirmation (PDF receipt, UPI ref)
3. **My Bookings** → filter Upcoming/Completed/Cancelled, View Details, Cancel (>48h only, enforced on server too; 100% refund, booking becomes CANCELLED, slot freed, notification added)

## Key implementation notes
- UPI verification lives in **`server/services/verifyUPI.js`** (mock: simulated delay + sample names). To go live, replace only that function with a Razorpay/Cashfree VPA validation call — see the TODO comment in the file.
- UPI ID is validated with `^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$`; only a masked UPI ID (e.g. `ra***@okhdfc`) and the transaction ref are stored.
- Availability is checked twice: when picking the slot (client + server) and again at payment time (server) — no double booking.
- Cancellation window (`48h`) and refund percentage (`100%`) are configurable in `server/routes/bookings.js`.
- Booking wizard state persists in `sessionStorage`, so a refresh keeps your progress.

## Mocked parts
- `verifyUPI` (simulated gateway response)
- Payments (no real charge); receipt PDF is generated client-side with jsPDF
- Forgot-password returns a canned message (no email)
- Hall photos are Unsplash placeholders with local SVG fallbacks in `client/public/images/halls/`

## Project structure
```
server/
  index.js  db.js  middleware/auth.js
  routes/ (auth.js, bookings.js, misc.js)
  services/verifyUPI.js
client/src/
  pages/  components/  context/ (AuthContext, BookingContext)
  services/ (api.js, upi.js)  utils/format.js
```
