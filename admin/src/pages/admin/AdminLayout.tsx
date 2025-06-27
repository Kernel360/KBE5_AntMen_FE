import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import {
    LayoutDashboard,
    Users,
    MessageCircle,
    Headphones,
    Receipt,
    LogOut,
    Menu,
    X,
    BarChart2,
    GitBranch,
    Settings
} from 'lucide-react';

interface MenuItem {
    id: string;
    label: string;
    path: string;
    icon: React.ElementType;
    subItems?: {
        id: string;
        label: string;
        path: string;
        icon: React.ElementType;
    }[];
}

const menuItems: MenuItem[] = [
    {
        id: 'dashboard',
        label: '대시보드',
        path: '/admin/dashboard',
        icon: LayoutDashboard
    },
    {
        id: 'users',
        label: '회원관리',
        path: '/admin/users',
        icon: Users,
        subItems: [
            {
                id: 'users-waiting',
                label: '승인 대기 매니저',
                path: '/admin/users/waiting',
                icon: Users
            },
            {
                id: 'users-customer',
                label: '수요자',
                path: '/admin/users/customer',
                icon: Users
            },
            {
                id: 'users-manager',
                label: '매니저',
                path: '/admin/users/manager',
                icon: Users
            },
            {
                id: 'users-blacklist',
                label: '블랙리스트 관리',
                path: '/admin/users/blacklist',
                icon: Users
            }
        ]
    },
    {
        id: 'support',
        label: '문의관리',
        path: '/admin/support',
        icon: MessageCircle,
        subItems: [
            {
                id: 'customer-support',
                label: '고객문의',
                path: '/admin/support/customer',
                icon: MessageCircle
            },
            {
                id: 'manager-support',
                label: '매니저문의',
                path: '/admin/support/manager',
                icon: Headphones
            }
        ]
    },
    {
        id: 'service',
        label: '서비스 관리',
        path: '/admin/service',
        icon: Settings
    },
    {
        id: 'matching',
        label: '매칭관리',
        path: '/admin/matching',
        icon: GitBranch,
        subItems: [
            {
                id: 'manual-matching',
                label: '수동매칭',
                path: '/admin/matching/manual',
                icon: GitBranch
            },
            {
                id: 'algorithm-review',
                label: '알고리즘 검토',
                path: '/admin/matching/algorithm',
                icon: GitBranch
            },
            {
                id: 'algorithm-recommend',
                label: '추천 기준 설정',
                path: '/admin/matching/recommend',
                icon: GitBranch
            }
        ]
    },
    {
        id: 'finance',
        label: '재무관리',
        path: '/admin/finance',
        icon: Receipt,
        subItems: [
            { id: 'finance-sales', label: '매출분석', path: '/admin/finance/sales', icon: Receipt },
            { id: 'finance-settlement', label: '매니저 정산', path: '/admin/finance/settlement', icon: Receipt },
            { id: 'finance-refund', label: '환불관리', path: '/admin/finance/refund', icon: Receipt }
        ]
    },
    {
        id: 'statistics',
        label: '통계',
        path: '/admin/statistics',
        icon: BarChart2,
        subItems: [
            { id: 'stat-matching', label: '매칭률', path: '/admin/statistics/matching', icon: BarChart2 },
            { id: 'stat-reservation', label: '예약률', path: '/admin/statistics/reservation', icon: BarChart2 },
            { id: 'stat-satisfaction', label: '만족도', path: '/admin/statistics/satisfaction', icon: BarChart2 },
            { id: 'stat-refund', label: '환불 분석', path: '/admin/statistics/refund', icon: BarChart2 }
        ]
    }
];

export const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const handleMenuClick = (item: MenuItem) => {
        // 서비스 관리 메뉴는 준비중
        if (item.id === 'service') {
            alert('서비스 관리 기능은 준비 중입니다.');
            return;
        }
        
        if (item.subItems) {
            setExpandedMenu(expandedMenu === item.id ? null : item.id);
            if (item.subItems.length > 0) {
                navigate(item.subItems[0].path);
            } else {
                navigate(item.path);
            }
        } else {
            navigate(item.path);
        }
    };

    const handleSubMenuClick = (path: string) => {
        navigate(path);
    };

    const handleLogout = () => {
        // 로그아웃 로직 구현
        navigate('/admin/login');
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Top Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b h-16 flex-shrink-0">
                <div className="flex items-center justify-between h-full px-4 lg:px-6">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        <h1 className="text-xl font-bold text-gray-900 ml-4">AntWorker 관리자</h1>
                    </div>
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

            <div className="flex-1 flex overflow-hidden pt-16">
                {/* 오버레이: 모바일에서 사이드바 열렸을 때만 헤더 아래에서 노출 */}
                {isSidebarOpen && (
                    <div
                        className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-black bg-opacity-30 lg:hidden transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
                {/* Sidebar: 헤더 아래에서만 열림, 모바일에서는 top-16, 데스크탑에서는 static */}
                <div
                    className={`fixed top-16 lg:top-0 left-0 z-50 w-4/5 max-w-xs bg-white border-r transform transition-transform duration-200 ease-in-out ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:static lg:w-64 lg:max-w-none lg:translate-x-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]`}
                >
                    <div className="h-full flex flex-col">
                        {/* Menu Items */}
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const hasSubItems = item.subItems && item.subItems.length > 0;
                                const isExpanded = expandedMenu === item.id;
                                const isSubMenuActive = hasSubItems && item.subItems!.some(subItem => isActive(subItem.path));

                                return (
                                    <div key={item.id}>
                                        <Button
                                            variant={isActive(item.path) || isSubMenuActive ? "default" : "ghost"}
                                            className={`w-full justify-start ${
                                                isActive(item.path) || isSubMenuActive
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                            onClick={() => handleMenuClick(item)}
                                        >
                                            <Icon className="mr-3 h-5 w-5" />
                                            {item.label}
                                        </Button>
                                        {hasSubItems && isExpanded && (
                                            <div className="bg-gray-50 rounded-b-lg w-full">
                                                {item.subItems!.map((subItem, idx) => (
                                                    <Button
                                                        key={subItem.id}
                                                        variant={isActive(subItem.path) ? "default" : "ghost"}
                                                        className={`w-full justify-start ${
                                                            isActive(subItem.path)
                                                                ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                        } ${idx === 0 ? 'rounded-t-lg' : ''} ${idx === item.subItems!.length - 1 ? 'rounded-b-lg' : ''} p-0 h-12 pl-12`}
                                                        style={{ borderTop: idx !== 0 ? 'none' : undefined }}
                                                        onClick={() => handleSubMenuClick(subItem.path)}
                                                    >
                                                        {subItem.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Logout Button */}
                        <div className="p-4 border-t">
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-3 h-5 w-5" />
                                로그아웃
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        <Card className="p-8 bg-white shadow rounded-lg">
                            <Outlet />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};