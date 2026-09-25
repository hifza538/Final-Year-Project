# LocalBites

LocalBites is a multi-role food-delivery platform for customers, restaurants, delivery riders, and administrators.

## Features

- Customer restaurant discovery, menus, cart, checkout, orders, addresses, and reviews
- Vendor restaurant profile, menu, variants, add-ons, and order management
- Delivery rider availability, order acceptance, and delivery status updates
- Admin user approvals, order monitoring, categories, cuisines, reports, and settings
- JWT authentication with role-based authorization
- Realtime order notifications with Socket.IO
- Cloudinary image uploads
- Email verification, password reset, and platform notifications
- Location search, maps, and restaurant delivery-radius filtering
- Automatic rejection of stale pending orders

## Project Structure

```text
localbite/
├── backend/             # Express API, MongoDB models, jobs, and Socket.IO
├── customer-frontend/   # Customer application
├── vendor-frontend/     # Vendor application
├── delivery-frontend/   # Delivery rider application
├── admin-frontend/      # Admin application
└── README.md
```

Each application has its own `package.json`, dependencies, and development scripts.

## Technology Stack

### Frontend

- React and Vite
- React Router
- Axios
- Tailwind CSS
- React Hook Form and Zod
- Leaflet and React Leaflet
- Socket.IO client

### Backend

- Node.js and Express
- MongoDB and Mongoose
- JSON Web Tokens and bcryptjs
- Socket.IO
- Cloudinary and Multer
- Nodemailer
- node-cron

## Requirements

- Node.js 18 or newer
- MongoDB
- Cloudinary account
- Gmail SMTP credentials for email features

## Installation

Install dependencies separately in each application:

```powershell
cd backend
npm install

cd ..\customer-frontend
npm install

cd ..\vendor-frontend
npm install

cd ..\delivery-frontend
npm install

cd ..\admin-frontend
npm install
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb_connection_string
JWT_SECRET=long_random_secret

CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=secret

EMAIL_USER=email@gmail.com
EMAIL_PASS=gmail_app_password
EMAIL_SUPPORT_TO=support@example.com

CUSTOMER_FRONTEND_URL=http://localhost:5174
VENDOR_FRONTEND_URL=http://localhost:5173
DELIVERY_FRONTEND_URL=http://localhost:5175
CLIENT_URL=http://localhost:5174

ADMIN_EMAIL=admin@localbites.com
ADMIN_PASSWORD=use_a_strong_password
```

## Run Locally

Run each application in a separate terminal:

```powershell
# Backend
cd backend
npm run dev

# Vendor frontend
cd vendor-frontend
npm run dev

# Customer frontend
cd customer-frontend
npm run dev

# Delivery frontend
cd delivery-frontend
npm run dev

# Admin frontend
cd admin-frontend
npm run dev
```

Local ports:

- Backend: `5000`
- Vendor: `5173`
- Customer: `5174`
- Delivery: `5175`
- Admin: `5176`

## Production Builds

```powershell
cd customer-frontend; npm run build
cd ..\vendor-frontend; npm run build
cd ..\delivery-frontend; npm run build
cd ..\admin-frontend; npm run build
```

## API and Data Flow

The frontends communicate with the Express API through Axios. The backend uses Mongoose models for MongoDB access and validates authentication, roles, ownership, menu availability, and order prices on the server.

The main order flow is:

```text
Pending -> Accepted -> Preparing -> Ready -> OutForDelivery -> Completed
Pending -> Rejected
```

The delivery process includes `Accepted`, `ArrivedAtRestaurant`, `PickedUp`, `OnTheWay`, and `Delivered` stages. Socket.IO sends order updates to the relevant customer, vendor, rider, or role room.

## Important Backend Directories

- `backend/routes`: API route definitions
- `backend/controllers`: application business logic
- `backend/models`: Mongoose schemas
- `backend/middleware`: authentication, authorization, and error handling
- `backend/config`: database and Cloudinary configuration
- `backend/jobs`: scheduled background tasks
- `backend/utils`: shared pricing, email, distance, and token utilities

## Security

- Passwords are hashed with bcrypt.
- JWT tokens protect authenticated API requests.
- Backend middleware enforces user roles and account status.
- Verification and password-reset tokens are hashed and expire.
- Order totals are recalculated on the backend.
- Uploads have file type and size validation.
- Sensitive environment variables are excluded by `.gitignore`.

