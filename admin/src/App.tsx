import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { UsersCustomer } from './pages/admin/UsersCustomer';
import { UsersManager } from './pages/admin/UsersManager';
import { UsersWaiting } from './pages/admin/UsersWaiting';
import { CustomerSupport } from './pages/admin/CustomerSupport';
import { ManagerSupport } from './pages/admin/ManagerSupport';
import { FinanceSales } from './pages/admin/FinanceSales';
import { FinanceSettlement } from './pages/admin/FinanceSettlement';
import { FinanceRefund } from './pages/admin/FinanceRefund';
import { ManualMatching } from './pages/admin/ManualMatching';
import { MatchingAlgorithm } from './pages/admin/MatchingAlgorithm';
import { RecommendMatching } from './pages/admin/RecommendMatching';
import { StatMatching } from './pages/admin/StatMatching';
import { StatReservation } from './pages/admin/StatReservation';
import { StatSatisfaction } from './pages/admin/StatSatisfaction';
import { StatRefund } from './pages/admin/StatRefund';
import UsersBlacklist from './pages/admin/UsersBlacklist';
import { DollarSign, GitBranch, LayoutDashboard, Users, MessageSquare, BarChart } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const menuItems = [
    {
        title: '대시보드',
        icon: <LayoutDashboard className="w-4 h-4" />,
        path: '/admin/dashboard'
    },
    {
        title: '회원관리',
        icon: <Users className="w-4 h-4" />,
        submenu: [
            { title: '수요자', path: '/admin/users/customer' },
            { title: '매니저', path: '/admin/users/manager' },
            { title: '승인 대기 매니저', path: '/admin/users/waiting' }
        ]
    },
    {
        title: '문의관리',
        icon: <MessageSquare className="w-4 h-4" />,
        submenu: [
            { title: '고객문의', path: '/admin/support/customer' },
            { title: '매니저문의', path: '/admin/support/manager' }
        ]
    },
    {
        title: '통계',
        icon: <BarChart className="w-4 h-4" />,
        submenu: [
            { title: '매칭률', path: '/admin/statistics/matching' },
            { title: '예약률', path: '/admin/statistics/reservation' },
            { title: '만족도', path: '/admin/statistics/satisfaction' },
            { title: '환불 분석', path: '/admin/statistics/refund' }
        ]
    },
    {
        title: '재무관리',
        icon: <DollarSign className="w-4 h-4" />,
        submenu: [
            { title: '매출분석', path: '/admin/finance/sales' },
            { title: '매니저 정산', path: '/admin/finance/settlement' },
            { title: '환불관리', path: '/admin/finance/refund' }
        ]
    },
    {
        title: '매칭 알고리즘',
        icon: <GitBranch className="w-4 h-4" />,
        path: '/admin/algorithm'
    }
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users/customer" element={<UsersCustomer />} />
              <Route path="users/manager" element={<UsersManager />} />
              <Route path="users/waiting" element={<UsersWaiting />} />
              <Route path="users/blacklist" element={<UsersBlacklist />} />
              <Route path="support/customer" element={<CustomerSupport />} />
              <Route path="support/manager" element={<ManagerSupport />} />
              <Route path="matching/manual" element={<ManualMatching />} />
              <Route path="matching/algorithm" element={<MatchingAlgorithm />} />
              <Route path="matching/recommend" element={<RecommendMatching />} />
              <Route path="statistics" element={<Navigate to="/admin/statistics/matching" replace />} />
              <Route path="statistics/matching" element={<StatMatching />} />
              <Route path="statistics/reservation" element={<StatReservation />} />
              <Route path="statistics/satisfaction" element={<StatSatisfaction />} />
              <Route path="statistics/refund" element={<StatRefund />} />
              <Route path="finance/sales" element={<FinanceSales />} />
              <Route path="finance/settlement" element={<FinanceSettlement />} />
              <Route path="finance/refund" element={<FinanceRefund />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;