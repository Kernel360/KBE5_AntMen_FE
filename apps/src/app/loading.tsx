/**
 * TODO: [Nice to have] 로딩 페이지 애니메이션 개선
 * - 귀여운 개미 캐릭터 애니메이션 추가
 * - 구현 방법:
 *   1. Lottie 애니메이션 (추천)
 *      - 디자이너에게 After Effects 애니메이션 제작 요청 (.json 파일)
 *      - Lottie 라이브러리 사용하여 적용
 *   2. GIF/WebP 이미지
 *      - 디자이너에게 투명 배경의 애니메이션 이미지 제작 요청
 *      - 이미지 파일 직접 사용
 * - 우선순위: 낮음 (여유 시간이 있을 때 구현)
 */
export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        {/* 로딩 스피너 */}
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-primary rounded-full animate-spin border-t-transparent"></div>
        </div>
        {/* 로딩 텍스트 */}
        <div className="text-lg text-primary animate-pulse">
          로딩중...
        </div>
      </div>
    </div>
  );
} 