/**
 * 주어진 날짜로부터 현재까지의 상대적 시간을 계산하여 반환합니다.
 * @param date 기준 날짜
 * @returns 상대적 시간 문자열 (예: "방금 전", "5분 전", "2시간 전" 등)
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  
  return date.toLocaleDateString();
}; 