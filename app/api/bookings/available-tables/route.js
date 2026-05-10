import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const shopId = searchParams.get('shopId');
  const date = searchParams.get('date');
  const time = searchParams.get('time');

  try {
    // 1. หาว่าร้านนี้มีโต๊ะทั้งหมดเท่าไหร่
    const [shop] = await db.execute('SELECT total_tables FROM shops WHERE id = ?', [shopId]);
    const totalTables = shop[0]?.total_tables || 0;

    // 2. นับว่าในวันที่และเวลานั้น มีคนจองไปแล้วกี่โต๊ะ (ไม่นับรายการที่ถูกยกเลิก)
    const [bookings] = await db.execute(
      `SELECT COUNT(*) as booked_count FROM bookings 
       WHERE shop_id = ? AND booking_date = ? AND booking_time = ? 
       AND booking_status != 'cancelled'`,
      [shopId, date, time]
    );

    const availableTables = totalTables - bookings[0].booked_count;

    return NextResponse.json({ 
      available: availableTables > 0 ? availableTables : 0,
      total: totalTables 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}