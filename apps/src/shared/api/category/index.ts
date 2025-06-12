import type { CategoryRequestDto, CategoryResponseDto } from './types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:19090'

export async function getCategories(): Promise<CategoryResponseDto[]> {
  const res = await fetch(`${BASE_URL}/category`, { cache: 'no-store' })
  if (!res.ok) throw new Error('카테고리 목록을 불러오지 못했습니다.')
  return res.json()
}

export async function getCategory(id: number): Promise<CategoryResponseDto> {
  const res = await fetch(`${BASE_URL}/category/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('카테고리 정보를 불러오지 못했습니다.')
  return res.json()
}

export async function createCategory(
  data: CategoryRequestDto,
): Promise<CategoryResponseDto> {
  const res = await fetch(`${BASE_URL}/category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('카테고리 생성에 실패했습니다.')
  return res.json()
}

export async function updateCategory(
  id: number,
  data: CategoryRequestDto,
): Promise<CategoryResponseDto> {
  const res = await fetch(`${BASE_URL}/category/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('카테고리 수정에 실패했습니다.')
  return res.json()
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/category/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('카테고리 삭제에 실패했습니다.')
}
