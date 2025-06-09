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

// 주소 목록 조회
export const fetchAddresses = async (): Promise<CustomerAddressResponse[]> => {
  const res = await fetch('http://localhost:9091/customers/address', {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('주소 목록 조회 실패');
  return res.json();
};

// 주소 등록
export const createAddress = async (
  data: CustomerAddressRequest
): Promise<CustomerAddressResponse> => {
  const res = await fetch('http://localhost:9091/customers/address', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('주소 등록 실패');
  return res.json();
}; 