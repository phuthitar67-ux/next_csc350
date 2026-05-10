import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    // รับค่าข้อมูลที่ส่งมาจากหน้า Menu
    const { booking_id, total_amount, deposit_amount, items } = await req.json();

    // 1. อัปเดตยอดเงินรวมและมัดจำในตาราง bookings
    const [result] = await db.execute(
      `UPDATE bookings 
       SET total_amount = ?, 
           deposit_amount = ?, 
           booking_status = 'pending_payment' 
       WHERE id = ?`, 
      [total_amount, deposit_amount, booking_id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "ไม่พบข้อมูลการจองในระบบ" }, { status: 404 });
    }

    // 2. จัดการรายการอาหารในตาราง booking_items
    if (items && items.length > 0) {
      // ลบรายการเก่าออกก่อน เพื่อป้องกันกรณีสั่งซ้ำแล้วยอดเบิ้ล
      await db.execute(`DELETE FROM booking_items WHERE booking_id = ?`, [booking_id]);

      // ใช้ Promise.all เพื่อความรวดเร็วในการบันทึกหลายรายการพร้อมกัน
      const insertPromises = items.map(item => {
        return db.execute(
          `INSERT INTO booking_items (booking_id, menu_id, quantity, price_at_booking) 
           VALUES (?, ?, ?, ?)`,
          [booking_id, item.menu_id, item.quantity, item.price_at_booking]
        );
      });

      await Promise.all(insertPromises);
    }

    return NextResponse.json({ success: true, message: "บันทึกข้อมูลเรียบร้อย" });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด: " + error.message }, { status: 500 });
  }
}