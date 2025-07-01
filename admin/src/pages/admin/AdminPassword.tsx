import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
    Lock, 
    Eye, 
    EyeOff, 
    AlertCircle, 
    CheckCircle, 
    ArrowLeft,
    Shield
} from 'lucide-react';
import { adminService } from '../../api/adminService';

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const AdminPassword: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<PasswordForm>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (field: keyof PasswordForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateForm = (): string | null => {
        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            return '모든 필드를 입력해주세요.';
        }

        if (form.newPassword.length < 6) {
            return '새 비밀번호는 최소 6자 이상이어야 합니다.';
        }

        if (form.newPassword === form.currentPassword) {
            return '새 비밀번호는 현재 비밀번호와 달라야 합니다.';
        }

        if (form.newPassword !== form.confirmPassword) {
            return '새 비밀번호와 비밀번호 확인이 일치하지 않습니다.';
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await adminService.changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword
            });

            setSuccess(true);
            
            // 3초 후 대시보드로 이동
            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 3000);

        } catch (error: any) {
            if (error.response?.status === 400) {
                setError('현재 비밀번호가 올바르지 않습니다.');
            } else if (error.response?.status === 401) {
                setError('인증이 만료되었습니다. 다시 로그인해주세요.');
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError(`비밀번호 변경 중 오류가 발생했습니다: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="flex flex-col items-center justify-center p-8">
                        <div className="rounded-full bg-green-100 p-3 mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">비밀번호 변경 완료!</h2>
                        <p className="text-gray-600 text-center">
                            비밀번호가 성공적으로 변경되었습니다.<br />
                            잠시 후 대시보드로 이동합니다.
                        </p>
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
                    <h1 className="text-3xl font-bold text-gray-900">비밀번호 변경</h1>
                    <p className="text-gray-600">보안을 위해 정기적으로 비밀번호를 변경해주세요</p>
                </div>

                {/* 뒤로가기 버튼 */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center space-x-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>대시보드로 돌아가기</span>
                </Button>

                {/* 테스트 안내 */}
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-2">
                            <div className="rounded-full bg-yellow-100 p-1">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-yellow-900">테스트 기간 안내</h4>
                                <p className="text-sm text-yellow-700">
                                    테스트 기간 중에는 비밀번호 변경 후 <strong>admin4885</strong>로 되돌려 주시기 바랍니다.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 비밀번호 변경 폼 */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl text-center">비밀번호 변경</CardTitle>
                        <CardDescription className="text-center">
                            현재 비밀번호와 새 비밀번호를 입력해주세요
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* 현재 비밀번호 */}
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="currentPassword"
                                        type={showPasswords.current ? 'text' : 'password'}
                                        placeholder="현재 비밀번호를 입력하세요"
                                        value={form.currentPassword}
                                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                        className="pl-10 pr-10"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('current')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
                                    >
                                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* 새 비밀번호 */}
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">새 비밀번호</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="newPassword"
                                        type={showPasswords.new ? 'text' : 'password'}
                                        placeholder="새 비밀번호를 입력하세요"
                                        value={form.newPassword}
                                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                        className="pl-10 pr-10"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
                                    >
                                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    최소 6자 이상
                                </p>
                            </div>

                            {/* 비밀번호 확인 */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        id="confirmPassword"
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        placeholder="새 비밀번호를 다시 입력하세요"
                                        value={form.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className="pl-10 pr-10"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
                                    >
                                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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

                            {/* 변경 버튼 */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        비밀번호 변경 중...
                                    </>
                                ) : (
                                    '비밀번호 변경'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}; 