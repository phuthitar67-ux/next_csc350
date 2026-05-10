'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  // 📦 [STATE] เก็บข้อมูล Username และ Password ที่ผู้ใช้พิมพ์
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ------------------------------------------------------------
  // ⚙️ [LOGIC] ฟังก์ชันการเข้าสู่ระบบ (handleLogin)
  // ทำหน้าที่ตรวจสอบ User ในระบบ และบันทึกข้อมูลลง LocalStorage
  // ------------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // [API CALL] ส่งข้อมูลไปตรวจสอบที่ Endpoint Login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      if (res.ok) {
        // ✅ [SESSION] บันทึกข้อมูลผู้ใช้ลงในเครื่องเพื่อใช้ยืนยันตัวตนในหน้าอื่นๆ
        localStorage.setItem('user', JSON.stringify(data.user));
        // ย้ายไปหน้าแรกเมื่อเข้าสู่ระบบสำเร็จ
        router.push('/'); 
      } else {
        alert(data.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={backgroundStyle}>
      <div style={glassCardStyle}>
        
        {/* --------------------------------------------------------
            🖼️ [UI SECTION] HEADER ส่วนหัวและโลโก้
            -------------------------------------------------------- */}
        <div style={{ marginBottom: '30px' }}>
          <div style={logoIconStyle}>🍽️</div>
          <h2 style={titleStyle}>ยินดีต้อนรับกลับมา</h2>
          <p style={subtitleStyle}>เข้าสู่ระบบเพื่อจัดการการจองของคุณ</p>
        </div>

        {/* --------------------------------------------------------
            📋 [UI SECTION] LOGIN FORM (ช่องกรอกข้อมูลเข้าสู่ระบบ)
            -------------------------------------------------------- */}
        <form onSubmit={handleLogin}>
          
          {/* [INPUT] ชื่อผู้ใช้งาน */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>ชื่อผู้ใช้งาน</label>
            <input 
              style={inputStyle} 
              type="text"
              placeholder="Username" 
              onChange={e => setForm({...form, username: e.target.value})} 
              required 
            />
          </div>

          {/* [INPUT] รหัสผ่าน */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>รหัสผ่าน</label>
            <input 
              style={inputStyle} 
              type="password" 
              placeholder="••••••••" 
              onChange={e => setForm({...form, password: e.target.value})} 
              required 
            />
          </div>

          {/* 🔘 [UI BUTTON] ปุ่มกด "เข้าสู่ระบบ" */}
          <button 
            style={{...btnStyle, opacity: loading ? 0.7 : 1}} 
            type="submit"
            disabled={loading}
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* 🔘 [UI LINK] ปุ่มสำหรับลิงก์ไปหน้าสมัครสมาชิก */}
        <div style={{ marginTop: '25px', color: '#666', fontSize: '14px' }}>
          ยังไม่มีบัญชีสมาชิก? 
          <a href="/register" style={linkStyle}> สมัครสมาชิกใหม่</a>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// 🎨 [STYLE SECTION] ส่วนของการกำหนดดีไซน์ (CSS-in-JS)
// ------------------------------------------------------------
const backgroundStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
  fontFamily: "'Prompt', sans-serif",
};

const glassCardStyle = {
  padding: '50px 40px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  width: '100%',
  maxWidth: '400px',
  textAlign: 'center',
  backdropFilter: 'blur(10px)',
};

const logoIconStyle = {
  fontSize: '50px',
  marginBottom: '15px',
  display: 'inline-block',
  background: '#f3f4f6',
  padding: '20px',
  borderRadius: '50%',
  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
};

const titleStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#1a202c',
  margin: '0 0 10px 0'
};

const subtitleStyle = {
  fontSize: '15px',
  color: '#718096',
  marginBottom: '10px'
};

const inputGroupStyle = {
  textAlign: 'left',
  marginBottom: '20px'
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#4a5568',
  marginBottom: '8px',
  marginLeft: '4px'
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc',
  fontSize: '16px',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box',
  outline: 'none',
};

const btnStyle = {
  width: '100%',
  padding: '16px',
  background: 'linear-gradient(to right, #4f46e5, #7c3aed)',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px',
  boxShadow: '0 10px 15px -3px rgba(124, 58, 237, 0.3)',
  transition: 'transform 0.2s ease',
};

const linkStyle = {
  color: '#4f46e5',
  textDecoration: 'none',
  fontWeight: 'bold',
  marginLeft: '5px'
};