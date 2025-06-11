export interface CategoryRequestDto {
  categoryName: string;
  categoryPrice: number;
  categoryTime: number;
}

export interface CategoryResponseDto {
  categoryId: number;
  categoryName: string;
  categoryPrice: number;
  categoryTime: number;
} 