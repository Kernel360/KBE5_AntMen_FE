import { customFetch } from './base'
import { API_ENDPOINTS } from './config'

// swagger에 정의된 CategoryResponseDto를 기반으로 타입을 정의합니다.
export interface Category {
  categoryId: number
  categoryName: string
  categoryPrice: number
  categoryTime: number
}

/**
 * 전체 서비스 카테고리 목록을 조회하는 API 함수
 * @returns Category[]
 */
export const getAllCategories = async (): Promise<Category[]> => {
  return customFetch<Category[]>(API_ENDPOINTS.CATEGORY)
}

// swagger에 정의된 CategoryOptionResponseDto를 기반으로 타입을 정의합니다.
export interface CategoryOption {
  optionId: number
  categoryId: number
  optionName: string
  optionPrice: number
  optionTime: number
}

/**
 * 특정 ID의 카테고리 상세 정보를 조회하는 API 함수
 * @param categoryId - 조회할 카테고리의 ID
 * @returns Category
 */
export const getCategoryById = async (
  categoryId: number,
): Promise<Category> => {
  return customFetch<Category>(`${API_ENDPOINTS.CATEGORY}/${categoryId}`)
}

/**
 * 특정 카테고리에 속한 옵션 목록을 조회하는 API 함수
 * @param categoryId - 옵션을 조회할 카테고리의 ID
 * @returns CategoryOption[]
 */
export const getCategoryOptionsByCategoryId = async (
  categoryId: number,
): Promise<CategoryOption[]> => {
  return customFetch<CategoryOption[]>(
    `${API_ENDPOINTS.CATEGORY}/${categoryId}/options`,
  )
}

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    return customFetch<Category[]>(API_ENDPOINTS.CATEGORY)
  },

  getById: async (categoryId: number): Promise<Category> => {
    return customFetch<Category>(`${API_ENDPOINTS.CATEGORY}/${categoryId}`)
  },

  getOptions: async (categoryId: number): Promise<CategoryOption[]> => {
    return customFetch<CategoryOption[]>(
      `${API_ENDPOINTS.CATEGORY}/${categoryId}/options`,
    )
  },

  // 관리자용 API
  admin: {
    create: async (data: Omit<Category, 'categoryId'>): Promise<Category> => {
      return customFetch<Category>(API_ENDPOINTS.CATEGORY, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (
      categoryId: number,
      data: Omit<Category, 'categoryId'>,
    ): Promise<Category> => {
      return customFetch<Category>(`${API_ENDPOINTS.CATEGORY}/${categoryId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    delete: async (categoryId: number): Promise<void> => {
      return customFetch<void>(`${API_ENDPOINTS.CATEGORY}/${categoryId}`, {
        method: 'DELETE',
      })
    },

    createOption: async (
      categoryId: number,
      data: Omit<CategoryOption, 'optionId' | 'categoryId'>,
    ): Promise<CategoryOption> => {
      return customFetch<CategoryOption>(
        `${API_ENDPOINTS.CATEGORY}/${categoryId}/options`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        },
      )
    },

    updateOption: async (
      categoryId: number,
      optionId: number,
      data: Omit<CategoryOption, 'optionId' | 'categoryId'>,
    ): Promise<CategoryOption> => {
      return customFetch<CategoryOption>(
        `${API_ENDPOINTS.CATEGORY}/${categoryId}/options/${optionId}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        },
      )
    },

    deleteOption: async (
      categoryId: number,
      optionId: number,
    ): Promise<void> => {
      return customFetch<void>(
        `${API_ENDPOINTS.CATEGORY}/${categoryId}/options/${optionId}`,
        {
          method: 'DELETE',
        },
      )
    },
  },
}
