# Customer FE

Customer information frontend application built.

**Requires Backend:** This frontend requires the [customer-be](https://github.com/ymthitipong/customer-be) backend to be running.

Make sure you have the backend running before starting the frontend. The frontend will connect to the backend API (default: `http://localhost:8080`)

## Stack

- Node.js
- Next.js
- React
- Tailwind CSS
- TypeScript

## Requirements

- Node.js version 20
- Docker & Docker Compose (if running with Docker)

---

## Setup & Run

### Local

#### Setup
```bash
npm install
```

#### Run
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Docker

#### Run
```bash
# Development
docker-compose up dev

# Production
docker-compose up prod
```

---

## Pages

### `/login`
- Email/Password login
- Google login (mock implementation, redirects to `/customers`)

### `/customers`
- Search customers with options (name, company, salesperson)
- Sort options (name, total spend, purchases, status, last activity)
- Customer list table with pagination
- Open the detail of a customer in new tab

### `/customers/:id`
- Customer details (ID, name, company, email, phone, status, etc.)
- Recent activity timeline

**Default behavior:** Any other path (except prefix `/login` or `/customers`) will redirect to `/login`

