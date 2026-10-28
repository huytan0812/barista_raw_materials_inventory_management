# Frontend: Barista Raw Materials Inventory

React single-page app for the inventory system described in the [root README](../../README.md).

## Stack

React 19, Vite 7, Ant Design 5 (+ @ant-design/charts), React Router 7, Axios.

## Configuration

The backend URL comes from `VITE_API_BASE_URL` (default `http://localhost:8080`):

```bash
cp .env.example .env.local
```

All API clients and image URLs are built from `src/services/apiConfig.js`.

## Scripts

```bash
npm install
npm run dev       # dev server on http://localhost:5173
npm run build     # production build into dist/
npm run lint      # ESLint
npm run preview   # serve the production build locally
```

## Structure

```
src/
  pages/        route-level screens (dashboard, import, export, reports, accounts...)
  components/   feature components grouped by domain (import/, export/, product/, vendor/...)
  services/     one axios client per backend resource, apiConfig.js, apiErrors.js
  contexts/     auth (token + user in localStorage), layout and message contexts
```

Requests send the JWT as a bearer token; a 401 response logs the user out (`services/AuthorizationErrorService.js`).
