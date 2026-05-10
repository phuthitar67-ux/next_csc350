import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const [rows] = await db.execute(
    `SELECT id, booking_status, updated_at FROM bookings 
     WHERE user_id = ? AND is_read = 0 AND booking_status IN ('confirmed', 'rejected')`,
    [userId]
  );
  return NextResponse.json(rows);
}

export async function PUT(req) {
  const { userId } = await req.json();
  await db.execute(`UPDATE bookings SET is_read = 1 WHERE user_id = ?`, [userId]);
  return NextResponse.json({ success: true });
}