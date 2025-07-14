import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Save, RefreshCw, History, Clock, Trash2 } from 'lucide-react';
import { 
  getCurrentMatchingRecommendationSettings,
  saveMatchingRecommendationSettings,
  resetMatchingRecommendationSettings,
  getMatchingRecommendationSettingsHistory,
  activateMatchingRecommendationSettings,
  deleteMatchingRecommendationSettings
} from '../../api/adminMatchingRecommendation';
import { 
  MatchingRecommendationSettingsRequestDto,
  MatchingRecommendationSettingsResponseDto,
  SortPriority,
  SettingsHistory
} from '../../types/matchingRecommendation';

// 정렬 기준 옵션들
const SORT_OPTIONS = [
    { value: 'distance', label: '거리순' },
    { value: 'review', label: '평점순' },
    { value: 'recent', label: '최근가입순' },
    { value: 'workload', label: '근무량순' },
    { value: 'review_count', label: '리뷰개수순' }
];

// 근무량 기간 옵션들
const WORKLOAD_PERIOD_OPTIONS = [
    { value: '1week', label: '1주일' },
    { value: '2week', label: '2주일' },
    { value: '1month', label: '1개월' },
    { value: '3month', label: '3개월' },
    { value: '6month', label: '6개월' }
];



export const RecommendMatching: React.FC = () => {
    const [sortPriorities, setSortPriorities] = useState<SortPriority[]>([
        { priority: 1, sortType: 'distance' },
        { priority: 2, sortType: 'review' },
        { priority: 3, sortType: 'recent' }
    ]);
    
    const [workloadPeriod, setWorkloadPeriod] = useState<string>('1month');
    const [settingsHistory, setSettingsHistory] = useState<SettingsHistory[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentSettings, setCurrentSettings] = useState<MatchingRecommendationSettingsResponseDto | null>(null);

    // 컴포넌트 로드 시 현재 설정 가져오기
    useEffect(() => {
        loadCurrentSettings();
        loadSettingsHistory();
    }, []);

    // 현재 설정 로드
    const loadCurrentSettings = async () => {
        try {
            setIsLoading(true);
            const settings = await getCurrentMatchingRecommendationSettings();
            setCurrentSettings(settings);
            
            // UI 상태 업데이트
            setSortPriorities([
                { priority: 1, sortType: settings.firstPriority },
                { priority: 2, sortType: settings.secondPriority },
                { priority: 3, sortType: settings.thirdPriority }
            ]);
            setWorkloadPeriod(settings.workloadPeriod);
        } catch (error) {
            console.error('현재 설정 로드 실패:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePriorityChange = (priority: number, newSortType: string) => {
        setSortPriorities(prev => 
            prev.map(item => 
                item.priority === priority 
                    ? { ...item, sortType: newSortType }
                    : item
            )
        );
    };

    const handleSave = async () => {
        try {
            const requestDto: MatchingRecommendationSettingsRequestDto = {
                firstPriority: sortPriorities.find(p => p.priority === 1)?.sortType || 'distance',
                secondPriority: sortPriorities.find(p => p.priority === 2)?.sortType || 'review',
                thirdPriority: sortPriorities.find(p => p.priority === 3)?.sortType || 'recent',
                workloadPeriod: workloadPeriod
            };

            const savedSettings = await saveMatchingRecommendationSettings(requestDto);
            setCurrentSettings(savedSettings);
            
            // 히스토리 다시 로드
            loadSettingsHistory();
            
            alert('설정이 성공적으로 저장되었습니다.');
        } catch (error) {
            console.error('설정 저장 실패:', error);
            alert('설정 저장에 실패했습니다.');
        }
    };

    const handleReset = async () => {
        try {
            const defaultSettings = await resetMatchingRecommendationSettings();
            setCurrentSettings(defaultSettings);
            
            // UI 상태 업데이트
            setSortPriorities([
                { priority: 1, sortType: defaultSettings.firstPriority },
                { priority: 2, sortType: defaultSettings.secondPriority },
                { priority: 3, sortType: defaultSettings.thirdPriority }
            ]);
            setWorkloadPeriod(defaultSettings.workloadPeriod);
            
            // 히스토리 다시 로드
            loadSettingsHistory();
            
            alert('설정이 기본값으로 초기화되었습니다.');
        } catch (error) {
            console.error('설정 초기화 실패:', error);
            alert('설정 초기화에 실패했습니다.');
        }
    };

    // 설정 히스토리 로드
    const loadSettingsHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const history = await getMatchingRecommendationSettingsHistory();
            // 타입 변환
            const convertedHistory: SettingsHistory[] = history.map(item => ({
                id: item.id,
                firstPriority: item.firstPriority,
                secondPriority: item.secondPriority,
                thirdPriority: item.thirdPriority,
                workloadPeriod: item.workloadPeriod,
                isActive: item.isActive,
                createdAt: item.updatedAt, // createdAt이 없으므로 updatedAt 사용
                updatedAt: item.updatedAt
            }));
            setSettingsHistory(convertedHistory);
        } catch (error) {
            console.error('설정 히스토리 로드 실패:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // 특정 설정 활성화
    const activateSettings = async (settingsId: number) => {
        try {
            const activatedSettings = await activateMatchingRecommendationSettings(settingsId);
            setCurrentSettings(activatedSettings);
            
            // UI 상태 업데이트
            setSortPriorities([
                { priority: 1, sortType: activatedSettings.firstPriority },
                { priority: 2, sortType: activatedSettings.secondPriority },
                { priority: 3, sortType: activatedSettings.thirdPriority }
            ]);
            setWorkloadPeriod(activatedSettings.workloadPeriod);
            
            // 히스토리 다시 로드
            loadSettingsHistory();
            
            alert('설정이 활성화되었습니다.');
        } catch (error) {
            console.error('설정 활성화 실패:', error);
            alert('설정 활성화에 실패했습니다.');
        }
    };

    // 특정 설정 삭제
    const deleteSettings = async (settingsId: number) => {
        if (!window.confirm('이 설정을 삭제하시겠습니까?')) {
            return;
        }
        
        try {
            await deleteMatchingRecommendationSettings(settingsId);
            
            // 현재 설정이 삭제된 경우 기본값으로 재로드
            if (currentSettings?.id === settingsId) {
                loadCurrentSettings();
            }
            
            // 히스토리 다시 로드
            loadSettingsHistory();
            
            alert('설정이 삭제되었습니다.');
        } catch (error) {
            console.error('설정 삭제 실패:', error);
            alert('설정 삭제에 실패했습니다.');
        }
    };

    // 날짜 포맷팅
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-4 text-gray-600">설정을 불러오는 중...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">매칭 추천 기준 설정</h1>
                    <p className="text-gray-600 mt-2">고객에게 추천되는 매니저 리스트의 정렬 우선순위를 설정합니다.</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        onClick={handleReset} 
                        variant="outline" 
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        기본값 초기화
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Save className="w-4 h-4" />
                        설정 저장
                    </Button>
                </div>
            </div>

            <Card className="border border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <CardTitle className="text-lg font-semibold text-gray-900">정렬 우선순위 설정</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                        매니저 추천 시 적용할 정렬 기준의 우선순위를 설정합니다. (3개까지 선택 가능)
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-6">
                        {/* 우선순위 설정 */}
                        <div className="space-y-4">
                            {sortPriorities.map((item) => (
                                <div key={item.priority} className="flex items-center gap-4">
                                    <Label className="w-16 text-sm font-medium text-gray-700">
                                        {item.priority}순위:
                                    </Label>
                                    <select 
                                        value={item.sortType} 
                                        onChange={(e) => handlePriorityChange(item.priority, e.target.value)}
                                        className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm font-medium"
                                    >
                                        {SORT_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value} className="text-gray-900">
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        {/* 근무량 기간 설정 */}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-4">
                                <Label className="text-sm font-medium text-gray-700">
                                    근무량 기준 기간:
                                </Label>
                                <select 
                                    value={workloadPeriod} 
                                    onChange={(e) => setWorkloadPeriod(e.target.value)}
                                    className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm font-medium"
                                >
                                    {WORKLOAD_PERIOD_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value} className="text-gray-900">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                * 근무량순을 선택했을 때 적용되는 기간입니다.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 설정 미리보기 */}
            <Card className="border border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <CardTitle className="text-lg font-semibold text-gray-900">설정 미리보기</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                        현재 설정된 정렬 우선순위입니다.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-2">
                        {sortPriorities.map((item) => (
                            <div key={item.priority} className="flex items-center gap-2">
                                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                    {item.priority}
                                </span>
                                <span className="text-gray-700">
                                    {SORT_OPTIONS.find(opt => opt.value === item.sortType)?.label}
                                </span>
                            </div>
                        ))}
                    </div>
                    {sortPriorities.some(item => item.sortType === 'workload') && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                근무량 기준: 최근 {WORKLOAD_PERIOD_OPTIONS.find(opt => opt.value === workloadPeriod)?.label}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 설정 히스토리 */}
            <Card className="border border-gray-200">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <History className="w-5 h-5" />
                        설정 히스토리
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                        과거에 저장된 설정들을 확인하고 다시 적용할 수 있습니다.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    {isLoadingHistory ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">히스토리 로딩 중...</span>
                        </div>
                    ) : settingsHistory.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>아직 저장된 설정이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {settingsHistory.map((setting) => (
                                <div key={setting.id} className="border border-gray-200 rounded-lg p-3.5 hover:bg-gray-50 transition-colors">
                                    {/* 헤더 */}
                                    <div className="flex items-center justify-between mb-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">
                                                설정 #{setting.id}
                                            </span>
                                            {setting.isActive && (
                                                <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                                    활성
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 text-right">
                                            {formatDate(setting.updatedAt)}
                                        </div>
                                    </div>
                                    
                                    {/* 우선순위 */}
                                    <div className="mb-2.5">
                                        <div className="text-sm font-medium text-gray-700 mb-1.5">우선순위</div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
                                                <span className="text-sm text-gray-600">
                                                    {SORT_OPTIONS.find(opt => opt.value === setting.firstPriority)?.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
                                                <span className="text-sm text-gray-600">
                                                    {SORT_OPTIONS.find(opt => opt.value === setting.secondPriority)?.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
                                                <span className="text-sm text-gray-600">
                                                    {SORT_OPTIONS.find(opt => opt.value === setting.thirdPriority)?.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* 근무량 기간 */}
                                    <div className="mb-2.5">
                                        <div className="text-sm font-medium text-gray-700 mb-1">근무량 기간</div>
                                        <p className="text-sm text-gray-600">
                                            {WORKLOAD_PERIOD_OPTIONS.find(opt => opt.value === setting.workloadPeriod)?.label}
                                        </p>
                                    </div>
                                    
                                    {/* 버튼 영역 */}
                                    {!setting.isActive && (
                                        <div className="flex justify-between items-center pt-1.5 border-t border-gray-100">
                                            <Button 
                                                onClick={() => deleteSettings(setting.id)}
                                                variant="outline" 
                                                size="sm"
                                                className="text-red-600 border-red-600 hover:bg-red-50 text-sm px-2 py-1 h-6.5"
                                            >
                                                <Trash2 className="w-3 h-3 mr-1" />
                                                삭제
                                            </Button>
                                            <Button 
                                                onClick={() => activateSettings(setting.id)}
                                                variant="outline" 
                                                size="sm"
                                                className="text-blue-600 border-blue-600 hover:bg-blue-50 text-sm px-2.5 py-1 h-6.5"
                                            >
                                                복원
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}; 