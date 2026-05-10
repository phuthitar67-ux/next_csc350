'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ReviewPage({ params }) {
  // 📦 [STATE] เก็บข้อมูลคะแนน (Rating) และ ข้อความรีวิว (Comment)
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const router = useRouter();

  // ------------------------------------------------------------
  // ⚙️ [LOGIC] ฟังก์ชันการส่งรีวิว (submitReview)
  // ทำหน้าที่รวบรวมคะแนนและข้อความ แล้วส่งไปบันทึกลง Database ผ่าน API
  // ------------------------------------------------------------
  const submitReview = async () => {
    // ดึงข้อมูล User จาก LocalStorage เพื่อให้รู้ว่าใครเป็นคนรีวิว
    const user = JSON.parse(localStorage.getItem('user'));
    
    const res = await fetch('/api/reviews/add', {
      method: 'POST',
      body: JSON.stringify({
        shop_id: params.shopId, // รับค่า ID ร้านค้าจาก URL
        user_id: user.id,
        rating,
        comment
      })
    });

    if (res.ok) {
      alert("ขอบคุณสำหรับรีวิวครับ!");
      // เมื่อรีวิวเสร็จ ให้กลับไปหน้าประวัติการจอง
      router.push('/history');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>⭐ ให้คะแนนความประทับใจ</h2>

      {/* --------------------------------------------------------
          🔢 [UI INPUT] ส่วนเลือกคะแนนดาว (Dropdown Select)
          -------------------------------------------------------- */}
      <select value={rating} onChange={e => setRating(e.target.value)} style={inputStyle}>
        {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} ดาว</option>)}
      </select>
      
      <br />

      {/* --------------------------------------------------------
          ✍️ [UI INPUT] ช่องกรอกข้อความรีวิว (Textarea)
          -------------------------------------------------------- */}
      <textarea 
        placeholder="แชร์ประสบการณ์ของคุณที่นี่..."
        style={{...inputStyle, height: '100px'}}
        onChange={e => setComment(e.target.value)} // อัปเดต State ตามที่พิมพ์
      />
      
      <br />

      {/* --------------------------------------------------------
          🔘 [UI BUTTON] ปุ่มกด "บันทึกรีวิว" 
          (เมื่อคลิกจะเรียกใช้ฟังก์ชัน submitReview ด้านบน)
          -------------------------------------------------------- */}
      <button onClick={submitReview} style={submitBtn}>บันทึกรีวิว</button>
      
    </div>
  );
}

// ------------------------------------------------------------
// 🎨 [STYLE SECTION] ส่วนของการกำหนดดีไซน์
// ------------------------------------------------------------
const inputStyle = { width: '100%', maxWidth: '400px', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc' };
const submitBtn = { padding: '10px 30px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' };