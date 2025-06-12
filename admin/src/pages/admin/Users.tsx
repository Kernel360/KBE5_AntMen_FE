import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../../components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import {
    Search,
    UserPlus,
    MoreHorizontal,
    Edit,
    Trash2,
    Shield,
    ShieldOff,
    Filter
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'moderator';
    status: 'active' | 'inactive' | 'suspended';
    joinDate: string;
    lastLogin: string;
    avatar?: string;
    type: 'consumer' | 'manager';
}

const sampleUsers: User[] = [
    {
        id: 1,
        name: '김철수',
        email: 'kim@example.com',
        role: 'user',
        status: 'active',
        joinDate: '2024-01-15',
        lastLogin: '2025-06-06 14:30',
        type: 'consumer'
    },
    {
        id: 2,
        name: '이영희',
        email: 'lee@example.com',
        role: 'moderator',
        status: 'active',
        joinDate: '2024-02-20',
        lastLogin: '2025-06-06 09:15',
        type: 'manager'
    },
    {
        id: 3,
        name: '박민수',
        email: 'park@example.com',
        role: 'user',
        status: 'suspended',
        joinDate: '2024-03-10',
        lastLogin: '2025-06-05 16:45',
        type: 'consumer'
    },
    {
        id: 4,
        name: '최수진',
        email: 'choi@example.com',
        role: 'admin',
        status: 'active',
        joinDate: '2023-12-01',
        lastLogin: '2025-06-06 11:20',
        type: 'manager'
    },
    {
        id: 5,
        name: '정동훈',
        email: 'jung@example.com',
        role: 'user',
        status: 'inactive',
        joinDate: '2024-04-05',
        lastLogin: '2025-05-28 19:30',
        type: 'consumer'
    },
];

const getRoleBadge = (role: string) => {
    switch (role) {
        case 'admin':
            return <Badge variant="default"><Shield className="w-3 h-3 mr-1" />관리자</Badge>;
        case 'moderator':
            return <Badge variant="secondary"><ShieldOff className="w-3 h-3 mr-1" />매니저</Badge>;
        case 'user':
            return <Badge variant="outline">고객</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'active':
            return <Badge className="bg-green-100 text-green-800">승인</Badge>;
        case 'inactive':
            return <Badge variant="secondary">비승인</Badge>;
        case 'suspended':
            return <Badge className="bg-red-100 text-red-800">정지</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

export const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>(sampleUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'consumer' | 'manager'>('consumer');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesType = user.type === activeTab;

        return matchesSearch && matchesStatus && matchesRole && matchesType;
    });

    const handleStatusChange = (userId: number, newStatus: 'active' | 'inactive' | 'suspended') => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
        ));
    };

    const handleDeleteUser = (userId: number) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
                    <p className="text-gray-600 mt-2">시스템 사용자들을 관리하고 권한을 설정하세요</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            새 사용자 추가
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
                        <div className="fixed inset-0 bg-white z-50" />
                        <div className="relative z-50">
                            <DialogHeader>
                                <DialogTitle>새 사용자 추가</DialogTitle>
                                <DialogDescription>
                                    새로운 사용자를 시스템에 추가합니다.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <Input placeholder="이름" />
                                <Input placeholder="이메일" type="email" />
                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">취소</Button>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">추가</Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* User Type Tabs */}
            <Tabs defaultValue="consumer" value={activeTab} onValueChange={(value) => setActiveTab(value as 'consumer' | 'manager')}>
                <TabsList className="grid w-full grid-cols-2 bg-white p-1 rounded-lg">
                    <TabsTrigger 
                        value="consumer"
                        className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm ${
                            activeTab === 'consumer' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600'
                        }`}
                    >
                        수요자
                    </TabsTrigger>
                    <TabsTrigger 
                        value="manager"
                        className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm ${
                            activeTab === 'manager' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600'
                        }`}
                    >
                        매니저
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">사용자 필터</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="이름 또는 이메일로 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-40">
                                <SelectValue placeholder="상태 필터" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">모든 상태</SelectItem>
                                <SelectItem value="active">승인</SelectItem>
                                <SelectItem value="inactive">비승인</SelectItem>
                                <SelectItem value="suspended">정지</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full md:w-40">
                                <SelectValue placeholder="역할 필터" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">모든 역할</SelectItem>
                                <SelectItem value="user">고객</SelectItem>
                                <SelectItem value="moderator">매니저</SelectItem>
                                <SelectItem value="admin">관리자</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {activeTab === 'consumer' ? '수요자' : '매니저'} 목록 ({filteredUsers.length}명)
                    </CardTitle>
                    <CardDescription>등록된 {activeTab === 'consumer' ? '수요자' : '매니저'}들의 정보와 상태를 확인할 수 있습니다</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>사용자</TableHead>
                                <TableHead>역할</TableHead>
                                <TableHead>상태</TableHead>
                                <TableHead>가입일</TableHead>
                                <TableHead>최근 로그인</TableHead>
                                <TableHead className="text-right">작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {new Date(user.joinDate).toLocaleDateString('ko-KR')}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500">
                                        {user.lastLogin}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button variant="ghost" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Select
                                                value={user.status}
                                                onValueChange={(value: 'active' | 'inactive' | 'suspended') =>
                                                    handleStatusChange(user.id, value)
                                                }
                                            >
                                                <SelectTrigger className="w-24 h-8 bg-white border-gray-200 hover:bg-gray-50">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white border-gray-200 shadow-lg">
                                                    <SelectItem
                                                        value="active"
                                                        className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900"
                                                    >
                                                        승인
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="inactive"
                                                        className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900"
                                                    >
                                                        비승인
                                                    </SelectItem>
                                                    <SelectItem
                                                        value="suspended"
                                                        className="hover:bg-gray-100 focus:bg-gray-100 text-gray-900"
                                                    >
                                                        정지
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};