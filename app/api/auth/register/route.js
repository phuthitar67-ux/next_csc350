import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, email, password, fullname, phone } = await req.json();

    // 1. เช็คว่ามี username หรือ email นี้ซ้ำไหม
    const [existing] = await db.execute("SELECT * FROM users WHERE username = ? OR email = ?", [username, email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Username หรือ Email นี้ถูกใช้งานแล้ว" }, { status: 400 });
    }

    // 2. เข้ารหัสรหัสผ่านก่อนบันทึก
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. บันทึกข้อมูลลงตาราง users (ชื่อคอลัมน์ตรงตามที่คุณแคปภาพมาเป๊ะๆ)
    await db.execute(
      "INSERT INTO users (username, email, password, fullname, phone, role) VALUES (?, ?, ?, ?, ?, 'customer')",
      [username, email, hashedPassword, fullname, phone]
    );

    return NextResponse.json({ message: "สมัครสมาชิกสำเร็จ!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}