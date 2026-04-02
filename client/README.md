# TruckShare Frontend

A React + Vite + TailwindCSS frontend for the TruckShare truck-space sharing platform.

## Stack

- **React 18** + **Vite 5**
- **TailwindCSS 3** for styling
- **React Query (TanStack)** for server state caching
- **React Hook Form + Yup** for form validation
- **React Router v6** for routing
- **Leaflet** for live GPS maps
- **Axios** for API calls

## Getting Started

```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

The app runs on `http://localhost:5173` and proxies API calls to `http://localhost:9191`.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:9191` | Backend API URL |
| `VITE_WS_URL` | `ws://localhost:9191/ws` | WebSocket URL |
| `VITE_API_TIMEOUT` | `30000` | Request timeout (ms) |

## User Roles

| Role | Default Route | Capabilities |
|---|---|---|
| `TRUCK_OWNER` | `/dashboard/owner` | Add/manage trucks, view bookings, acknowledge payments |
| `BUSINESS_USER` | `/dashboard/business` | Create shipments, book trucks, track deliveries |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Auth/
│   ├── Booking/
│   ├── Common/       # Layout, Header, Sidebar, Modal, Toast…
│   ├── Dashboard/
│   ├── Shipment/
│   ├── Tracking/
│   └── Truck/
├── context/          # AuthContext, UIContext
├── hooks/            # useAuth, useTruck, useShipment, useBooking…
├── pages/            # Route-level page components
├── services/         # Axios API service layer
└── utils/            # Constants, formatters, validators
```

## Key Workflows

1. **Register / Login** → role-based redirect
2. **Truck Owner**: Add truck → receive bookings → acknowledge payment
3. **Business User**: Create shipment → find matching trucks → book → track live GPS
4. **Split shipments**: Select multiple trucks → allocate capacity per truck → confirm multiple bookings
