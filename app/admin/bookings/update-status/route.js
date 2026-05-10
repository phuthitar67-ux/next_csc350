import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// -------------------------------------------------------------------------
// 🚀 [API ROUTE] ส่วนของคำสั่งอัปเดตสถานะการจอง (Update Booking Status)
// ฟังก์ชันนี้จะทำงานเมื่อฝั่งหน้าบ้าน (Frontend) ส่งคำขอ PUT มาที่ API นี้
// -------------------------------------------------------------------------
export async function PUT(req) {
  try {
    // 📩 [1] รับข้อมูลที่ส่งมาจากหน้าบ้าน (Body JSON)
    // id: เลขไอดีรายการจอง, status: สถานะใหม่ที่จะเปลี่ยน (เช่น 'confirmed' หรือ 'rejected')
    const { id, status } = await req.json(); 
    
    // -----------------------------------------------------------------------
    // ⚙️ [LOGIC] คำสั่ง SQL สำหรับบันทึกข้อมูลลง Database
    // -----------------------------------------------------------------------
    await db.execute(
      "UPDATE bookings SET booking_status = ? WHERE id = ?",
      [status, id] // นำสถานะและไอดีที่ได้รับมา ไปแทนที่ในเครื่องหมาย ?
    );

    // ✅ [2] ส่งผลลัพธ์กลับไปบอกหน้าบ้านว่าบันทึกสำเร็จ
    return NextResponse.json({ 
      success: true, 
      message: `อัปเดตเป็น ${status} เรียบร้อย` 
    });

  } catch (error) {
    // ❌ [3] กรณีเกิดข้อผิดพลาด ให้ส่ง Error กลับไป
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}