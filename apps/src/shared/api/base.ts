export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const customFetch = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(endpoint, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new ApiError(
      response.status,
      errorData?.message || response.statusText,
      errorData,
    )
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
