export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  // auth-token 쿠키에서 Bearer 토큰 추출
  function getAuthTokenFromCookie() {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(/auth-token=([^;]+)/)
    if (!match) return null
    return decodeURIComponent(match[1])
  }

  const token = getAuthTokenFromCookie()

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: token } : {}),
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options?.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`An error occurred: ${response.statusText}`)
  }

  // No Content 응답 처리
  if (
    response.status === 204 ||
    response.headers.get('Content-Length') === '0'
  ) {
    return null as T
  }

  return response.json()
}
