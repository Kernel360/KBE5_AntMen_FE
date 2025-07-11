import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
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
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search
} from 'lucide-react';

const stats = [
  { label: '전체 매칭률', value: '78%', desc: '지난 30일 기준' },
  { label: '총 매칭 시도', value: '1,500건', desc: '누적' },
  { label: '매칭 성공', value: '1,170건', desc: '누적' },
  { label: '매칭 실패', value: '330건', desc: '누적' },
];

const trendData = [
  { date: '06-01', matching: 80 },
  { date: '06-02', matching: 77 },
  { date: '06-03', matching: 79 },
  { date: '06-04', matching: 81 },
  { date: '06-05', matching: 76 },
  { date: '06-06', matching: 78 },
  { date: '06-07', matching: 80 },
];

const regionStats = [
  { region: '서울', matching: 82 },
  { region: '경기', matching: 79 },
  { region: '부산', matching: 75 },
  { region: '대구', matching: 73 },
  { region: '광주', matching: 70 },
];

const topManagers = [
  { name: '김매니저', matching: 32 },
  { name: '이매니저', matching: 29 },
  { name: '박매니저', matching: 27 },
  { name: '최매니저', matching: 25 },
  { name: '정매니저', matching: 24 },
];

// 알고리즘 성능 지표
const algorithmMetrics = [
    {
        id: 1,
        name: '매칭 정확도',
        description: '고객 선호도와 매니저 특성 간의 일치도',
        currentValue: 87.5,
        targetValue: 90,
        status: 'good' as const,
        trend: 'up' as const,
        lastUpdated: '2025-06-06 14:30'
    },
    {
        id: 2,
        name: '응답 시간',
        description: '매칭 요청 처리 평균 시간',
        currentValue: 1.2,
        targetValue: 1.0,
        status: 'warning' as const,
        trend: 'down' as const,
        lastUpdated: '2025-06-06 14:30'
    },
    {
        id: 3,
        name: '매칭 거부율',
        description: '고객이 제안된 매칭을 거부하는 비율',
        currentValue: 15.3,
        targetValue: 10,
        status: 'bad' as const,
        trend: 'up' as const,
        lastUpdated: '2025-06-06 14:30'
    },
    {
        id: 4,
        name: '재매칭 요청률',
        description: '첫 매칭 후 재매칭을 요청하는 비율',
        currentValue: 8.7,
        targetValue: 5,
        status: 'warning' as const,
        trend: 'stable' as const,
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

export const StatMatching: React.FC = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">매칭률 및 알고리즘 분석</h1>
            <p className="text-gray-600 mt-2">전체 매칭 성과와 알고리즘 성능을 종합적으로 분석합니다.</p>
        </div>
    </div>

    {/* 주요 지표 카드 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader>
            <CardTitle className="text-base font-medium">{s.label}</CardTitle>
            <CardDescription className="text-xs">{s.desc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{s.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* 알고리즘 성능 지표 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {algorithmMetrics.map((metric) => (
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

    {/* 트렌드 테이블 */}
    <Card>
      <CardHeader>
        <CardTitle>최근 7일간 매칭률 트렌드</CardTitle>
        <CardDescription>일별 매칭률 변화</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">날짜</th>
                <th className="p-2">매칭률(%)</th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((d) => (
                <tr key={d.date} className="border-b">
                  <td className="p-2 font-medium">{d.date}</td>
                  <td className="p-2">{d.matching}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    {/* 알고리즘 성능 상세 분석 */}
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
                        {algorithmMetrics.map((metric) => (
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

    {/* 지역별 매칭률 */}
    <Card>
      <CardHeader>
        <CardTitle>지역별 매칭률</CardTitle>
        <CardDescription>주요 지역별 매칭 성공률</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {regionStats.map((r) => (
            <div key={r.region} className="flex items-center">
              <div className="w-16 text-sm text-gray-700">{r.region}</div>
              <div className="flex-1 bg-gray-200 rounded h-3 mx-2">
                <div className="bg-blue-500 h-3 rounded" style={{ width: `${r.matching}%` }} />
              </div>
              <div className="w-10 text-right text-sm font-bold text-blue-700">{r.matching}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* 매니저별 매칭 성공 TOP5 */}
    <Card>
      <CardHeader>
        <CardTitle>매니저별 매칭 성공 TOP5</CardTitle>
        <CardDescription>최근 한 달 기준</CardDescription>
      </CardHeader>
      <CardContent>
        <table className="min-w-full text-center text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2">순위</th>
              <th className="p-2">매니저명</th>
              <th className="p-2">매칭 성공 건수</th>
            </tr>
          </thead>
          <tbody>
            {topManagers.map((m, i) => (
              <tr key={m.name} className="border-b">
                <td className="p-2 font-bold">{i + 1}</td>
                <td className="p-2">{m.name}</td>
                <td className="p-2">{m.matching}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>

    {/* 알고리즘 개선 제안 */}
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
                <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">매칭 정확도 양호</h3>
                    <p className="text-sm text-green-700">
                        매칭 정확도가 목표치에 근접하고 있어 양호한 상태입니다. 
                        지속적인 모니터링을 통해 안정적인 성능을 유지하세요.
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
  </div>
); 