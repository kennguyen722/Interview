import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Shell } from "./components/Shell";
import { CreateOrderPage } from "./pages/CreateOrderPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { LookupOrderPage } from "./pages/LookupOrderPage";
import { TopCustomersPage } from "./pages/TopCustomersPage";

const AppShell = (): JSX.Element => (
  <ProtectedRoute>
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/orders/new" element={<CreateOrderPage />} />
        <Route path="/orders/lookup" element={<LookupOrderPage />} />
        <Route path="/reports/top-customers" element={<TopCustomersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  </ProtectedRoute>
);

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<AppShell />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
