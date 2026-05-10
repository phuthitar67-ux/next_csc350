import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. นับจำนวนการจองทั้งหมด (ของเดิม)
    const [total] = await db.execute('SELECT COUNT(*) as count FROM bookings');

    // 2. นับรายการที่จองเข้ามาภายในสัปดาห์นี้ (เพิ่มใหม่)
    // นับจากวันที่จอง (booking_date) ที่เกิดขึ้นภายใน 7 วันล่าสุด
    const [weekly] = await db.execute(`
      SELECT COUNT(*) as count FROM bookings 
      WHERE booking_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);

    // 3. นับรายการที่รอตรวจสอบ (จ่ายเงินแล้วแต่ยังไม่อนุมัติ)
    const [pending] = await db.execute("SELECT COUNT(*) as count FROM bookings WHERE booking_status = 'paid'");

    // 4. รวมยอดเงินมัดจำทั้งหมด
    const [revenue] = await db.execute('SELECT SUM(deposit_amount) as total FROM bookings');

    // 5. นับจำนวนร้านค้าที่มีการจอง (เพื่อให้สอดคล้องกับหน้า UI ของคุณ)
    const [shops] = await db.execute('SELECT COUNT(DISTINCT shop_id) as count FROM bookings');

    return NextResponse.json({
      totalBookings: total[0].count,
      weeklyBookings: weekly[0].count, // 🟢 ส่งค่าใหม่ไปที่หน้าบ้าน
      pendingPayments: pending[0].count,
      totalRevenue: revenue[0].total || 0,
      totalShops: shops[0].count // 🟢 ส่งจำนวนร้านค้าไปโชว์ใน Card
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}