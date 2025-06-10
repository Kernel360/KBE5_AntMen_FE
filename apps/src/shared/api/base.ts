export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
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