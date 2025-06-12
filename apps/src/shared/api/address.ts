import { customFetch } from './base'
import { API_CONFIG } from './config'

export interface CustomerAddressRequest {
  addressName: string
  addressDetail: string
  addressAddr: string
  addressArea: number
  latitude: number
  longitude: number
  isDefault: boolean
}

export interface CustomerAddressResponse {
  addressId: number
  customerId: number
  addressName: string
  addressDetail: string
  latitude: number
  longitude: number
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export const addressApi = {
  getAll: async (): Promise<CustomerAddressResponse[]> => {
    return customFetch<CustomerAddressResponse[]>(
      API_CONFIG.LOCAL.ENDPOINTS.ADDRESS,
      {
        serverType: 'LOCAL',
      },
    )
  },

  create: async (
    data: CustomerAddressRequest,
  ): Promise<CustomerAddressResponse> => {
    return customFetch<CustomerAddressResponse>(
      API_CONFIG.LOCAL.ENDPOINTS.ADDRESS,
      {
        method: 'POST',
        body: JSON.stringify(data),
        serverType: 'LOCAL',
      },
    )
  },

  update: async (
    addressId: number,
    data: CustomerAddressRequest,
  ): Promise<CustomerAddressResponse> => {
    return customFetch<CustomerAddressResponse>(
      `${API_CONFIG.LOCAL.ENDPOINTS.ADDRESS}/${addressId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        serverType: 'LOCAL',
      },
    )
  },

  delete: async (addressId: number): Promise<void> => {
    return customFetch<void>(
      `${API_CONFIG.LOCAL.ENDPOINTS.ADDRESS}/${addressId}`,
      {
        method: 'DELETE',
        serverType: 'LOCAL',
      },
    )
  },

  setDefault: async (addressId: number): Promise<CustomerAddressResponse> => {
    return customFetch<CustomerAddressResponse>(
      `${API_CONFIG.LOCAL.ENDPOINTS.ADDRESS}/${addressId}/default`,
      {
        method: 'POST',
        serverType: 'LOCAL',
      },
    )
  },
}
