export const API_CONFIG = {
  REMOTE: {
    BASE_URL: process.env.NEXT_PUBLIC_REMOTE_API_URL || 'http://localhost:9090',
    ENDPOINTS: {
      AUTH: '/api/v1/auth',
      CATEGORY: '/api/v1/common/categories',
      RESERVATION: '/api/v1/customer/reservations',
    },
  },
  LOCAL: {
    BASE_URL: process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:9091',
    ENDPOINTS: {
      ADDRESS: '/customers/address',
      RESERVATION: '/customers/reservations',
    },
  },
} as const;

export type ApiConfig = typeof API_CONFIG; 