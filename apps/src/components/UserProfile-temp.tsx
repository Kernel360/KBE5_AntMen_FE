// ./src/components/UserProfile-temp.tsx - 테스트 완료 후 삭제 예정
'use client';
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { User } from '@/types/user';
import { getAuthToken } from '@/lib/auth';

export default function UserProfileDebug() {
    const { isAuthenticated, token, logout } = useAuthContext();
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<User>>({});

    // 디버깅용 상태들 - 테스트 완료 후 삭제
    const [clientToken, setClientToken] = useState<string | null>(null);
    const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // 클라이언트에서 localStorage 직접 확인 - 테스트용
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedToken = localStorage.getItem('auth-token');
            setClientToken(savedToken);
        }
    }, []);

    // 토큰이 있으면 사용자 정보 로드
    useEffect(() => {
        if (isAuthenticated && token) {
            fetchUserInfo();
        }
    }, [isAuthenticated, token]);

    const fetchUserInfo = async () => {
        setLoading(true);
        setError(null);
        setApiStatus('loading');

        try {
            const data = await userService.getMyInfo();
            setUserInfo(data);
            setEditData({
                user_name: data.user_name,
                user_tel: data.user_tel,
                user_birth: data.user_birth,
                user_gender: data.user_gender,
            });
            setApiStatus('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : '사용자 정보를 불러오는데 실패했습니다.');
            setApiStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!userInfo) return;

        setLoading(true);
        try {
            const updated = await userService.updateMyInfo(editData);
            setUserInfo({ ...userInfo, ...updated });
            setIsEditing(false);
            alert('프로필이 업데이트되었습니다!');
        } catch (err) {
            alert('프로필 업데이트에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 수동 토큰 테스트 - 테스트용
    const testToken = async () => {
        const currentToken = getAuthToken();
        if (!currentToken) {
            alert('토큰이 없습니다.');
            return;
        }

        try {
            await userService.getMyInfo();
            alert('토큰 테스트 성공!');
        } catch (err) {
            alert(`토큰 테스트 실패: ${err}`);
        }
    };

    // 디버깅 정보 표시 - 테스트용
    const DebugInfo = () => (
        <div style={{
            background: '#f0f8ff',
            padding: '15px',
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px'
        }}>
            <h4>🔐 디버깅 정보 (테스트용)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '5px', fontSize: '14px' }}>
                <strong>Context 인증:</strong> <span>{isAuthenticated ? '✅' : '❌'}</span>
                <strong>Context 토큰:</strong> <span>{token ? '있음' : '없음'}</span>
                <strong>localStorage 토큰:</strong> <span>{clientToken ? '있음' : '없음'}</span>
                <strong>API 상태:</strong> <span>{apiStatus}</span>
            </div>
            <div style={{ marginTop: '10px' }}>
                <button onClick={testToken} style={{ padding: '5px 10px', marginRight: '10px' }}>
                    🧪 토큰 테스트
                </button>
                <button onClick={fetchUserInfo} style={{ padding: '5px 10px' }}>
                    🔄 다시 시도
                </button>
            </div>
        </div>
    );

    if (!isAuthenticated) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>🔒 로그인이 필요합니다</h2>
                <DebugInfo />
                <button onClick={() => window.location.href = '/login'}>
                    로그인하기
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>👤 내 프로필 (디버그 버전)</h1>

            <DebugInfo />

            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>🔄 {isEditing ? '저장 중...' : '정보를 불러오는 중...'}</p>
                </div>
            )}

            {error && (
                <div style={{ color: 'red', padding: '15px', background: '#ffebee', borderRadius: '8px', marginBottom: '20px' }}>
                    <p><strong>❌ {error}</strong></p>
                    <button onClick={fetchUserInfo} style={{ padding: '8px 15px', fontSize: '14px' }}>
                        다시 시도
                    </button>
                </div>
            )}

            {userInfo && !loading && (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {!isEditing ? (
                        <div>
                            <h3>📋 기본 정보</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px' }}>
                                <strong>ID:</strong> <span>{userInfo.user_id}</span>
                                <strong>이름:</strong> <span>{userInfo.user_name}</span>
                                <strong>이메일:</strong> <span>{userInfo.user_email}</span>
                                <strong>전화번호:</strong> <span>{userInfo.user_tel || '없음'}</span>
                                <strong>역할:</strong> <span>{userInfo.user_role}</span>
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <button onClick={() => setIsEditing(true)} style={{ marginRight: '10px', padding: '10px 20px' }}>
                                    ✏️ 정보 수정
                                </button>
                                <button onClick={logout} style={{ padding: '10px 20px' }}>
                                    🚪 로그아웃
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h3>✏️ 정보 수정</h3>
                            {/* 수정 폼은 동일하므로 생략 */}
                            <div style={{ marginTop: '20px' }}>
                                <button onClick={handleSave} disabled={loading} style={{ marginRight: '10px', padding: '10px 20px' }}>
                                    💾 저장
                                </button>
                                <button onClick={() => setIsEditing(false)} style={{ padding: '10px 20px' }}>
                                    ❌ 취소
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}