import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Save, Plus, Settings2 } from 'lucide-react';

interface Criterion {
    id: string;
    name: string;
    weight: number;
    isActive: boolean;
    type: 'location' | 'rating' | 'experience' | 'price' | 'category' | 'custom';
    options?: {
        label: string;
        value: string;
    }[];
}

export const RecommendMatching: React.FC = () => {
    const [criteria, setCriteria] = useState<Criterion[]>([
        {
            id: '1',
            name: '위치 기반 매칭',
            weight: 30,
            isActive: true,
            type: 'location',
            options: [
                { label: '5km 이내', value: '5' },
                { label: '10km 이내', value: '10' },
                { label: '20km 이내', value: '20' }
            ]
        },
        {
            id: '2',
            name: '평점 기반 매칭',
            weight: 25,
            isActive: true,
            type: 'rating',
            options: [
                { label: '4.5점 이상', value: '4.5' },
                { label: '4.0점 이상', value: '4.0' },
                { label: '3.5점 이상', value: '3.5' }
            ]
        },
        {
            id: '3',
            name: '경력 기반 매칭',
            weight: 20,
            isActive: true,
            type: 'experience',
            options: [
                { label: '3년 이상', value: '3' },
                { label: '2년 이상', value: '2' },
                { label: '1년 이상', value: '1' }
            ]
        }
    ]);

    const handleWeightChange = (id: string, value: string) => {
        const numValue = parseInt(value);
        if (!isNaN(numValue)) {
            setCriteria(criteria.map(criterion => 
                criterion.id === id ? { ...criterion, weight: numValue } : criterion
            ));
        }
    };

    const handleActiveChange = (id: string) => {
        setCriteria(criteria.map(criterion => 
            criterion.id === id ? { ...criterion, isActive: !criterion.isActive } : criterion
        ));
    };

    const handleSave = () => {
        // TODO: API 호출하여 설정 저장
        console.log('저장된 기준:', criteria);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">추천 기준 설정</h1>
                    <p className="text-gray-600 mt-2">고객에게 추천되는 매니저 리스트의 선정 기준을 설정합니다.</p>
                </div>
                <Button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <Save className="w-4 h-4" />
                    설정 저장
                </Button>
            </div>

            <Tabs defaultValue="basic" className="space-y-4">
                <TabsList className="bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        기본 기준
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        고급 설정
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                    {criteria.map((criterion) => (
                        <Card key={criterion.id} className="border border-gray-200 hover:border-blue-200 transition-colors">
                            <CardHeader className="bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-gray-900">{criterion.name}</CardTitle>
                                        <CardDescription className="text-sm text-gray-600">
                                            {criterion.type === 'location' && '거리 기반 매칭 우선순위'}
                                            {criterion.type === 'rating' && '평점 기반 매칭 우선순위'}
                                            {criterion.type === 'experience' && '경력 기반 매칭 우선순위'}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={`active-${criterion.id}`} className="text-sm text-gray-600">
                                                활성화
                                            </Label>
                                            <input
                                                type="checkbox"
                                                id={`active-${criterion.id}`}
                                                checked={criterion.isActive}
                                                onChange={() => handleActiveChange(criterion.id)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-sm font-medium text-gray-700">가중치</Label>
                                            <span className="text-sm font-semibold text-blue-600">{criterion.weight}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={criterion.weight}
                                            onChange={(e) => handleWeightChange(criterion.id, e.target.value)}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    {criterion.options && (
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium text-gray-700">세부 옵션</Label>
                                            <Select defaultValue={criterion.options[0].value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="옵션 선택" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {criterion.options.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                    <Card className="border border-gray-200">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <CardTitle className="text-lg font-semibold text-gray-900">고급 매칭 설정</CardTitle>
                            <CardDescription className="text-sm text-gray-600">
                                더 세밀한 매칭 기준을 설정할 수 있습니다.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Button variant="outline" className="flex items-center gap-2 border-gray-300 hover:border-blue-300 hover:bg-blue-50">
                                        <Plus className="w-4 h-4" />
                                        새로운 기준 추가
                                    </Button>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-600">
                                        고급 설정에서는 다음과 같은 추가 기준을 설정할 수 있습니다:
                                    </p>
                                    <ul className="list-disc list-inside mt-2 text-sm text-gray-600 space-y-1">
                                        <li>시간대별 매칭 우선순위</li>
                                        <li>카테고리별 전문성 가중치</li>
                                        <li>고객 이력 기반 맞춤 매칭</li>
                                        <li>매니저 수요/공급 밸런스 조정</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 