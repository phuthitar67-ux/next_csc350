import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  let connection; // ประกาศตัวแปรไว้นอก Try
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', 
      database: 'u6700830_csc350'
    });

    const [rows] = await connection.execute('SELECT id, name FROM categories');
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end(); // ปิด Connection เสมอไม่ว่าจะสำเร็จหรือ Error
  }
}