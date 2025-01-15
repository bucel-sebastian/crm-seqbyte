import { BrowserRouter, Routes, Route } from "react-router";
import PublicRoute from "./PublicRoute";
import AuthLayout from "./layout/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PasswordReset from "./pages/auth/PasswordReset";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import InvoicesViewAll from "./pages/dashboard/invoices/InvoicesViewAll";
import { AuthProvider } from "./context/AuthContext";
import IndexRoute from "./IndexRoute";
import NotFound from "./pages/NotFound";
import CompaniesViewAll from "./pages/dashboard/companies/CompaniesViewAll";
import CompaniesNew from "./pages/dashboard/companies/CompaniesNew";
import CompaniesEdit from "./pages/dashboard/companies/CompaniesEdit";
import InvoiceSeriesViewAll from "./pages/dashboard/invoices/series/InvoiceSeriesViewAll";
import InvoicesEdit from "./pages/dashboard/invoices/InvoicesEdit";
import InvoicesNew from "./pages/dashboard/invoices/InvoicesNew";
import InvoicesPreview from "./pages/dashboard/invoices/InvoicesPreview";
import InvoiceSeriesNew from "./pages/dashboard/invoices/series/InvoiceSeriesNew";
import InvoiceSeriesEdit from "./pages/dashboard/invoices/series/InvoiceSeriesEdit";

import { DashboardLayoutProvider } from "./context/DashboardLayoutContext";
import ClientsViewAll from "./pages/dashboard/clients/ClientsViewAll";
import ClientsNew from "./pages/dashboard/clients/ClientsNew";
import ClientsEdit from "./pages/dashboard/clients/ClientsEdit";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexRoute />} />

            {/* Auth Routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <AuthLayout />
                </PublicRoute>
              }
            >
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="forgot-password/reset" element={<PasswordReset />} />
            </Route>

            {/* Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayoutProvider>
                    <DashboardLayout />
                  </DashboardLayoutProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="invoices" element={<InvoicesViewAll />} />

              <Route path="companies">
                <Route index element={<CompaniesViewAll />} />
                <Route path="new" element={<CompaniesNew />} />
                <Route path="edit/:id" element={<CompaniesEdit />} />
              </Route>

              <Route path="clients">
                <Route index element={<ClientsViewAll />} />
                <Route path="new" element={<ClientsNew />} />
                <Route path="edit/:id" element={<ClientsEdit />} />
              </Route>

              <Route path="invoices">
                <Route index element={<InvoicesViewAll />} />
                <Route path="new" element={<InvoicesNew />} />
                <Route path="preview" element={<InvoicesPreview />} />
                <Route path="edit/:id" element={<InvoicesEdit />} />

                <Route path="series">
                  <Route index element={<InvoiceSeriesViewAll />} />
                  <Route path="new" element={<InvoiceSeriesNew />} />
                  <Route path="edit/:id" element={<InvoiceSeriesEdit />} />
                </Route>
              </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
