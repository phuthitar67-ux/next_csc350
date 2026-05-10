import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// แก้ไขเมนู
export async function PUT(req, { params }) {
  try {
    const { name, price, image_url } = await req.json();
    const { id } = params; // ดึง id จาก URL

    await db.execute(
      'UPDATE menus SET name = ?, price = ?, image_url = ? WHERE id = ?',
      [name, parseFloat(price), image_url, id]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ลบเมนู
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    await db.execute('DELETE FROM menus WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}