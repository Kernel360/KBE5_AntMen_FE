import { API_CONFIG } from './config';

type ServerType = 'REMOTE' | 'LOCAL';

interface FetchOptions extends RequestInit {
  serverType?: ServerType;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const customFetch = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { serverType = 'REMOTE', ...fetchOptions } = options;
  const baseUrl = API_CONFIG[serverType].BASE_URL;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    ...fetchOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      errorData?.message || response.statusText,
      errorData
    );
  }

  // No Content 응답 처리
  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return null as T;
  }

  return response.json();
}; 