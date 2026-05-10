'use client'
import { useState, useEffect } from 'react'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  // ------------------------------------------------------------
  // ⚙️ [LOGIC] ส่วนการดึงข้อมูลรายการจองทั้งหมดจาก API
  // ------------------------------------------------------------
  useEffect(() => {
    fetch('/api/admin/bookings') 
      .then(res => res.json())
      .then(data => setBookings(data));
  }, []);

  // ------------------------------------------------------------
  // ⚙️ [LOGIC] ฟังก์ชันการทำงานของปุ่ม "ยืนยันการจอง" (Approve)
  // ------------------------------------------------------------
  const approveBooking = async (id) => {
    if(confirm("ยืนยันการชำระเงินรายการนี้?")) {
      const res = await fetch(`/api/admin/bookings/approve`, {
        method: 'POST',
        body: JSON.stringify({ id })
      });
      // เมื่อสำเร็จทำการ Refresh หน้าจอเพื่ออัปเดตสถานะใหม่
      if(res.ok) window.location.reload();
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      
      {/* ส่วนหัวข้อหลัก */}
      <h1>📦 รายการจองและตรวจสอบสลิป</h1>

      {/* --------------------------------------------------------
          📊 [UI SECTION] ตารางแสดงรายการจองของลูกค้า
          -------------------------------------------------------- */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#fff' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th style={thStyle}>ลูกค้า</th>
            <th style={thStyle}>วันที่/เวลา</th>
            <th style={thStyle}>ยอดมัดจำ</th>
            <th style={thStyle}>หลักฐาน</th>
            <th style={thStyle}>สถานะ</th>
            <th style={thStyle}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(book => (
            <tr key={book.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={tdStyle}>{book.customer_name}<br/><small>{book.customer_phone}</small></td>
              <td style={tdStyle}>{book.booking_date}<br/>{book.booking_time}</td>
              <td style={tdStyle}>฿{book.deposit_amount}</td>
              
              {/* 👁️ [UI] ลิงก์สำหรับกดดูรูปภาพสลิปเงินที่ลูกค้าแนบมา */}
              <td style={tdStyle}>
                {book.payment_slip ? (
                  <a href={`/uploads/${book.payment_slip}`} target="_blank" style={{ color: '#0070f3' }}>👁️ ดูรูปสลิป</a>
                ) : 'ยังไม่แนบ'}
              </td>

              <td style={tdStyle}>{book.booking_status}</td>

              <td style={tdStyle}>
                {/* --------------------------------------------------------
                    🔘 [UI BUTTON] ปุ่ม "ยืนยันการจอง" 
                    (จะปรากฏเมื่อสถานะเป็น 'paid' หรือโอนเงินมาแล้วเท่านั้น)
                    -------------------------------------------------------- */}
                {book.booking_status === 'paid' && (
                  <button 
                    onClick={() => approveBooking(book.id)} // เรียกใช้ Logic การ Approve
                    style={confirmBtn}
                  >
                    ยืนยันการจอง
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ------------------------------------------------------------
// 🎨 [STYLE SECTION] ส่วนของการกำหนดดีไซน์ (CSS-in-JS)
// ------------------------------------------------------------
const thStyle = { padding: '15px' };
const tdStyle = { padding: '15px' };
const confirmBtn = { backgroundColor: '#4caf50', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer' };