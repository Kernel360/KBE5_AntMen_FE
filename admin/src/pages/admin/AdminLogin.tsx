import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
    Eye,
    EyeOff,
    Shield,
    Lock,
    User,
    AlertCircle,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { setCookie, ADMIN_TOKEN_COOKIE, ADMIN_REFRESH_TOKEN_COOKIE } from '../../lib/cookie';

interface LoginForm {
    email: string;
    password: string;
}

export const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // 이전에 접근하려던 페이지 정보
    const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

    const handleInputChange = (field: keyof LoginForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // 입력 시 에러 메시지 제거
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검사
        if (!form.email || !form.password) {
            setError('이메일과 비밀번호를 모두 입력해주세요.');
            return;
        }

        if (!form.email.includes('@')) {
            setError('유효한 이메일 주소를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 실제 API 호출을 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 데모용 로그인 (실제로는 API 호출)
            if (form.email === 'admin@company.com' && form.password === 'admin123') {
                setSuccess(true);

                // 토큰을 쿠키에 저장 (보안 설정 포함)
                const accessToken = 'demo-access-token-12345';
                const refreshToken = 'demo-refresh-token-67890';

                // 액세스 토큰 (1일 만료)
                setCookie(ADMIN_TOKEN_COOKIE, accessToken, 1, {
                    secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
                    sameSite: 'strict', // CSRF 공격 방지
                    path: '/'
                });

                // 리프레시 토큰 (7일 만료, HttpOnly는 JS에서 설정 불가하므로 서버에서 설정 필요)
                setCookie(ADMIN_REFRESH_TOKEN_COOKIE, refreshToken, 7, {
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/'
                });

                // 사용자 정보는 localStorage에 저장 (민감하지 않은 정보만)
                localStorage.setItem('adminUser', JSON.stringify({
                    email: form.email,
                    name: '관리자',
                    role: 'admin'
                }));

                // 잠시 성공 메시지 표시 후 대시보드로 이동
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 1000);

            } else {
                setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            }
        } catch (error) {
            setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                        <div className="rounded-full bg-green-100 p-3 mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 성공!</h2>
                        <p className="text-gray-600 text-center">관리자 대시보드로 이동 중입니다...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* 헤더 */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">관리자 로그인</h1>
                    <p className="text-gray-600">관리자 계정으로 로그인하여 시스템에 접근하세요</p>
                </div>

                {/* 로그인 폼 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-center">로그인</CardTitle>
                        <CardDescription className="text-center">
                            관리자 권한이 필요한 서비스입니다
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* 이메일 입력 */}
                            <div className="space-y-2">
                                <Label htmlFor="email">이메일</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@company.com"
                                        value={form.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="pl-10"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* 비밀번호 입력 */}
                            <div className="space-y-2">
                                <Label htmlFor="password">비밀번호</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="비밀번호를 입력하세요"
                                        value={form.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="pl-10 pr-10"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* 에러 메시지 */}
                            {error && (
                                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {/* 로그인 버튼 */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        로그인 중...
                                    </>
                                ) : (
                                    '로그인'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* 데모 정보 */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-2">
                            <div className="rounded-full bg-blue-100 p-1">
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-blue-900">데모 계정 정보</h4>
                                <div className="space-y-1 text-sm text-blue-700">
                                    <p><strong>이메일:</strong> admin@company.com</p>
                                    <p><strong>비밀번호:</strong> admin123</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 보안 정보 */}
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <Lock className="h-4 w-4" />
                        <span>SSL로 보호되는 안전한 로그인</span>
                    </div>
                </div>
            </div>
        </div>
    );
};