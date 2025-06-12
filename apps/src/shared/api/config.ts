export const API_ENDPOINTS = {
  AUTH: '/api/v1/auth',
  CATEGORY: '/api/v1/common/categories',
  RESERVATION: '/api/v1/customer/reservations',
  ADDRESS: '/customers/address',
  CUSTOMER_RESERVATION: '/customers/reservations',
  RESERVATION_OPTION: '/reservation-option',
} as const

export type ApiEndpoints = typeof API_ENDPOINTS
