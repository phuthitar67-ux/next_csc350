import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    
    // ดึงค่ามาให้ตรงกับที่หน้า Checkout ส่งมา (เช็คสะกดให้ดี)
    const { bookingId, userId } = body; 

    // เช็คว่ามีค่าส่งมาจริงไหม
    if (!bookingId) {
      return NextResponse.json({ error: "ไม่พบหมายเลขการจอง" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "ไม่พบ User ID" }, { status: 400 });
    }

    // แก้ไข SQL: นำค่า userId ไปใส่ในคอลัมน์ user_id เพื่อให้ประวัติโชว์
    const query = "UPDATE bookings SET booking_status = 'pending', user_id = ? WHERE id = ?";
    
    const [result] = await db.execute(query, [userId, bookingId]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "ไม่พบรายการจองในระบบ" }, { status: 404 });
    }

    return NextResponse.json({ message: "อัปเดตสถานะสำเร็จ" });

  } catch (error) {
    console.error("Update Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}