import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

function LandingPagePlaceholder() {
  return <div className="p-8 text-center">Landing Page</div>;
}

function LoginPagePlaceholder() {
  return <div className="p-8 text-center">Login Page</div>;
}

function DashboardPagePlaceholder() {
  return <div className="p-8 text-center">Dashboard</div>;
}

function NotFoundPagePlaceholder() {
  return <div className="p-8 text-center">404 - Page Not Found</div>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPagePlaceholder />} />
        <Route path="/login" element={<LoginPagePlaceholder />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPagePlaceholder />} />
        </Route>

        <Route path="*" element={<NotFoundPagePlaceholder />} />
      </Routes>
    </BrowserRouter>
  );
}