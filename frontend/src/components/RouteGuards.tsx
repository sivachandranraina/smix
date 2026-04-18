import { Navigate } from 'react-router-dom';

/** Wraps routes that should only be accessible when NOT logged in.
 *  If a token exists in localStorage, redirects to /dashboard. */
export function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/** Wraps routes that require authentication.
 *  If no token exists, redirects to /login. */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
