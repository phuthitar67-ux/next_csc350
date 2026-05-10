'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  // [1] ส่วนดึงค่า URL ปัจจุบัน เพื่อตรวจสอบสถานะเมนู
  const pathname = usePathname()

  // [2] ฟังก์ชันตรวจสอบว่า Link ไหนคือหน้าปัจจุบัน (Active State)
  const isActive = (path) => pathname === path

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* ============================================================
          ส่วนที่ 1: แถบเมนูด้านข้าง (Sidebar Navigation)
          ============================================================ */}
      <div style={sidebarStyle}>
        
        {/* ส่วนหัว Sidebar / โลโก้โปรเจกต์ */}
        <div style={logoStyle}>🚀 Admin</div>
        
        {/* รายการเมนูนำทาง (Navigation Links) */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px' }}>
          
          {/* เมนู: แดชบอร์ดการจอง */}
          <Link href="/admin" style={navItem(isActive('/admin'))}>
            📊 แดชบอร์ดการจอง
          </Link>
          
          {/* เมนู: จัดการร้านค้า */}
          <Link href="/admin/shops" style={navItem(isActive('/admin/shops'))}>
            🏪 จัดการร้านค้า
          </Link>
          
          {/* เมนู: จัดการผู้ใช้งาน */}
          <Link href="/admin/users" style={navItem(isActive('/admin/users'))}>
            👥 จัดการผู้ใช้งาน
          </Link>
          
        </nav>
      </div>

      {/* ============================================================
          ส่วนที่ 2: พื้นที่แสดงเนื้อหาหลัก (Main Content Area)
          เป็นส่วนที่รับ children จากหน้า Page ต่างๆ มาแสดงผล
          ============================================================ */}
      <div style={{ flex: 1, backgroundColor: '#f4f7f6', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  )
}

// ============================================================
// ส่วนการกำหนดสไตล์ (CSS-in-JS Styles)
// ============================================================

// สไตล์ของแผง Sidebar ด้านข้าง
const sidebarStyle = {
  width: '260px',
  backgroundColor: '#2d3748',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
};

// สไตล์ของส่วนหัว/โลโก้
const logoStyle = {
  padding: '30px 20px',
  fontSize: '22px',
  fontWeight: 'bold',
  textAlign: 'center',
  borderBottom: '1px solid #4a5568',
  marginBottom: '10px',
  color: '#63b3ed'
};

// สไตล์ของรายการเมนู (รับพารามิเตอร์ active เพื่อเปลี่ยนสีเมื่อถูกกด)
const navItem = (active) => ({
  padding: '15px 20px',
  color: active ? 'white' : '#cbd5e0',
  textDecoration: 'none',
  borderRadius: '10px',
  backgroundColor: active ? '#4a5568' : 'transparent',
  fontWeight: active ? 'bold' : 'normal',
  transition: '0.2s',
  display: 'block'
});

// สไตล์ของส่วนท้าย (ถ้ามีการเปิดใช้งานในอนาคต)
const footerStyle = {
  marginTop: 'auto',
  padding: '20px',
  borderTop: '1px solid #4a5568',
  textAlign: 'center'
};