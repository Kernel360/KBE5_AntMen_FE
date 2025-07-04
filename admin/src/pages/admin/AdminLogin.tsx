import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
import { setCookie, getCookie, ADMIN_TOKEN_COOKIE } from '../../lib/cookie';
import { adminService } from '../../api/adminService';

interface LoginForm {
    loginId: string;
    password: string;
}

export const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState<LoginForm>({ loginId: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // 이전에 접근하려던 페이지 정보 (현재 사용되지 않음)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

    // 이미 로그인된 사용자인지 확인
    useEffect(() => {
        let token = getCookie(ADMIN_TOKEN_COOKIE);
        if (!token) {
            token = localStorage.getItem('adminToken');
        }
        const user = localStorage.getItem('adminUser');
        
        if (token && user) {
            // 이미 로그인된 상태라면 대시보드로 이동
            navigate('/admin/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleInputChange = (field: keyof LoginForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // 입력 시 에러 메시지 제거
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검사
        if (!form.loginId || !form.password) {
            setError('로그인 아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 실제 API 호출
            const loginResponse = await adminService.login({
                userLoginId: form.loginId,
                userPassword: form.password
            });

            setSuccess(true);

            // 쿠키와 localStorage 둘 다 저장
            setCookie(ADMIN_TOKEN_COOKIE, loginResponse.accessToken, 1, {
                secure: false,
                sameSite: 'lax',
                path: '/'
            });
            localStorage.setItem('adminToken', loginResponse.accessToken);

            // 관리자 정보는 localStorage에 저장 (로그인 ID 사용)
            localStorage.setItem('adminUser', JSON.stringify({
                id: 1, // 임시 ID
                loginId: form.loginId,
                initialPassword: loginResponse.initialPassword
            }));

            // 성공 메시지 표시 후 대시보드로 이동
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 3000);

        } catch (error: any) {
            
            // API 응답에서 오는 구체적인 에러 메시지 처리
            if (error.response?.status === 401) {
                setError('로그인 아이디 또는 비밀번호가 올바르지 않습니다.');
            } else if (error.response?.status === 403) {
                setError('관리자 권한이 없습니다.');
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                        <div className="rounded-full bg-green-100 p-3 mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인 성공!</h2>
                        <p className="text-gray-600 text-center mb-4">관리자 대시보드로 이동 중입니다...</p>
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">로그인</CardTitle>
                        <CardDescription className="text-center">
                            관리자 권한이 필요한 서비스입니다
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* 로그인 아이디 입력 */}
                            <div className="space-y-2">
                                <Label htmlFor="loginId">로그인 아이디</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="loginId"
                                        type="text"
                                        placeholder="로그인 아이디를 입력하세요"
                                        value={form.loginId}
                                        onChange={(e) => handleInputChange('loginId', e.target.value)}
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
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
                                    <p><strong>로그인 아이디:</strong> admin</p>
                                    <p><strong>비밀번호:</strong> admin4885</p>
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