import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const [rows] = await db.execute(
      "SELECT AVG(rating) as avgRating, COUNT(*) as reviewCount FROM reviews WHERE shop_id = ?",
      [params.id]
    );
    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
//API สำหรับคำนวณคะแนนรีวิว