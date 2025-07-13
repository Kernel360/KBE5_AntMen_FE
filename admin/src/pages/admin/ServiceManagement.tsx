import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Plus, Edit, Trash2, Search, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { adminCategoryService } from '../../api/adminCategory';
import { CategoryDto, CategoryOptionDto } from '../../api/types';



export const ServiceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'options'>('categories');
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOptionDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 카테고리 관련 상태
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    categoryName: '',
    categoryPrice: '',
    categoryTime: ''
  });

  // 카테고리 옵션 관련 상태
  const [showOptionDialog, setShowOptionDialog] = useState(false);
  const [editingOption, setEditingOption] = useState<CategoryOptionDto | null>(null);
  const [optionForm, setOptionForm] = useState({
    coName: '',
    coPrice: '',
    coTime: '',
    categoryId: ''
  });

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesData, optionsData] = await Promise.all([
          adminCategoryService.getCategories(),
          adminCategoryService.getCategoryOptions()
        ]);

        setCategories(categoriesData);
        setCategoryOptions(optionsData);
        
        // 초기에 모든 카테고리를 확장된 상태로 설정
        const allCategoryIds = new Set(categoriesData.map(cat => cat.categoryId));
        setExpandedCategories(allCategoryIds);
      } catch (err: any) {
        console.error('데이터 로딩 실패:', err);
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 헬퍼 함수: 카테고리 이름 가져오기
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : '알 수 없음';
  };

  // 카테고리별로 옵션 그룹화
  const getGroupedOptions = () => {
    const grouped: { [categoryId: number]: { category: CategoryDto; options: CategoryOptionDto[] } } = {};
    
    categories.forEach(category => {
      grouped[category.categoryId] = {
        category,
        options: categoryOptions.filter(option => option.categoryId === category.categoryId)
      };
    });
    
    return grouped;
  };

  // 카테고리 확장/축소 토글
  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // 검색 필터링
  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOptions = categoryOptions.filter(option => {
    const matchesSearch = option.coName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(option.categoryId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategoryFilter || option.categoryId.toString() === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 카테고리 폼 초기화
  const resetCategoryForm = () => {
    setCategoryForm({
      categoryName: '',
      categoryPrice: '',
      categoryTime: ''
    });
    setEditingCategory(null);
  };

  // 카테고리 옵션 폼 초기화
  const resetOptionForm = () => {
    setOptionForm({
      coName: '',
      coPrice: '',
      coTime: '',
      categoryId: ''
    });
    setEditingOption(null);
  };

  // 카테고리 추가/수정
  const handleCategorySubmit = async () => {
    if (!categoryForm.categoryName || !categoryForm.categoryPrice || !categoryForm.categoryTime) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const categoryData = {
      categoryName: categoryForm.categoryName,
      categoryPrice: parseInt(categoryForm.categoryPrice),
      categoryTime: parseInt(categoryForm.categoryTime)
    };

    try {
      if (editingCategory) {
        // 수정
        const updatedCategory = await adminCategoryService.updateCategory(editingCategory.categoryId, categoryData);
        setCategories(prev => prev.map(cat => 
          cat.categoryId === editingCategory.categoryId 
            ? updatedCategory
            : cat
        ));
      } else {
        // 추가
        const newCategory = await adminCategoryService.createCategory(categoryData);
        setCategories(prev => [...prev, newCategory]);
        
        // 새로 추가된 카테고리를 확장된 상태로 설정
        setExpandedCategories(prev => new Set([...Array.from(prev), newCategory.categoryId]));
      }

      setShowCategoryDialog(false);
      resetCategoryForm();
    } catch (error: any) {
      console.error('카테고리 저장 실패:', error);
      alert(error.message || '카테고리 저장에 실패했습니다.');
    }
  };

  // 카테고리 옵션 추가/수정
  const handleOptionSubmit = async () => {
    if (!optionForm.coName || !optionForm.coPrice || !optionForm.coTime || !optionForm.categoryId) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const optionData = {
      coName: optionForm.coName,
      coPrice: parseInt(optionForm.coPrice),
      coTime: parseInt(optionForm.coTime),
      categoryId: parseInt(optionForm.categoryId)
    };

    try {
      if (editingOption) {
        // 수정
        const updatedOption = await adminCategoryService.updateCategoryOption(editingOption.coId, optionData);
        setCategoryOptions(prev => prev.map(opt => 
          opt.coId === editingOption.coId 
            ? updatedOption
            : opt
        ));
      } else {
        // 추가
        const newOption = await adminCategoryService.createCategoryOption(optionData);
        setCategoryOptions(prev => [...prev, newOption]);
      }

      setShowOptionDialog(false);
      resetOptionForm();
    } catch (error: any) {
      console.error('카테고리 옵션 저장 실패:', error);
      alert(error.message || '카테고리 옵션 저장에 실패했습니다.');
    }
  };

  // 카테고리 삭제
  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
      try {
        await adminCategoryService.deleteCategory(categoryId);
        setCategories(prev => prev.filter(cat => cat.categoryId !== categoryId));
      } catch (error: any) {
        console.error('카테고리 삭제 실패:', error);
        alert(error.message || '카테고리 삭제에 실패했습니다.');
      }
    }
  };

  // 카테고리 옵션 삭제
  const handleDeleteOption = async (coId: number) => {
    if (window.confirm('정말로 이 카테고리 옵션을 삭제하시겠습니까?')) {
      try {
        await adminCategoryService.deleteCategoryOption(coId);
        setCategoryOptions(prev => prev.filter(opt => opt.coId !== coId));
      } catch (error: any) {
        console.error('카테고리 옵션 삭제 실패:', error);
        alert(error.message || '카테고리 옵션 삭제에 실패했습니다.');
      }
    }
  };

  // 카테고리 수정 모달 열기
  const openEditCategory = (category: CategoryDto) => {
    setEditingCategory(category);
    setCategoryForm({
      categoryName: category.categoryName,
      categoryPrice: category.categoryPrice.toString(),
      categoryTime: category.categoryTime.toString()
    });
    setShowCategoryDialog(true);
  };

  // 카테고리 옵션 수정 모달 열기
  const openEditOption = (option: CategoryOptionDto) => {
    setEditingOption(option);
    setOptionForm({
      coName: option.coName,
      coPrice: option.coPrice.toString(),
      coTime: option.coTime.toString(),
      categoryId: option.categoryId.toString()
    });
    setShowOptionDialog(true);
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 h-8 w-8" />
            서비스 관리
          </h1>
          <p className="text-gray-600 mt-2">서비스 카테고리와 옵션을 관리합니다.</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-3 h-8 w-8" />
            서비스 관리
          </h1>
          <p className="text-gray-600 mt-2">서비스 카테고리와 옵션을 관리합니다.</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">오류: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Settings className="mr-3 h-8 w-8" />
          서비스 관리
        </h1>
        <p className="text-gray-600 mt-2">서비스 카테고리와 옵션을 관리합니다.</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('categories');
              setSearchTerm('');
              setSelectedCategoryFilter('');
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            카테고리 관리
          </button>
          <button
            onClick={() => {
              setActiveTab('options');
              setSearchTerm('');
              setSelectedCategoryFilter('');
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'options'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            카테고리 옵션 관리
          </button>
        </nav>
      </div>

      {/* 검색 및 액션 버튼 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">검색 및 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-3 flex-1">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={`${activeTab === 'categories' ? '카테고리' : '옵션'} 이름${activeTab === 'options' ? ' 또는 소속 카테고리' : ''}으로 검색...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {activeTab === 'options' && (
                <div className="md:w-48">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full h-10 px-3 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[right_8px_center]"
                  >
                    <option value="">모든 카테고리</option>
                    {categories.map(category => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <Dialog 
              open={activeTab === 'categories' ? showCategoryDialog : showOptionDialog}
              onOpenChange={activeTab === 'categories' ? setShowCategoryDialog : setShowOptionDialog}
            >
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    if (activeTab === 'categories') {
                      resetCategoryForm();
                      setShowCategoryDialog(true);
                    } else {
                      resetOptionForm();
                      setShowOptionDialog(true);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {activeTab === 'categories' ? '카테고리 추가' : '옵션 추가'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {activeTab === 'categories' 
                      ? (editingCategory ? '카테고리 수정' : '카테고리 추가')
                      : (editingOption ? '옵션 수정' : '옵션 추가')
                    }
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {activeTab === 'categories' ? (
                    <>
                      <div>
                        <Label htmlFor="categoryName">카테고리명</Label>
                        <Input
                          id="categoryName"
                          value={categoryForm.categoryName}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, categoryName: e.target.value }))}
                          placeholder="카테고리명을 입력하세요"
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryPrice">기본 가격 (원)</Label>
                        <Input
                          id="categoryPrice"
                          type="number"
                          value={categoryForm.categoryPrice}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, categoryPrice: e.target.value }))}
                          placeholder="기본 가격을 입력하세요"
                        />
                      </div>
                      <div>
                        <Label htmlFor="categoryTime">소요 시간 (시간)</Label>
                        <Input
                          id="categoryTime"
                          type="number"
                          value={categoryForm.categoryTime}
                          onChange={(e) => setCategoryForm(prev => ({ ...prev, categoryTime: e.target.value }))}
                          placeholder="소요 시간을 입력하세요"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="categorySelect">소속 카테고리</Label>
                        <select
                          id="categorySelect"
                          value={optionForm.categoryId}
                          onChange={(e) => setOptionForm(prev => ({ ...prev, categoryId: e.target.value }))}
                          className="w-full h-10 px-3 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDFMNiA2TDExIDEiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[right_8px_center]"
                        >
                          <option value="">카테고리를 선택하세요</option>
                          {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>
                              {category.categoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="coName">옵션명</Label>
                        <Input
                          id="coName"
                          value={optionForm.coName}
                          onChange={(e) => setOptionForm(prev => ({ ...prev, coName: e.target.value }))}
                          placeholder="옵션명을 입력하세요"
                        />
                      </div>
                      <div>
                        <Label htmlFor="coPrice">추가 가격 (원)</Label>
                        <Input
                          id="coPrice"
                          type="number"
                          value={optionForm.coPrice}
                          onChange={(e) => setOptionForm(prev => ({ ...prev, coPrice: e.target.value }))}
                          placeholder="추가 가격을 입력하세요"
                        />
                      </div>
                      <div>
                        <Label htmlFor="coTime">추가 시간 (분)</Label>
                        <Input
                          id="coTime"
                          type="number"
                          value={optionForm.coTime}
                          onChange={(e) => setOptionForm(prev => ({ ...prev, coTime: e.target.value }))}
                          placeholder="추가 시간을 입력하세요"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={activeTab === 'categories' ? handleCategorySubmit : handleOptionSubmit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {activeTab === 'categories' 
                        ? (editingCategory ? '수정' : '추가')
                        : (editingOption ? '수정' : '추가')
                      }
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (activeTab === 'categories') {
                          setShowCategoryDialog(false);
                          resetCategoryForm();
                        } else {
                          setShowOptionDialog(false);
                          resetOptionForm();
                        }
                      }}
                      className="flex-1"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* 카테고리 목록 */}
      {activeTab === 'categories' && (
        <Card>
          <CardHeader>
            <CardTitle>카테고리 목록 ({filteredCategories.length}개)</CardTitle>
            <CardDescription>등록된 서비스 카테고리를 관리할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10%]">ID</TableHead>
                    <TableHead className="w-[30%]">카테고리명</TableHead>
                    <TableHead className="w-[20%]">기본 가격</TableHead>
                    <TableHead className="w-[20%]">소요 시간</TableHead>
                    <TableHead className="w-[20%]">관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.categoryId}>
                      <TableCell className="font-medium">{category.categoryId}</TableCell>
                      <TableCell>{category.categoryName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-blue-600">
                          ₩{category.categoryPrice.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          {category.categoryTime}시간
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditCategory(category)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.categoryId)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 카테고리 옵션 목록 */}
      {activeTab === 'options' && (
        <>
          {/* 검색 결과가 있을 때는 기존 테이블 형태로 표시 */}
          {(searchTerm || selectedCategoryFilter) ? (
            <Card>
              <CardHeader>
                <CardTitle>검색 결과 ({filteredOptions.length}개)</CardTitle>
                <CardDescription>검색된 카테고리 옵션 목록입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[8%]">ID</TableHead>
                        <TableHead className="w-[25%]">옵션명</TableHead>
                        <TableHead className="w-[20%]">소속 카테고리</TableHead>
                        <TableHead className="w-[15%]">추가 가격</TableHead>
                        <TableHead className="w-[15%]">추가 시간</TableHead>
                        <TableHead className="w-[17%]">관리</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOptions.map((option) => (
                        <TableRow key={option.coId}>
                          <TableCell className="font-medium">{option.coId}</TableCell>
                          <TableCell>{option.coName}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-gray-700 bg-gray-100">
                              {getCategoryName(option.categoryId)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-blue-600">
                              +₩{option.coPrice.toLocaleString()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-600">
                              +{option.coTime}분
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditOption(option)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteOption(option.coId)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* 카테고리별 그룹화된 뷰 */
            <div className="space-y-4">
              {Object.values(getGroupedOptions()).map(({ category, options }) => (
                <Card key={category.categoryId} className="overflow-hidden">
                  {/* 카테고리 헤더 */}
                  <div 
                    className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleCategoryExpansion(category.categoryId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {expandedCategories.has(category.categoryId) ? (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{category.categoryName}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-blue-600">
                              기본 ₩{category.categoryPrice.toLocaleString()}
                            </Badge>
                            <Badge variant="outline" className="text-green-600">
                              {category.categoryTime}시간
                            </Badge>
                            <Badge variant="secondary">
                              옵션 {options.length}개
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOptionForm(prev => ({ ...prev, categoryId: category.categoryId.toString() }));
                          setShowOptionDialog(true);
                        }}
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        옵션 추가
                      </Button>
                    </div>
                  </div>

                  {/* 옵션 목록 (확장된 경우에만 표시) */}
                  {expandedCategories.has(category.categoryId) && (
                    <CardContent className="p-0">
                      {options.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          이 카테고리에는 아직 옵션이 없습니다.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[10%]">ID</TableHead>
                                <TableHead className="w-[35%]">옵션명</TableHead>
                                <TableHead className="w-[20%]">추가 가격</TableHead>
                                <TableHead className="w-[20%]">추가 시간</TableHead>
                                <TableHead className="w-[15%]">관리</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {options.map((option) => (
                                <TableRow key={option.coId}>
                                  <TableCell className="font-medium">{option.coId}</TableCell>
                                  <TableCell>{option.coName}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="text-blue-600">
                                      +₩{option.coPrice.toLocaleString()}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="text-green-600">
                                      +{option.coTime}분
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditOption(option)}
                                        className="h-8 w-8 p-0"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDeleteOption(option.coId)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
              
              {/* 카테고리가 없는 경우 */}
              {categories.length === 0 && (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    먼저 카테고리를 생성해주세요. 카테고리 탭에서 카테고리를 추가할 수 있습니다.
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}; 