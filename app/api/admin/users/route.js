import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // เลือก fullname ให้ตรงตามชื่อคอลัมน์ใน phpMyAdmin ของคุณ
    const [rows] = await db.execute("SELECT id, username, fullname, email, phone, role FROM users ORDER BY id DESC");
    
    // ส่งข้อมูลกลับเป็น Array
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}