import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import {
    GitBranch,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search
} from 'lucide-react';

interface AlgorithmMetric {
    id: number;
    name: string;
    description: string;
    currentValue: number;
    targetValue: number;
    status: 'good' | 'warning' | 'bad';
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
}

const sampleMetrics: AlgorithmMetric[] = [
    {
        id: 1,
        name: '매칭 정확도',
        description: '고객 선호도와 매니저 특성 간의 일치도',
        currentValue: 87.5,
        targetValue: 90,
        status: 'good',
        trend: 'up',
        lastUpdated: '2025-06-06 14:30'
    },
    {
        id: 2,
        name: '응답 시간',
        description: '매칭 요청 처리 평균 시간',
        currentValue: 1.2,
        targetValue: 1.0,
        status: 'warning',
        trend: 'down',
        lastUpdated: '2025-06-06 14:30'
    },
    {
        id: 3,
        name: '매칭 거부율',
        description: '고객이 제안된 매칭을 거부하는 비율',
        currentValue: 15.3,
        targetValue: 10,
        status: 'bad',
        trend: 'up',
        lastUpdated: '2025-06-06 14:30'
    },
    {
        id: 4,
        name: '재매칭 요청률',
        description: '첫 매칭 후 재매칭을 요청하는 비율',
        currentValue: 8.7,
        targetValue: 5,
        status: 'warning',
        trend: 'stable',
        lastUpdated: '2025-06-06 14:30'
    }
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'good':
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />양호</Badge>;
        case 'warning':
            return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />주의</Badge>;
        case 'bad':
            return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />개선필요</Badge>;
        default:
            return <Badge variant="outline">알 수 없음</Badge>;
    }
};

const getTrendIcon = (trend: string) => {
    switch (trend) {
        case 'up':
            return <TrendingUp className="w-4 h-4 text-green-600" />;
        case 'down':
            return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
        case 'stable':
            return <TrendingUp className="w-4 h-4 text-gray-400" />;
        default:
            return null;
    }
};

export const Algorithm: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">매칭 알고리즘 검토</h1>
                    <p className="text-gray-600 mt-2">매칭 알고리즘의 성능 지표를 모니터링하고 개선합니다.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sampleMetrics.map((metric) => (
                    <Card key={metric.id}>
                        <CardHeader>
                            <CardTitle className="text-base font-medium">{metric.name}</CardTitle>
                            <CardDescription className="text-xs">{metric.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold">
                                    {metric.currentValue}%
                                </div>
                                <div className="flex items-center gap-2">
                                    {getTrendIcon(metric.trend)}
                                    {getStatusBadge(metric.status)}
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                목표: {metric.targetValue}%
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>알고리즘 성능 상세 분석</CardTitle>
                    <CardDescription>주요 성능 지표의 상세 데이터를 확인할 수 있습니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="지표명으로 검색..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="상태 필터" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">전체</SelectItem>
                                    <SelectItem value="good">양호</SelectItem>
                                    <SelectItem value="warning">주의</SelectItem>
                                    <SelectItem value="bad">개선필요</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>지표명</TableHead>
                                    <TableHead>설명</TableHead>
                                    <TableHead>현재값</TableHead>
                                    <TableHead>목표값</TableHead>
                                    <TableHead>상태</TableHead>
                                    <TableHead>추세</TableHead>
                                    <TableHead>최종 업데이트</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sampleMetrics.map((metric) => (
                                    <TableRow key={metric.id}>
                                        <TableCell className="font-medium">{metric.name}</TableCell>
                                        <TableCell>{metric.description}</TableCell>
                                        <TableCell>{metric.currentValue}%</TableCell>
                                        <TableCell>{metric.targetValue}%</TableCell>
                                        <TableCell>{getStatusBadge(metric.status)}</TableCell>
                                        <TableCell>{getTrendIcon(metric.trend)}</TableCell>
                                        <TableCell>{metric.lastUpdated}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>알고리즘 개선 제안</CardTitle>
                    <CardDescription>성능 지표 분석을 바탕으로 한 개선 제안사항입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 rounded-lg">
                            <h3 className="font-medium text-yellow-800 mb-2">매칭 거부율 개선 필요</h3>
                            <p className="text-sm text-yellow-700">
                                현재 매칭 거부율이 목표치(10%)보다 높습니다. 고객 선호도 데이터를 더 정교하게 분석하여
                                매칭 정확도를 높일 필요가 있습니다.
                            </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-800 mb-2">응답 시간 최적화</h3>
                            <p className="text-sm text-blue-700">
                                매칭 처리 시간이 목표치보다 약간 높습니다. 알고리즘 최적화를 통해
                                처리 속도를 개선할 수 있습니다.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 