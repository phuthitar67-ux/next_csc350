import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    // 1. รับค่าที่ส่งมาจากหน้าบ้านให้ครบตามชื่อตัวแปร
    const { fullname, phone, role, customer_grade } = await req.json();

    // 2. SQL UPDATE ต้องระบุคอลัมน์ customer_grade ด้วย
    const query = `
      UPDATE users 
      SET fullname = ?, phone = ?, role = ?, customer_grade = ? 
      WHERE id = ?
    `;
    
    // 3. ส่งค่าไปตามลำดับเครื่องหมาย ?
    await db.execute(query, [fullname, phone, role, customer_grade, id]);
    
    return NextResponse.json({ message: "Update Success" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}