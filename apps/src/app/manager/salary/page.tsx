import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getCalculationHistory } from '@/entities/calculation/api/getCalculationHistory';
import { CalculationHistoryItem } from '@/entities/calculation/model/types';
import { SalaryPageClient } from './SalaryPageClient';

export const dynamic = 'force-dynamic';

export default async function SalaryPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value ?? '';
  
  let initialHistory: CalculationHistoryItem[] = [];
  try {
    if (token) {
      initialHistory = await getCalculationHistory(token);
    }
  } catch (error) {
    console.error('Error fetching calculation history:', error);
    // 에러 발생 시 빈 배열을 반환하여 UI가 깨지지 않도록 함
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SalaryPageClient initialHistory={initialHistory} token={token} />
    </Suspense>
  );
} 