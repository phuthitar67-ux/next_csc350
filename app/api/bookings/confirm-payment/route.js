import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function PUT(req) {
  try {
    const { bookingId } = await req.json();
    const connection = await mysql.createConnection({
      host: 'localhost', user: 'root', password: '', database: 'u6700830_csc350'
    });

    // อัปเดตสถานะเป็น completed (หรือ paid ตามที่คุณออกแบบไว้)
    await connection.execute(
      'UPDATE bookings SET booking_status = "completed" WHERE id = ?',
      [bookingId]
    );

    await connection.end();
    return NextResponse.json({ message: 'Payment confirmed' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}