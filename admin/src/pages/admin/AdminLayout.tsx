import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    MessageCircle,
    Headphones,
    Search,
    CreditCard,
    Menu,
    X,
    Settings,
    LogOut
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Separator } from '../../components/ui/separator';
import { deleteCookie, ADMIN_TOKEN_COOKIE, ADMIN_REFRESH_TOKEN_COOKIE } from '../../lib/cookie';

interface MenuItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
}

const menuItems: MenuItem[] = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', label: '사용자 관리', icon: Users, path: '/admin/users' },
    { id: 'customer-support', label: '고객상담', icon: MessageCircle, path: '/admin/customer-support' },
    { id: 'operation-support', label: '운영상담', icon: Headphones, path: '/admin/operation-support' },
    { id: 'member-search', label: '회원조회', icon: Search, path: '/admin/member-search' },
    { id: 'refunds', label: '환불처리', icon: CreditCard, path: '/admin/refunds' },
];

export const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuClick = (path: string) => {
        navigate(path);
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        // 로컬 스토리지에서 토큰 및 사용자 정보 제거
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');

        // 로그인 페이지로 이동
        navigate('/admin/login');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="h-screen bg-gray-50 flex">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
                <div className="flex items-center justify-between h-16 px-6 border-b">
                    <h1 className="text-xl font-bold text-gray-900">관리자 패널</h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Button
                                key={item.id}
                                variant={isActive(item.path) ? "default" : "ghost"}
                                className={`w-full justify-start ${
                                    isActive(item.path)
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => handleMenuClick(item.path)}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Button>
                        );
                    })}
                </nav>

                <div className="border-t p-4">
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-900">관리자</p>
                        <p className="text-xs text-gray-500">admin@company.com</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start text-gray-700">
                            <Settings className="mr-3 h-4 w-4" />
                            설정
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            로그아웃
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:ml-0">
                {/* Top bar */}
                <header className="bg-white shadow-sm border-b h-16 flex-shrink-0">
                    <div className="flex items-center justify-between h-full px-4 lg:px-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                })}
              </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};