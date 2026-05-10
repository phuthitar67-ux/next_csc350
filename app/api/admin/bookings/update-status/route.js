import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, status, reason } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    // แก้ไข/เพิ่มเติม: 
    // 1. กรองสถานะที่อนุญาตให้ใช้ (ป้องกันข้อมูลเพี้ยน)
   const allowedStatus = ['pending', 'paid', 'confirmed', 'cancelled', 'completed', 'rejected'];
    if (!allowedStatus.includes(status)) {
       return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
    }

    const sql = `
      UPDATE bookings 
      SET booking_status = ?, 
          rejection_reason = ?, 
          updated_at = NOW(),
          is_read = 0 
      WHERE id = ?`;
      
    const values = [status, reason || null, id];

    const [result] = await db.execute(sql, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "ไม่พบรายการจองรหัสนี้ในระบบ" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `อัปเดตเป็น ${status} และเตรียมแจ้งเตือนลูกค้าแล้ว`,
      updatedStatus: status 
    });

  } catch (error) {
    console.error("Database Error:", error.message);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" }, { status: 500 });
  }
}