import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    // 🟢 1. รับค่าจากหน้าบ้าน
    const { shop_id, user_id, name, phone, guests, date, time, note } = body;

    // --- 🟢 2. Validation: เช็คเวลาอดีต ---
    // สร้างวัตถุวันที่จากเครื่องผู้ใช้ (Timezone ท้องถิ่น)
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);
    
    if (selectedDateTime < now) {
      return NextResponse.json(
        { error: "ย้อนเวลาไม่ได้ค้าบ ไปหาโดเรม่อนก่อนนะ! 🕒" }, 
        { status: 400 }
      );
    }

    // --- 🟢 3. กันจองซ้ำ (Check Duplicate) ---
    // เช็คว่าเบอร์นี้ จองร้านนี้ วันนี้ และเวลานี้ไปแล้วหรือยัง
    // โดยเช็คเฉพาะรายการที่สถานะไม่ใช่ 'rejected' (ที่ถูกยกเลิกไปแล้ว)
    const [existing] = await db.execute(
      `SELECT id FROM bookings 
       WHERE customer_phone = ? 
       AND shop_id = ? 
       AND booking_date = ? 
       AND booking_time = ? 
       AND booking_status NOT IN ('rejected', 'cancelled')`,
      [phone, shop_id, date, time]
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: "คุณจองเวลานี้ไปแล้วครับ เดี๋ยวโต๊ะตีกันนะ! 🥊" }, 
        { status: 400 }
      );
    }

    // --- 🟢 4. บันทึกข้อมูล ---
    // บันทึกวันที่ (date) เป็น String ตรงๆ เพื่อป้องกันปัญหาวันที่เลื่อนจาก Timezone Offset
    const [result] = await db.execute(
      `INSERT INTO bookings 
      (shop_id, user_id, customer_name, customer_phone, guest_count, booking_date, booking_time, booking_status, rejection_reason) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [
        shop_id, 
        user_id || null, 
        name, 
        phone, 
        guests, 
        date, // บันทึกแบบ 'YYYY-MM-DD'
        time,
        note || '' // ใช้ฟิลด์นี้เก็บหมายเหตุจากลูกค้า
      ]
    );

    // สร้าง Booking Code แบบสุ่มเล็กน้อยเพื่อความเท่
    const bookingCode = `BK${result.insertId}${Math.floor(100 + Math.random() * 900)}`;

    return NextResponse.json({ 
      message: "Success", 
      id: result.insertId,
      booking_code: bookingCode
    });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง" }, 
      { status: 500 }
    );
  }
}