import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { Users } from './pages/admin/Users';
import { CustomerSupport } from './pages/admin/CustomerSupport';
import { OperationSupport } from './pages/admin/OperationSupport';
import { MemberSearch } from './pages/admin/MemberSearch';
import { Refunds } from './pages/admin/Refunds';

function App() {
  return (
      <Router>
        <div className="App">
          <Routes>
            {/* Login route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Redirect root to admin dashboard */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="customer-support" element={<CustomerSupport />} />
              <Route path="operation-support" element={<OperationSupport />} />
              <Route path="member-search" element={<MemberSearch />} />
              <Route path="refunds" element={<Refunds />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;