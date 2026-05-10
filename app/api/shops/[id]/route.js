import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;
  try {
    const [rows] = await db.execute('SELECT * FROM shops WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "ไม่พบร้านค้า" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}