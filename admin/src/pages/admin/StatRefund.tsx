import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { adminRefundsService } from '../../api/adminRefunds';
import { AdminRefundStatisticsResponseDto, AdminRefundReasonDto, AdminRefundCustomerTopDto, AdminRefundManagerTopDto } from '../../api/types';

// 주요 환불 사유 정의
const predefinedReasons = [
  "개인 일정 변경",
  "청소가 더 이상 필요하지 않음",
  "서비스 불만족",
  "매니저 불만족"
];

export const StatRefund: React.FC = () => {
  const [refundStatistics, setRefundStatistics] = useState<AdminRefundStatisticsResponseDto | null>(null);
  const [refundReasons, setRefundReasons] = useState<AdminRefundReasonDto[]>([]);
  const [customerTop, setCustomerTop] = useState<AdminRefundCustomerTopDto[]>([]);
  const [managerTop, setManagerTop] = useState<AdminRefundManagerTopDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOtherDetails, setShowOtherDetails] = useState(false);

  useEffect(() => {
    const fetchRefundData = async () => {
      try {
        setLoading(true);
        // 통계, 사유 분포, 고객/매니저별 환불금액 top3를 병렬로 가져오기
        const [statisticsData, reasonsData, customerTopData, managerTopData] = await Promise.all([
          adminRefundsService.getRefundStatistics(),
          adminRefundsService.getRefundReasons(),
          adminRefundsService.getRefundCustomerTop(),
          adminRefundsService.getRefundManagerTop()
        ]);
        setRefundStatistics(statisticsData);
        setRefundReasons(reasonsData);
        setCustomerTop(customerTopData.slice(0, 3));
        setManagerTop(managerTopData.slice(0, 3));
        setError(null);
      } catch (err: any) {
        console.error('환불 데이터 조회 실패:', err);
        setError(err.message || '환불 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchRefundData();
  }, []);

  // 통계 카드 데이터 생성
  const getRefundStatsCards = () => {
    if (!refundStatistics) return [];
    
    return [
      { 
        label: '전체 환불률', 
        value: `${refundStatistics.refundRate.toFixed(1)}%`, 
        desc: '누적 기준' 
      },
      { 
        label: '총 환불 건수', 
        value: `${refundStatistics.totalRefundCount}건`, 
        desc: '누적 전체 환불 건수' 
      },
      { 
        label: '승인된 환불 건수', 
        value: `${refundStatistics.approveRefundCount}건`, 
        desc: '승인된 누적 환불 건수' 
      },
      { 
        label: '환불 금액', 
        value: `₩${refundStatistics.totalRefundAmount.toLocaleString()}`, 
        desc: '승인된 누적 환불 금액' 
      },
    ];
  };

  // 환불 사유 데이터 처리 (기타 사유 그룹화)
  const getProcessedReasonData = () => {
    const 주요: AdminRefundReasonDto[] = [];
    const 기타: AdminRefundReasonDto[] = [];

    refundReasons.forEach(item => {
      if (predefinedReasons.includes(item.refundReason)) {
        주요.push(item);
      } else {
        기타.push(item);
      }
    });

    // 기타 사유들을 하나로 합치기
    const 기타Total = 기타.reduce((sum, item) => sum + item.count, 0);
    
    // 주요 사유들과 기타 사유 합쳐서 반환
    const result = [...주요];
    if (기타Total > 0) {
      result.push({ refundReason: '기타', count: 기타Total });
    }

    return { processedData: result, otherReasons: 기타 };
  };

  // 전체 환불 건수 기준으로 비율 계산
  const getTotalRefundCount = () => {
    return refundReasons.reduce((sum, item) => sum + item.count, 0);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">환불 분석</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">환불 분석</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">오류: {error}</div>
        </div>
      </div>
    );
  }

  const refundStatsCards = getRefundStatsCards();
  const { processedData, otherReasons } = getProcessedReasonData();
  const totalCount = getTotalRefundCount();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">환불 분석</h1>
      <p className="text-gray-600 mb-4">환불 사유, 사용자/매니저별 환불률 등 다양한 환불 통계를 확인하세요.</p>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {refundStatsCards.map((s) => (
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

      {/* 환불 사유 분포 */}
      <Card>
        <CardHeader>
          <CardTitle>환불 사유 분포</CardTitle>
          <CardDescription>누적 기준 (총 {totalCount}건)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processedData.map((r) => (
              <div key={r.refundReason} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 min-w-0 flex-1">
                      {r.refundReason}
                    </span>
                    {r.refundReason === '기타' && otherReasons.length > 0 && (
                      <button
                        onClick={() => setShowOtherDetails(!showOtherDetails)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-md border border-blue-200 transition-colors duration-200 whitespace-nowrap"
                      >
                        <span>{showOtherDetails ? '▲' : '▼'}</span>
                        <span>세부내용 {showOtherDetails ? '숨기기' : '보기'}</span>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {((r.count / totalCount) * 100).toFixed(1)}%
                    </span>
                    <span className="text-sm font-bold text-blue-600 min-w-[2rem] text-right">
                      {r.count}건
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(r.count / totalCount) * 100}%` }} 
                  />
                </div>
                
                {/* 기타 사유 세부내용 */}
                {r.refundReason === '기타' && showOtherDetails && otherReasons.length > 0 && (
                  <div className="ml-4 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                    <div className="text-xs font-medium text-gray-600 mb-2">기타 사유 세부내용:</div>
                    <div className="space-y-1">
                      {otherReasons.map((reason, index) => (
                        <div key={index} className="flex justify-between items-center text-xs">
                          <span className="text-gray-700 truncate pr-2" title={reason.refundReason}>
                            • {reason.refundReason}
                          </span>
                          <span className="text-gray-600 font-medium whitespace-nowrap">
                            {reason.count}건
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 고객별 환불금액 TOP3 */}
      <Card>
        <CardHeader>
          <CardTitle>고객별 환불금액 TOP3</CardTitle>
          <CardDescription>누적 기준, 환불금액 상위 3명</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">고객ID</th>
                <th className="p-2">이름</th>
                <th className="p-2">환불 건수</th>
                <th className="p-2">총 환불 금액</th>
              </tr>
            </thead>
            <tbody>
              {customerTop.map((u) => (
                <tr key={u.customerId} className="border-b">
                  <td className="p-2">{u.customerId}</td>
                  <td className="p-2 font-semibold">{u.customerName}</td>
                  <td className="p-2 text-blue-600 font-bold">{u.refundCount}</td>
                  <td className="p-2">₩{u.totalRefundAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 매니저별 환불금액 TOP3 */}
      <Card>
        <CardHeader>
          <CardTitle>매니저별 환불금액 TOP3</CardTitle>
          <CardDescription>누적 기준, 환불금액 상위 3명</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2">매니저ID</th>
                <th className="p-2">이름</th>
                <th className="p-2">환불 건수</th>
                <th className="p-2">총 환불 금액</th>
              </tr>
            </thead>
            <tbody>
              {managerTop.map((m) => (
                <tr key={m.managerId} className="border-b">
                  <td className="p-2">{m.managerId}</td>
                  <td className="p-2 font-semibold">{m.managerName}</td>
                  <td className="p-2 text-blue-600 font-bold">{m.refundCount}</td>
                  <td className="p-2">₩{m.totalRefundAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}; 