import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// --- ฟังก์ชันแก้ไขข้อมูลร้านค้า (PUT) ---
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, description, address, phone, cover_image, category_id, rating, total_tables } = body;

    const query = `
      UPDATE shops 
      SET name=?, description=?, address=?, phone=?, cover_image=?, category_id=?, rating=?, total_tables=?
      WHERE id=?
    `;

    await db.execute(query, [
      name, description, address, phone, cover_image, category_id, rating, total_tables, id
    ]);

    return NextResponse.json({ message: "อัปเดตข้อมูลสำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- ฟังก์ชันลบร้านค้า (DELETE) ---
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    
    // ลบข้อมูลจากตาราง shops ตาม ID
    await db.execute("DELETE FROM shops WHERE id = ?", [id]);
    
    return NextResponse.json({ message: "ลบร้านค้าสำเร็จ" });
  } catch (error) {
    // หากลบไม่ได้ (เช่น ติด Foreign Key จากตาราง bookings) จะส่ง error กลับไป
    return NextResponse.json({ error: "ไม่สามารถลบได้ เนื่องจากร้านค้านี้มีข้อมูลการจองเชื่อมโยงอยู่" }, { status: 500 });
  }
}