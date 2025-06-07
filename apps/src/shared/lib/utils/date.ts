import { formatDistanceToNow, format, isWithinInterval, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 상대적 시간('n일 전')으로 표시하거나 'YYYY.MM.DD' 형식으로 표시
 * - 7일 이내: 'n일 전', 'n시간 전', 'n분 전'
 * - 7일 이후: 'YYYY.MM.DD'
 */
export const formatDate = (date: string | Date) => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
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