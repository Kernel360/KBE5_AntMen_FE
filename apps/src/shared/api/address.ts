export interface CustomerAddressRequest {
  addressName: string
  addressAddr: string
  addressDetail: string
  addressArea: number
}

export interface CustomerAddressResponse {
  addressId: number
  addressName: string
  addressAddr: string
  addressDetail: string
  addressArea: number
}

// 주소 목록 조회
export const fetchAddresses = async (): Promise<CustomerAddressResponse[]> => {
  // 쿠키에서 accessToken 값을 읽어옴 (Bearer 포함)
  function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  }
  const token = getCookie('auth-token');
  const decodedToken = token? decodeURIComponent(token) : null;
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
  const res = await fetch('/customers/address', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('주소 등록 실패')
  return res.json()
}
