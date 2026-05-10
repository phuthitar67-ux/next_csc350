import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// ดึงเมนูทั้งหมดของร้าน
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const shop_id = searchParams.get('shop_id');
    if (!shop_id) return NextResponse.json({ error: "Missing shop_id" }, { status: 400 });

    const [rows] = await db.execute(
      'SELECT * FROM menus WHERE shop_id = ? ORDER BY id DESC',
      [shop_id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// เพิ่มเมนูใหม่
export async function POST(req) {
  try {
    const { shop_id, name, price, image_url } = await req.json();
    await db.execute(
      'INSERT INTO menus (shop_id, name, price, image_url) VALUES (?, ?, ?, ?)',
      [shop_id, name, parseFloat(price), image_url]
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}