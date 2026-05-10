import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// --- ฟังก์ชันดึงข้อมูลร้านค้าทั้งหมด (เพื่อให้ข้อมูลขึ้นในตาราง) ---
export async function GET() {
  try {
    // ดึงข้อมูลตามโครงสร้างตาราง shops
    const [rows] = await db.execute("SELECT * FROM shops ORDER BY id DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch Shops Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- ฟังก์ชันเพิ่มข้อมูลร้านค้าใหม่ ---
export async function POST(req) {
  try {
    const body = await req.json();
    // เพิ่ม rating เข้ามาในตัวแปรรับค่า
    const { 
      name, 
      description, 
      address, 
      phone, 
      cover_image, 
      category_id, 
      total_tables, 
      rating 
    } = body;

    // คำสั่ง SQL INSERT ที่รับค่า rating จากฟอร์ม
    const query = `
      INSERT INTO shops (name, description, address, phone, cover_image, category_id, rating, total_tables)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      name, 
      description || null, 
      address || null, 
      phone || null, 
      cover_image || null, 
      category_id || null, 
      rating || 0.0,      // ใช้ค่าที่ส่งมา ถ้าไม่มีให้เป็น 0.0
      total_tables || 10   // ใช้ค่าที่ส่งมา ถ้าไม่มีให้เป็น 10
    ]);

    return NextResponse.json({ message: "เพิ่มร้านค้าสำเร็จ", id: result.insertId });
  } catch (error) {
    console.error("Add Shop Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}