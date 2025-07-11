import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Plus, Edit, Trash2, Search, Settings } from 'lucide-react';

// 목업 데이터
const mockCategories = [
  {
    categoryId: 1,
    categoryName: "가사 청소",
    categoryPrice: 40000,
    categoryTime: 2
  },
  {
    categoryId: 3,
    categoryName: "주방 청소",
    categoryPrice: 20000,
    categoryTime: 1
  },
  {
    categoryId: 4,
    categoryName: "사무실 청소",
    categoryPrice: 25000,
    categoryTime: 2
  },
  {
    categoryId: 5,
    categoryName: "입주 청소",
    categoryPrice: 70000,
    categoryTime: 4
  },
  {
    categoryId: 6,
    categoryName: "육아 서비스",
    categoryPrice: 40000,
    categoryTime: 2
  }
];

const mockCategoryOptions = [
  {
    coId: 1,
    coName: "세탁",
    coPrice: 10000,
    coTime: 60,
    categoryId: 1  // 가사 청소
  },
  {
    coId: 2,
    coName: "창틀 청소",
    coPrice: 10000,
    coTime: 30,
    categoryId: 1  // 가사 청소
  },
  {
    coId: 3,
    coName: "베란다 청소",
    coPrice: 10000,
    coTime: 60,
    categoryId: 1  // 가사 청소
  },
  {
    coId: 4,
    coName: "화장실 청소",
    coPrice: 20000,
    coTime: 60,
    categoryId: 1  // 가사 청소
  },
  {
    coId: 5,
    coName: "냉장실 청소",
    coPrice: 10000,
    coTime: 60,
    categoryId: 3  // 주방 청소
  },
  {
    coId: 6,
    coName: "간단 요리",
    coPrice: 10000,
    coTime: 30,
    categoryId: 3  // 주방 청소
  },
  {
    coId: 7,
    coName: "가구 옮기기",
    coPrice: 30000,
    coTime: 60,
    categoryId: 4  // 사무실 청소
  },
  {
    coId: 8,
    coName: "서류 정리",
    coPrice: 10000,
    coTime: 30,
    categoryId: 4  // 사무실 청소
  },
  {
    coId: 9,
    coName: "가구 버리기",
    coPrice: 30000,
    coTime: 60,
    categoryId: 5  // 입주 청소
  },
  {
    coId: 10,
    coName: "물품 포장",
    coPrice: 20000,
    coTime: 60,
    categoryId: 5  // 입주 청소
  },
  {
    coId: 11,
    coName: "의류 포장",
    coPrice: 20000,
    coTime: 60,
    categoryId: 5  // 입주 청소
  },
  {
    coId: 12,
    coName: "아이 등하교",
    coPrice: 10000,
    coTime: 30,
    categoryId: 6  // 육아 서비스
  },
  {
    coId: 13,
    coName: "간단 요리",
    coPrice: 10000,
    coTime: 30,
    categoryId: 6  // 육아 서비스
  }
];

interface Category {
  categoryId: number;
  categoryName: string;
  categoryPrice: number;
  categoryTime: number;
}

interface CategoryOption {
  coId: number;
  coName: string;
  coPrice: number;
  coTime: number;
  categoryId: number;
}

export const ServiceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'options'>('categories');
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>(mockCategoryOptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  // 카테고리 관련 상태
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    categoryName: '',
    categoryPrice: '',
    categoryTime: ''
  });

  // 카테고리 옵션 관련 상태
  const [showOptionDialog, setShowOptionDialog] = useState(false);
  const [editingOption, setEditingOption] = useState<CategoryOption | null>(null);
  const [optionForm, setOptionForm] = useState({
    coName: '',
    coPrice: '',
    coTime: '',
    categoryId: ''
  });

  // 헬퍼 함수: 카테고리 이름 가져오기
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : '알 수 없음';
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
  const handleCategorySubmit = () => {
    if (!categoryForm.categoryName || !categoryForm.categoryPrice || !categoryForm.categoryTime) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const categoryData = {
      categoryName: categoryForm.categoryName,
      categoryPrice: parseInt(categoryForm.categoryPrice),
      categoryTime: parseInt(categoryForm.categoryTime)
    };

    if (editingCategory) {
      // 수정
      setCategories(prev => prev.map(cat => 
        cat.categoryId === editingCategory.categoryId 
          ? { ...cat, ...categoryData }
          : cat
      ));
    } else {
      // 추가
      const newCategory = {
        categoryId: Math.max(...categories.map(c => c.categoryId)) + 1,
        ...categoryData
      };
      setCategories(prev => [...prev, newCategory]);
    }

    setShowCategoryDialog(false);
    resetCategoryForm();
  };

  // 카테고리 옵션 추가/수정
  const handleOptionSubmit = () => {
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

    if (editingOption) {
      // 수정
      setCategoryOptions(prev => prev.map(opt => 
        opt.coId === editingOption.coId 
          ? { ...opt, ...optionData }
          : opt
      ));
    } else {
      // 추가
      const newOption = {
        coId: Math.max(...categoryOptions.map(o => o.coId)) + 1,
        ...optionData
      };
      setCategoryOptions(prev => [...prev, newOption]);
    }

    setShowOptionDialog(false);
    resetOptionForm();
  };

  // 카테고리 삭제
  const handleDeleteCategory = (categoryId: number) => {
    if (window.confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
      setCategories(prev => prev.filter(cat => cat.categoryId !== categoryId));
    }
  };

  // 카테고리 옵션 삭제
  const handleDeleteOption = (coId: number) => {
    if (window.confirm('정말로 이 카테고리 옵션을 삭제하시겠습니까?')) {
      setCategoryOptions(prev => prev.filter(opt => opt.coId !== coId));
    }
  };

  // 카테고리 수정 모달 열기
  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      categoryName: category.categoryName,
      categoryPrice: category.categoryPrice.toString(),
      categoryTime: category.categoryTime.toString()
    });
    setShowCategoryDialog(true);
  };

  // 카테고리 옵션 수정 모달 열기
  const openEditOption = (option: CategoryOption) => {
    setEditingOption(option);
    setOptionForm({
      coName: option.coName,
      coPrice: option.coPrice.toString(),
      coTime: option.coTime.toString(),
      categoryId: option.categoryId.toString()
    });
    setShowOptionDialog(true);
  };

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
        <Card>
          <CardHeader>
            <CardTitle>카테고리 옵션 목록 ({filteredOptions.length}개)</CardTitle>
            <CardDescription>등록된 카테고리 옵션을 관리할 수 있습니다.</CardDescription>
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
      )}
    </div>
  );
}; 