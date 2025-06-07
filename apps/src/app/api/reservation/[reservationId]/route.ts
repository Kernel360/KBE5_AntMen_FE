import { NextResponse } from 'next/server';
import { getReservationByIdFromStore, updateReservationInStore } from '@/shared/data/store';

export async function GET(
  request: Request,
  { params }: { params: { reservationId: string } },
) {
  const { reservationId } = params;
  
  const reservation = getReservationByIdFromStore(reservationId);

  if (!reservation) {
    return NextResponse.json({ message: `Reservation with ID ${reservationId} not found.` }, { status: 404 });
  }
  
  return NextResponse.json(reservation);
}

export async function PATCH(
  request: Request,
  { params }: { params: { reservationId: string } },
) {
  const { reservationId } = params;
  const body = await request.json();

  const updatedReservation = updateReservationInStore(reservationId, body);

  if (!updatedReservation) {
    return NextResponse.json({ message: `Reservation with ID ${reservationId} not found.` }, { status: 404 });
  }

  return NextResponse.json(updatedReservation);
} 