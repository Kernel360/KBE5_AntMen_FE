export interface Worker {
  id: string
  name: string
  rating: number
  experience: string
  age: number
  gender: string
  avatar: string
  phone: string
}

export interface ReservationDetail {
  id: string
  reservationNumber: string
  serviceType: string
  status: 'scheduled' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  dateTime: string
  duration: string
  location: string
  detailedAddress: string
  worker: Worker
  amount: number
  baseAmount: number
  discount: number
  paymentMethod?: string
  options: Array<{
    name: string
    price: number
  }>
  createdAt: string
}
