export interface MatchingRecommendationSettingsRequestDto {
  firstPriority: string;  // distance, review, recent, workload, review_count
  secondPriority: string;
  thirdPriority: string;
  workloadPeriod: string; // 1week, 2week, 1month, 3month, 6month
}

export interface MatchingRecommendationSettingsResponseDto {
  id: number;
  firstPriority: string;
  secondPriority: string;
  thirdPriority: string;
  workloadPeriod: string;
  isActive: boolean;
  updatedAt: string;
}

export interface SortPriority {
  priority: number; // 1, 2, 3
  sortType: string;
}

export interface SettingsHistory {
  id: number;
  firstPriority: string;
  secondPriority: string;
  thirdPriority: string;
  workloadPeriod: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} 