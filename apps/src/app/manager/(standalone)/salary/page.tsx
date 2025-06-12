import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '매니저 급여 내역',
  description: '매니저의 급여 내역을 확인할 수 있는 페이지입니다.',
};

function getUserRoleFromToken(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const cleanToken = token.replace(/^Bearer\s*/i, '');
    const decoded: any = jwtDecode(cleanToken);
    return decoded.userRole || null;
  } catch {
    return null;
  }
}

export default function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token')?.value;
  const userRole = getUserRoleFromToken(token);

  if (!token) {
    redirect('/login');
  }
  if (userRole !== 'MANAGER') {
    // 역할별 홈으로 리다이렉트
    if (userRole === 'CUSTOMER') {
      redirect('/');
    } else {
      redirect('/login');
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-2xl font-bold mb-4">매니저 급여 내역</h1>
      <p className="text-gray-600">여기에 급여 내역이 표시됩니다.</p>
    </main>
  );
}
