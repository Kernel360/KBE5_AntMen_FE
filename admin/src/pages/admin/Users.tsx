import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../api/userService';
import { User } from '../../api/types';
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
        case 'pending':
            return <Badge className="bg-yellow-100 text-yellow-800">대기중</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

export const Users: React.FC = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'CUSTOMER' | 'MANAGER' | 'WAITING_MANAGER'>('CUSTOMER');
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [approvalReason, setApprovalReason] = useState('');
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);

    // 일반 회원/매니저 목록
    const { data: userResponse, isLoading } = useQuery({
        queryKey: ['users', searchTerm, activeTab],
        queryFn: () =>
            activeTab === 'WAITING_MANAGER'
                ? userService.getWaitingManagers()
                : userService.getUsers(searchTerm, undefined, activeTab === 'CUSTOMER' ? 'CUSTOMER' : 'MANAGER'),
    });

    // 매니저 승인/거절
    const approveManagerMutation = useMutation({
        mutationFn: (userId: number) => userService.approveManager(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setShowApprovalDialog(false);
            setSelectedUser(null);
            setApprovalReason('');
        }
    });
    const rejectManagerMutation = useMutation({
        mutationFn: ({ userId, reason }: { userId: number; reason: string }) => userService.rejectManager(userId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setShowApprovalDialog(false);
            setSelectedUser(null);
            setApprovalReason('');
        }
    });

    const filteredUsers = (userResponse ?? []).filter((user: any) => {
        const name = user.userName ?? '';
        const email = user.userEmail ?? '';
        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            email.toLowerCase().includes(searchTerm.toLowerCase());
        if (activeTab === 'WAITING_MANAGER') return matchesSearch;
        return matchesSearch && user.userRole === activeTab;
    });

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

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
            <Tabs defaultValue="CUSTOMER" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <TabsList className="grid w-full grid-cols-3 bg-white p-1 rounded-lg">
                    <TabsTrigger value="CUSTOMER">수요자</TabsTrigger>
                    <TabsTrigger value="MANAGER">매니저</TabsTrigger>
                    <TabsTrigger value="WAITING_MANAGER">승인 대기 매니저</TabsTrigger>
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
                        {activeTab === 'CUSTOMER' && '수요자 목록'}
                        {activeTab === 'MANAGER' && '매니저 목록'}
                        {activeTab === 'WAITING_MANAGER' && '승인 대기 매니저 목록'} ({filteredUsers.length}명)
                    </CardTitle>
                    <CardDescription>등록된 {activeTab === 'CUSTOMER' ? '수요자' : activeTab === 'MANAGER' ? '매니저' : '승인 대기 매니저'}들의 정보와 상태를 확인할 수 있습니다</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>사용자명</TableHead>
                                <TableHead>이메일</TableHead>
                                <TableHead>역할</TableHead>
                                <TableHead>가입일</TableHead>
                                <TableHead>작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user: any) => (
                                <TableRow key={user.userId}>
                                    <TableCell>{user.userName}</TableCell>
                                    <TableCell>{user.userEmail}</TableCell>
                                    <TableCell>{user.userRole}</TableCell>
                                    <TableCell>{user.userCreatedAt?.slice(0, 10)}</TableCell>
                                    <TableCell>
                                        {activeTab === 'WAITING_MANAGER' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowApprovalDialog(true);
                                                }}
                                            >
                                                승인/거절
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* 매니저 승인/거절 다이얼로그 */}
            <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>매니저 승인/거절</DialogTitle>
                        <DialogDescription>
                            {selectedUser?.userName}님의 매니저 신청을 승인 또는 거절합니다.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            value={approvalReason}
                            onChange={(e) => setApprovalReason(e.target.value)}
                            placeholder="거절 사유를 입력하세요 (거절 시 필수)"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    if (selectedUser) {
                                        rejectManagerMutation.mutate({ userId: selectedUser.userId, reason: approvalReason });
                                    }
                                }}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                                거절
                            </Button>
                            <Button
                                onClick={() => {
                                    if (selectedUser) {
                                        approveManagerMutation.mutate(selectedUser.userId);
                                    }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                승인
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};