import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { adminSalesService } from '../../api/adminSales';
import { AdminSalesSummaryResponseDto } from '../../api/types';

export const FinanceSales: React.FC = () => {
  const [salesData, setSalesData] = useState<AdminSalesSummaryResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const data = await adminSalesService.getSalesSummary();
        setSalesData(data);
        setError(null);
      } catch (err: any) {
        console.error('매출 데이터 조회 실패:', err);
        setError(err.message || '매출 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">매출분석</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">매출분석</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">오류: {error}</div>
        </div>
      </div>
    );
  }

  if (!salesData) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">매출분석</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">데이터가 없습니다.</div>
        </div>
      </div>
    );
  }

  const salesStats = [
    { label: '총 매출', value: `₩${salesData.totalSales.toLocaleString()}`, desc: '누적' },
    { label: '이번 달 매출', value: `₩${salesData.currentMonthSales.toLocaleString()}`, desc: '2025-07 기준' },
    { label: '일평균 매출', value: `₩${salesData.averageDailySales.toLocaleString()}`, desc: '(총 매출 ÷ 결제 발생 일 수)' },
    { label: '총 순이익', value: `₩${salesData.totalProfit.toLocaleString()}`, desc: '누적' },
    { label: '이번 달 순이익', value: `₩${salesData.currentMonthProfit.toLocaleString()}`, desc: '2025-07 기준' },
    { label: '일평균 순이익', value: `₩${salesData.averageDailyProfit.toLocaleString()}`, desc: '(총 순이익 ÷ 결제 발생 일 수)' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">매출분석</h1>
      <p className="text-gray-600 mb-4">서비스의 매출 및 순이익 현황을 확인하세요.</p>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 매출 카드 */}
        {salesStats.slice(0, 3).map((s) => (
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
        {/* 순이익 카드 */}
        {salesStats.slice(3, 6).map((s) => (
          <Card key={s.label}>
            <CardHeader>
              <CardTitle className="text-base font-medium">{s.label}</CardTitle>
              <CardDescription className="text-xs">{s.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 일별 매출/순이익 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 주간 일별 매출/순이익</CardTitle>
          <CardDescription>일별 매출 및 순이익 추이</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-2">날짜</th>
                  <th className="p-2">매출(₩)</th>
                  <th className="p-2">수수료(₩)</th>
                  <th className="p-2">순이익(₩)</th>
                </tr>
              </thead>
              <tbody>
                {salesData.recentWeeklySalesProfit && salesData.recentWeeklySalesProfit.length > 0 ? (
                  salesData.recentWeeklySalesProfit.map((dailyData, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{dailyData.dailyDate}</td>
                      <td className="p-2 text-blue-700 font-semibold">{dailyData.dailySales.toLocaleString()}</td>
                      <td className="p-2">{dailyData.dailyFee.toLocaleString()}</td>
                      <td className="p-2 text-green-700 font-semibold">{dailyData.dailyProfit.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-gray-500">데이터가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 