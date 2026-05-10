import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
   
    const userId = searchParams.get('userId'); 

    // ตรวจสอบว่าส่งค่ามาจริงไหม
    if (!userId || userId === 'undefined' || userId === 'null') {
      return NextResponse.json({ error: "ไม่พบ User ID ในระบบ" }, { status: 400 });
    }

    // SQL ดึงประวัติการจอง พร้อมชื่อร้านและรูปภาพ
    const query = `
      SELECT 
        bookings.*, 
        shops.name as shop_name, 
        shops.cover_image 
      FROM bookings 
      LEFT JOIN shops ON bookings.shop_id = shops.id 
      WHERE bookings.user_id = ? 
      ORDER BY bookings.id DESC
    `;

    // ใช้ userId ที่ดึงมาจาก param
    const [rows] = await db.execute(query, [userId]);
    
    return NextResponse.json(rows);

  } catch (error) {
    console.error("Database Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}