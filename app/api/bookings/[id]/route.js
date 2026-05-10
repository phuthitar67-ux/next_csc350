import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = await params; 

  try {
    // 1. แก้ไขตรง s.name (เพราะในตาราง shops ของคุณใช้ชื่อคอลัมน์ว่า name)
    const [bookingRows] = await db.execute(
      `SELECT b.*, s.name as shop_name 
       FROM bookings b 
       LEFT JOIN shops s ON b.shop_id = s.id 
       WHERE b.id = ?`,
      [id]
    );

    if (bookingRows.length === 0) {
      return NextResponse.json({ error: "ไม่พบข้อมูลการจอง" }, { status: 404 });
    }

    // 2. ดึงรายการอาหาร (ตรวจสอบชื่อคอลัมน์ให้ตรงกับ image_34f847.jpg)
    const [itemRows] = await db.execute(
      `SELECT bi.quantity, bi.price_at_booking, m.name as menu_name 
       FROM booking_items bi
       JOIN menus m ON bi.menu_id = m.id
       WHERE bi.booking_id = ?`,
      [id]
    );

    return NextResponse.json({
      ...bookingRows[0],
      items: itemRows 
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}