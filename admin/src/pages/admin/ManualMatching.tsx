import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';

export const ManualMatching: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">수동매칭</h1>
                <p className="text-gray-600">매칭 알고리즘을 통한 자동매칭 외에 수동으로 매칭을 관리합니다.</p>
            </div>

            {/* 매칭 검색 및 필터 */}
            <Card>
                <CardHeader>
                    <CardTitle>매칭 검색</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="customer-search">수요자 검색</Label>
                            <Input id="customer-search" placeholder="수요자명 또는 ID" />
                        </div>
                        <div>
                            <Label htmlFor="manager-search">매니저 검색</Label>
                            <Input id="manager-search" placeholder="매니저명 또는 ID" />
                        </div>
                        <div>
                            <Label htmlFor="status-filter">매칭 상태</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="상태 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">대기중</SelectItem>
                                    <SelectItem value="matched">매칭완료</SelectItem>
                                    <SelectItem value="cancelled">취소됨</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full">검색</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 수동 매칭 생성 */}
            <Card>
                <CardHeader>
                    <CardTitle>수동 매칭 생성</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="customer-select">수요자 선택</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="수요자 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="customer1">김수요 (ID: 1001)</SelectItem>
                                    <SelectItem value="customer2">이수요 (ID: 1002)</SelectItem>
                                    <SelectItem value="customer3">박수요 (ID: 1003)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="manager-select">매니저 선택</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="매니저 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manager1">김매니저 (ID: 2001)</SelectItem>
                                    <SelectItem value="manager2">이매니저 (ID: 2002)</SelectItem>
                                    <SelectItem value="manager3">박매니저 (ID: 2003)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end">
                            <Button className="w-full">매칭 생성</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 매칭 목록 */}
            <Card>
                <CardHeader>
                    <CardTitle>매칭 목록</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>매칭 ID</TableHead>
                                <TableHead>수요자</TableHead>
                                <TableHead>매니저</TableHead>
                                <TableHead>매칭일시</TableHead>
                                <TableHead>상태</TableHead>
                                <TableHead>작업</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>M001</TableCell>
                                <TableCell>김수요 (1001)</TableCell>
                                <TableCell>김매니저 (2001)</TableCell>
                                <TableCell>2024-01-15 14:30</TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                        매칭완료
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">상세보기</Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>M002</TableCell>
                                <TableCell>이수요 (1002)</TableCell>
                                <TableCell>이매니저 (2002)</TableCell>
                                <TableCell>2024-01-15 15:00</TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                        대기중
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">상세보기</Button>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>M003</TableCell>
                                <TableCell>박수요 (1003)</TableCell>
                                <TableCell>박매니저 (2003)</TableCell>
                                <TableCell>2024-01-15 15:30</TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                        취소됨
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm">상세보기</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}; 