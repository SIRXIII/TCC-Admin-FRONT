# TCC Admin Dashboard (Frontend)

Admin dashboard for **Travel Clothing Club (TCC)** — a platform connecting travelers with local clothing partners and delivery riders. This frontend provides tools for managing travelers, partners, riders, products, orders, refunds, and platform settings.

## Tech Stack

- **React 19** with Vite 7
- **Tailwind CSS 4** for styling
- **React Router 7** for client-side routing
- **TanStack React Query** for server state management and data fetching
- **Axios** for HTTP requests
- **Chart.js / react-chartjs-2** for dashboard analytics
- **React Toastify** for notifications
- **Lucide React / React Icons** for iconography

## Backend Connection

This app connects to the **TCC-Admin-BACK** Laravel API. The API base URL is configured via environment variable:

```
VITE_API_URL=http://localhost:8000/api
```

If `VITE_API_URL` is not set, it defaults to `http://localhost:8000/api`. Authentication is handled via Bearer tokens stored in `localStorage`.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or compatible package manager
- A running instance of [TCC-Admin-BACK](../TCC-Admin-BACK) (Laravel API)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd TCC-Admin-FRONT

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend API URL

# Start the development server
npm run dev
```

### Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR     |
| `npm run build`   | Build for production                |
| `npm run preview` | Preview the production build        |
| `npm run lint`    | Run ESLint                          |

## Project Structure

```
src/
├── assets/          # Images, SVGs, and static assets
├── components/      # Shared UI components (Sidebar, Header, Pagination, etc.)
├── context/         # React context providers (AuthContext)
├── data/            # Static/mock data files
├── hooks/           # Custom React Query hooks (useDashboard, usePartners, useTravelers)
├── Layouts/         # Layout components (MainLayout)
├── pages/           # Route-level page components
│   ├── Dashboard.jsx
│   ├── Travelers/
│   ├── Partners/
│   ├── Riders/
│   ├── Products/
│   ├── Orders/
│   └── ...
├── services/        # API service modules (api.js, dashboardService, etc.)
├── App.jsx          # Root component with route definitions
└── main.jsx         # Application entry point
```

## Related Repositories

- **TCC-Admin-BACK** — Laravel backend API powering this dashboard
