import { formatDistanceToNow, format, isWithinInterval, subDays, isValid } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * Java LocalDateTime 배열을 JavaScript Date로 변환
 * [year, month, day, hour, minute, second, nano] 형태의 배열을 처리
 */
const parseJavaLocalDateTime = (dateArray: number[]): Date | null => {
  try {
    if (!Array.isArray(dateArray) || dateArray.length < 6) {
      return null;
    }
    
    const [year, month, day, hour, minute, second, nano = 0] = dateArray;
    
    // Java의 month는 1부터 시작하지만 JavaScript는 0부터 시작
    const jsMonth = month - 1;
    
    // 나노초를 밀리초로 변환 (나노초는 10^9, 밀리초는 10^3)
    const milliseconds = Math.floor(nano / 1000000);
    
    return new Date(year, jsMonth, day, hour, minute, second, milliseconds);
  } catch (error) {
    console.error('Java LocalDateTime 파싱 오류:', error, 'Input:', dateArray);
    return null;
  }
};

/**
 * 날짜를 상대적 시간('n일 전')으로 표시하거나 'YYYY.MM.DD' 형식으로 표시
 * - 7일 이내: 'n일 전', 'n시간 전', 'n분 전'
 * - 7일 이후: 'YYYY.MM.DD'
 */
export const formatDate = (date: string | Date | number[] | null | undefined) => {
  // null, undefined, 빈 문자열 체크
  if (!date) {
    return '날짜 없음';
  }

  let targetDate: Date | null = null;
  
  try {
    if (Array.isArray(date)) {
      // Java LocalDateTime 배열 형태인 경우
      targetDate = parseJavaLocalDateTime(date);
    } else {
      // 문자열이나 Date 객체인 경우
      targetDate = typeof date === 'string' ? new Date(date) : date;
    }
    
    // 유효한 날짜인지 확인
    if (!targetDate || !isValid(targetDate)) {
      console.warn('Invalid date value:', date);
      return '날짜 없음';
    }
  } catch (error) {
    console.error('Date parsing error:', error, 'Input:', date);
    return '날짜 없음';
  }

  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);

  // 7일 이내인지 확인
  const isWithinWeek = isWithinInterval(targetDate, {
    start: sevenDaysAgo,
    end: now,
  });

  if (isWithinWeek) {
    // 7일 이내면 '~전' 형식으로 표시
    return formatDistanceToNow(targetDate, {
      addSuffix: true,
      locale: ko,
    });
  } else {
    // 7일 이후면 'YYYY.MM.DD' 형식으로 표시
    return format(targetDate, 'yyyy.MM.dd', {
      locale: ko,
    });
  }
}; 