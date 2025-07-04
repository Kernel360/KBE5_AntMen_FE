export const formatDate = (dateInput: string | number[]): string => {
  let date: Date;
  
  if (Array.isArray(dateInput)) {
    // number[] 형식의 Java LocalDateTime 처리 ([year, month, day, hour, minute, second, nano])
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
    date = new Date(year, month - 1, day, hour, minute, second);
  } else {
    date = new Date(dateInput);
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 1분 미만
  if (diff < 60 * 1000) {
    return '방금 전';
  }
  
  // 1시간 미만
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}분 전`;
  }
  
  // 24시간 미만
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}시간 전`;
  }
  
  // 7일 미만
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}일 전`;
  }
  
  // 그 외의 경우 YYYY.MM.DD 형식으로 표시
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\./g, '.').trim();
}; 