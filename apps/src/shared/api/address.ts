export interface CustomerAddressRequest {
  addressName: string;
  addressAddr: string;
  addressDetail: string;
  addressArea: number;
}

export interface CustomerAddressResponse {
  addressId: number;
  addressName: string;
  addressAddr: string;
  addressDetail: string;
  addressArea: number;
}

// 쿠키에서 값 읽는 함수 (최상위에 선언)
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

// 주소 목록 조회
export const fetchAddresses = async (): Promise<CustomerAddressResponse[]> => {
  // 클라이언트 환경에서만 쿠키를 읽음
  const token = getCookie('auth-token');
  const decodedToken = token ? decodeURIComponent(token) : null;
  const res = await fetch('https://api.antmen.site:9091/customers/address', {
    method: 'GET',
    credentials: 'include',
    headers: decodedToken ? { Authorization: decodedToken } : {},
  });
  if (!res.ok) throw new Error('주소 목록 조회 실패');
  return res.json();
};

// 주소 등록
export const createAddress = async (
  data: CustomerAddressRequest,
): Promise<CustomerAddressResponse> => {
  const token = getCookie('auth-token');
  const decodedToken = token ? decodeURIComponent(token) : null;
  const res = await fetch('https://api.antmen.site:9091/customers/address', {
    method: 'POST',
    credentials: 'include',
    headers: decodedToken
      ? { 'Content-Type': 'application/json', Authorization: decodedToken }
      : { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('주소 등록 실패');
  return res.json();
}; 