import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // 1. ค้นหาผู้ใช้จาก username
    const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    
    if (users.length === 0) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้งานนี้" }, { status: 401 });
    }

    const user = users[0];

    // 2. ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // 3. ส่งข้อมูลผู้ใช้กลับไป (ในระบบจริงควรใช้ JWT หรือ NextAuth เพื่อความปลอดภัย)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ 
      message: "เข้าสู่ระบบสำเร็จ", 
      user: userWithoutPassword 
    });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}