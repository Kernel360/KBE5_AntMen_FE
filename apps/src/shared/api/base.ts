export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // 쿠키 기반 인증을 위해 반드시 필요합니다.
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`An error occurred: ${response.statusText}`);
  }

  // No Content 응답 처리
  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return null as T;
  }

  return response.json();
}; 