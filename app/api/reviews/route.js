import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(req) {
  try {
    const body = await req.json();
    // ดึงค่ามาเช็คก่อน
    const shop_id = Number(body.shop_id);
    const user_id = Number(body.user_id);
    const booking_id = Number(body.booking_id);
    const rating = Number(body.rating);
    const comment = body.comment;

    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'u6700830_csc350'
    });

    // ใช้คำสั่ง SQL แบบระบุชื่อคอลัมน์ให้ชัดเจนตามที่คุณมีใน DB
    const sql = `INSERT INTO reviews (shop_id, user_id, booking_id, rating, comment, created_at) 
                 VALUES (?, ?, ?, ?, ?, NOW())`;
    
    const [result] = await connection.query(sql, [shop_id, user_id, booking_id, rating, comment]);

    await connection.end();
    return NextResponse.json({ message: 'Success', id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ message: 'Error', error: error.message }, { status: 500 });
  }
}