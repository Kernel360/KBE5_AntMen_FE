import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  Filter,
} from 'lucide-react'
import axios, { AxiosResponse } from 'axios'

interface User {
  userId: number
  userLoginId: string
  userName: string
  userTel: string
  userEmail: string
  userRole: string
  userGender: 'M' | 'F'
  userBirth: string
  userProfile: string
  userType: string
  userCreatedAt: string
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return (
        <Badge variant="default">
          <Shield className="w-3 h-3 mr-1" />
          관리자
        </Badge>
      )
    case 'MANAGER':
      return (
        <Badge variant="secondary">
          <ShieldOff className="w-3 h-3 mr-1" />
          매니저
        </Badge>
      )
    case 'CUSTOMER':
      return <Badge variant="outline">고객</Badge>
    default:
      return <Badge variant="outline">알 수 없음</Badge>
  }
}

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'consumer' | 'manager'>('consumer')

  useEffect(() => {
    axios
      .get<User[]>('https://api.antmen.site/api/v1/admin/users')
      .then((res: AxiosResponse<User[]>) => setUsers(res.data))
      .catch((err: unknown) => {
        console.error(err)
        setUsers([])
      })
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.userRole === roleFilter
    const matchesType =
      activeTab === 'consumer'
        ? user.userRole === 'CUSTOMER'
        : user.userRole === 'MANAGER'
    return matchesSearch && matchesRole && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">사용자 관리</h1>
          <p className="text-gray-600 mt-2">
            시스템 사용자들을 관리하고 권한을 설정하세요
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />새 사용자 추가
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
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    취소
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    추가
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Type Tabs */}
      <Tabs
        defaultValue="consumer"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as 'consumer' | 'manager')}
      >
        <TabsList className="grid w-full grid-cols-2 bg-white p-1 rounded-lg">
          <TabsTrigger
            value="consumer"
            className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm ${
              activeTab === 'consumer'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600'
            }`}
          >
            수요자
          </TabsTrigger>
          <TabsTrigger
            value="manager"
            className={`data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm ${
              activeTab === 'manager'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600'
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
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="역할 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 역할</SelectItem>
                <SelectItem value="CUSTOMER">고객</SelectItem>
                <SelectItem value="MANAGER">매니저</SelectItem>
                <SelectItem value="ADMIN">관리자</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'consumer' ? '수요자' : '매니저'} 목록 (
            {filteredUsers.length}명)
          </CardTitle>
          <CardDescription>
            등록된 {activeTab === 'consumer' ? '수요자' : '매니저'}들의 정보와
            상태를 확인할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>아이디</TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead>역할</TableHead>
                <TableHead>성별</TableHead>
                <TableHead>생년월일</TableHead>
                <TableHead>가입일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.userName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.userEmail}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.userEmail}</TableCell>
                  <TableCell>{user.userLoginId}</TableCell>
                  <TableCell>{user.userTel}</TableCell>
                  <TableCell>{getRoleBadge(user.userRole)}</TableCell>
                  <TableCell>
                    {user.userGender === 'M' ? '남성' : '여성'}
                  </TableCell>
                  <TableCell>{user.userBirth}</TableCell>
                  <TableCell>
                    {user.userCreatedAt
                      ? new Date(user.userCreatedAt).toLocaleDateString('ko-KR')
                      : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
