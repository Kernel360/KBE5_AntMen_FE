import apiClient from '../lib/apiClient';
import { 
    CategoryDto, 
    CategoryRequestDto,
    CategoryOptionDto,
    CategoryOptionRequestDto 
} from './types';

export const adminCategoryService = {
    getCategories: async (): Promise<CategoryDto[]> => {
        const response = await apiClient.get('/common/categories');
        return response.data;
    },
    getCategoryOptions: async (): Promise<CategoryOptionDto[]> => {
        const response = await apiClient.get('/admin/category-options');
        return response.data;
    },
    getCategoryById: async (categoryId: number): Promise<CategoryDto> => {
        const response = await apiClient.get(`/common/categories/${categoryId}`);
        return response.data;
    },
    createCategory: async (categoryData: CategoryRequestDto): Promise<CategoryDto> => {
        const response = await apiClient.post('/common/categories', categoryData);
        return response.data;
    },
    updateCategory: async (categoryId: number, categoryData: CategoryRequestDto): Promise<CategoryDto> => {
        const response = await apiClient.put(`/common/categories/${categoryId}`, categoryData);
        return response.data;
    },
    deleteCategory: async (categoryId: number): Promise<void> => {
        await apiClient.delete(`/common/categories/${categoryId}`);
    },
    createCategoryOption: async (optionData: CategoryOptionRequestDto): Promise<CategoryOptionDto> => {
        const response = await apiClient.post('/admin/category-options', optionData);
        return response.data;
    },
    updateCategoryOption: async (coId: number, optionData: CategoryOptionRequestDto): Promise<CategoryOptionDto> => {
        const response = await apiClient.put(`/admin/category-options/${coId}`, optionData);
        return response.data;
    },
    deleteCategoryOption: async (coId: number): Promise<void> => {
        await apiClient.delete(`/admin/category-options/${coId}`);
    },
};