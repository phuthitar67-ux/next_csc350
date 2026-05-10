'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  // 📦 [STATE] เก็บข้อมูลที่ผู้ใช้กรอกในแบบฟอร์มสมัครสมาชิก
  const [form, setForm] = useState({ username: '', email: '', password: '', fullname: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ------------------------------------------------------------
  // ⚙️ [LOGIC] ฟังก์ชันการสมัครสมาชิก (handleRegister)
  // ทำหน้าที่ส่งข้อมูลจากแบบฟอร์มไปที่ API เพื่อบันทึกลง Database
  // ------------------------------------------------------------
  const handleRegister = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้าเว็บเมื่อกดส่งฟอร์ม
    setLoading(true);
    try {
      // [API CALL] ส่งข้อมูลแบบ POST ไปยัง Endpoint การสมัครสมาชิก
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        alert("สมัครสมาชิกเรียบร้อย! ไปหน้า Login กันเลย");
        // ✅ เมื่อสมัครสำเร็จ ให้เปลี่ยนหน้าไปที่หน้า Login
        router.push('/login');
      } else {
        const data = await res.json();
        alert(data.error); // แสดง Error กรณี Username หรือ Email ซ้ำ
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={backgroundStyle}>
      <div style={glassCardStyle}>
        
        {/* --------------------------------------------------------
            🖼️ [UI SECTION] HEADER & LOGO
            -------------------------------------------------------- */}
        <div style={{ marginBottom: '25px' }}>
          <div style={logoIconStyle}>📝</div>
          <h2 style={titleStyle}>สร้างบัญชีใหม่</h2>
          <p style={subtitleStyle}>เข้าร่วมกับ EasyReserve เพื่อการจองที่ง่ายขึ้น</p>
        </div>

        {/* --------------------------------------------------------
            📋 [UI SECTION] REGISTER FORM (แบบฟอร์มการกรอกข้อมูล)
            -------------------------------------------------------- */}
        <form onSubmit={handleRegister} style={formGrid}>
          
          {/* [INPUT] ชื่อ-นามสกุล */}
          <div style={inputGroupFull}>
            <label style={labelStyle}>ชื่อ-นามสกุล</label>
            <input 
              style={inputStyle} 
              placeholder="สมชาย ใจดี" 
              onChange={e => setForm({...form, fullname: e.target.value})} 
              required 
            />
          </div>

          {/* [INPUT] Username */}
          <div style={inputGroupHalf}>
            <label style={labelStyle}>Username</label>
            <input 
              style={inputStyle} 
              placeholder="user123" 
              onChange={e => setForm({...form, username: e.target.value})} 
              required 
            />
          </div>

          {/* [INPUT] เบอร์โทรศัพท์ */}
          <div style={inputGroupHalf}>
            <label style={labelStyle}>เบอร์โทรศัพท์</label>
            <input 
              style={inputStyle} 
              placeholder="0812345678" 
              onChange={e => setForm({...form, phone: e.target.value})} 
              required 
            />
          </div>

          {/* [INPUT] อีเมล */}
          <div style={inputGroupFull}>
            <label style={labelStyle}>อีเมล</label>
            <input 
              style={inputStyle} 
              type="email" 
              placeholder="example@mail.com" 
              onChange={e => setForm({...form, email: e.target.value})} 
              required 
            />
          </div>

          {/* [INPUT] รหัสผ่าน */}
          <div style={inputGroupFull}>
            <label style={labelStyle}>รหัสผ่าน</label>
            <input 
              style={inputStyle} 
              type="password" 
              placeholder="••••••••" 
              onChange={e => setForm({...form, password: e.target.value})} 
              required 
            />
          </div>

          {/* 🔘 [UI BUTTON] ปุ่มกด "สมัครสมาชิก" (Submit Button) */}
          <button 
            style={{...btnStyle, opacity: loading ? 0.7 : 1}} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'กำลังบันทึกข้อมูล...' : 'สมัครสมาชิก'}
          </button>
        </form>

        {/* 🔘 [UI LINK] ปุ่มลิงก์สำหรับคนที่มีบัญชีอยู่แล้ว เพื่อกลับไปหน้า Login */}
        <div style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
          มีบัญชีอยู่แล้ว? 
          <a href="/login" style={linkStyle}> เข้าสู่ระบบที่นี่</a>
        </div>
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// 🎨 [STYLE SECTION] ส่วนของการกำหนดดีไซน์ (CSS-in-JS)
// ------------------------------------------------------------
const backgroundStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
  fontFamily: "'Prompt', sans-serif",
  padding: '20px'
};

const glassCardStyle = {
  padding: '40px',
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  width: '100%',
  maxWidth: '450px',
  textAlign: 'center',
};

const logoIconStyle = {
  fontSize: '40px',
  marginBottom: '10px',
  display: 'inline-block',
  background: '#f3f4f6',
  padding: '15px',
  borderRadius: '50%',
};

const titleStyle = { fontSize: '26px', fontWeight: 'bold', color: '#1a202c', margin: '0 0 5px 0' };
const subtitleStyle = { fontSize: '14px', color: '#718096', marginBottom: '10px' };

const formGrid = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '15px',
  textAlign: 'left'
};

const inputGroupFull = { width: '100%' };
const inputGroupHalf = { width: 'calc(50% - 7.5px)' };

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '600',
  color: '#4a5568',
  marginBottom: '5px',
  marginLeft: '2px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
  fontSize: '15px',
  boxSizing: 'border-box',
  outline: 'none',
};

const btnStyle = {
  width: '100%',
  padding: '15px',
  background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  marginTop: '10px',
  boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)',
};

const linkStyle = {
  color: '#4f46e5',
  textDecoration: 'none',
  fontWeight: 'bold',
  marginLeft: '5px'
};