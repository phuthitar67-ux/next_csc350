'use client'
import { useState, useEffect } from 'react'

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ 
    id: '', fullname: '', phone: '', role: '' 
  });

  // [1] ฟังก์ชันดึงข้อมูลผู้ใช้งานทั้งหมดจาก Database
  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ------------------------------------------------------------
  // ⚙️ [LOGIC] คำสั่งการทำงานของปุ่ม "ระงับการใช้งาน"
  // ------------------------------------------------------------
  const handleDelete = async (id) => {
    if (confirm(`⚠️ ยืนยันการระงับการใช้งานผู้ใช้ ID #${id}?`)) {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("ระงับการใช้งานสำเร็จ");
        fetchUsers();
      }
    }
  };

  // ------------------------------------------------------------
  // ⚙️ [LOGIC] คำสั่งเปิด Modal เพื่อเตรียมแก้ไขข้อมูล
  // ------------------------------------------------------------
  const openEditModal = (user) => {
    setEditFormData({
      id: user.id,
      fullname: user.fullname || '',
      phone: user.phone || '',
      role: user.role || 'customer'
    });
    setShowEditModal(true);
  };

  // ------------------------------------------------------------
  // ⚙️ [LOGIC] คำสั่งการทำงานของปุ่ม "บันทึกการเปลี่ยนแปลง" (ใน Modal)
  // ------------------------------------------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/users/${editFormData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      if (res.ok) {
        alert("✨ บันทึกข้อมูลเรียบร้อยแล้ว");
        setShowEditModal(false);
        await fetchUsers(); 
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) { alert("การเชื่อมต่อผิดพลาด"); }
  };

  const filteredUsers = users.filter(u => 
    u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', fontFamily: '"Inter", sans-serif', backgroundColor: '#F1F5F9', minHeight: '100vh' }}>
      
      {/* ส่วนหัวเว็บและสถิติ (Header & Stats) */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1E293B', marginBottom: '25px' }}>
          ✨ จัดการผู้ใช้งานระบบ
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={premiumCard}>
            <span style={iconCircle}>👥</span>
            <div>
              <p style={cardLabel}>ผู้ใช้ทั้งหมด</p>
              <h3 style={cardVal}>{users.length} <small style={{fontSize: '14px'}}>คน</small></h3>
            </div>
          </div>
          <div style={{...premiumCard, borderLeft: '6px solid #3B82F6'}}>
            <span style={{...iconCircle, backgroundColor: '#EBF5FF'}}>🛒</span>
            <div>
              <p style={cardLabel}>ลูกค้าทั่วไป</p>
              <h3 style={{...cardVal, color: '#3B82F6'}}>{users.filter(u => u.role === 'customer').length} <small style={{fontSize: '14px'}}>คน</small></h3>
            </div>
          </div>
        </div>
      </div>

      {/* ตารางรายชื่อผู้ใช้งาน (Main Table Section) */}
      <div style={mainContentBox}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '25px', alignItems: 'center', borderBottom: '1px solid #EDF2F7' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#4A5568' }}>รายชื่อผู้ใช้ในระบบ</h2>
          
          {/* 🔍 [INPUT] ช่องค้นหาข้อมูล */}
          <div style={{ position: 'relative' }}>
            <input 
              placeholder="ค้นหาชื่อหรืออีเมลที่นี่..." 
              style={fancySearch} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', color: '#64748B', textAlign: 'left', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={p20}>ID</th>
                <th style={p20}>ข้อมูลสมาชิก</th>
                <th style={p20}>เบอร์โทรศัพท์</th>
                <th style={p20}>สิทธิ์</th>
                <th style={p20}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.id} style={{ 
                  borderBottom: '1px solid #F1F5F9',
                  backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FBFDFF',
                  transition: 'background 0.2s'
                }} className="table-row">
                  <td style={p20}><span style={{ color: '#94A3B8', fontWeight: '600' }}>#{user.id}</span></td>
                  <td style={p20}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={avatarCircle}>{user.fullname?.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#1E293B' }}>{user.fullname}</div>
                        <div style={{ fontSize: '13px', color: '#64748B' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={p20}><span style={{ color: '#475569', fontSize: '14px' }}>{user.phone || '-'}</span></td>
                  <td style={p20}><span style={roleBadge(user.role)}>{user.role}</span></td>
                  <td style={p20}>
                    
                    {/* --------------------------------------------------------
                        🔘 [UI BUTTONS] กลุ่มปุ่มจัดการในตาราง
                        -------------------------------------------------------- */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      
                      {/* 1. ปุ่มแก้ไข -> เรียกใช้ openEditModal */}
                      <button style={btnActionEdit} onClick={() => openEditModal(user)}>✏️ แก้ไข</button>
                      
                      {/* 2. ปุ่มระงับการใช้งาน -> เรียกใช้ handleDelete */}
                      <button style={btnActionDelete} onClick={() => handleDelete(user.id)}>🔒 ระงับ</button>
                      
                    </div>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------
          🖼️ [MODAL] หน้าต่าง Pop-up สำหรับแก้ไขข้อมูลสมาชิก
          ------------------------------------------------------------ */}
      {showEditModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div style={{ borderBottom: '1px solid #EDF2F7', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, color: '#1E293B' }}>📝 แก้ไขข้อมูลสมาชิก #{editFormData.id}</h3>
              
              {/* ปุ่มกากบาทปิด Modal */}
              <button onClick={() => setShowEditModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
            </div>
            
            {/* ฟอร์มแก้ไขข้อมูล */}
            <form onSubmit={handleUpdate}>
              <div style={formGroup}>
                <label style={labelStyle}>ชื่อ-นามสกุล</label>
                <input style={inputStyle} value={editFormData.fullname} onChange={e => setEditFormData({...editFormData, fullname: e.target.value})} />
              </div>
              <div style={formGroup}>
                <label style={labelStyle}>เบอร์โทรศัพท์</label>
                <input style={inputStyle} value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} />
              </div>
              
              <div style={formGroup}>
                <label style={labelStyle}>สิทธิ์การใช้งาน</label>
                <select style={inputStyle} value={editFormData.role} onChange={e => setEditFormData({...editFormData, role: e.target.value})}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
                
                {/* 💾 [BUTTON] ปุ่มบันทึกการเปลี่ยนแปลง -> เรียก handleUpdate */}
                <button type="submit" style={btnSave}>💾 บันทึกการเปลี่ยนแปลง</button>
                
                {/* ปุ่มยกเลิก */}
                <button type="button" style={btnCancel} onClick={() => setShowEditModal(false)}>ยกเลิก</button>
                
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Styles ของคุณ (ไม่มีการเปลี่ยนแปลง) ---
const premiumCard = { backgroundColor: '#FFF', padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', borderLeft: '6px solid #10B981' };
const iconCircle = { width: '48px', height: '48px', backgroundColor: '#ECFDF5', borderRadius: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px' };
const cardLabel = { color: '#64748B', fontSize: '14px', fontWeight: '600', margin: 0 };
const cardVal = { fontSize: '28px', fontWeight: '800', color: '#1E293B', margin: '4px 0 0 0' };
const mainContentBox = { backgroundColor: '#FFF', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', overflow: 'hidden' };
const fancySearch = { padding: '12px 20px', borderRadius: '12px', border: '1px solid #E2E8F0', width: '280px', fontSize: '14px', outline: 'none', transition: 'all 0.3s', backgroundColor: '#F8FAFC' };
const p20 = { padding: '20px 25px' };
const avatarCircle = { width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#6366F1', color: '#FFF', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '16px' };
const btnActionEdit = { backgroundColor: '#FFF', color: '#D97706', border: '1px solid #FDE68A', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' };
const btnActionDelete = { backgroundColor: '#FFF', color: '#DC2626', border: '1px solid #FECACA', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' };
const btnSave = { backgroundColor: '#1E293B', color: '#FFF', border: 'none', padding: '12px', flex: 2, borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', transition: 'transform 0.2s' };
const btnCancel = { backgroundColor: '#F1F5F9', color: '#64748B', border: 'none', padding: '12px', flex: 1, borderRadius: '12px', cursor: 'pointer', fontWeight: '600' };
const modalOverlay = { position: 'fixed', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000 };
const modalContent = { backgroundColor: '#FFF', padding: '35px', borderRadius: '24px', width: '450px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' };
const inputStyle = { width: '100%', padding: '12px 16px', marginTop: '8px', borderRadius: '10px', border: '1.5px solid #E2E8F0', fontSize: '14px', outline: 'none', color: '#1E293B' };
const labelStyle = { fontSize: '13px', fontWeight: '700', color: '#475569', marginLeft: '4px' };
const formGroup = { marginBottom: '18px' };
const roleBadge = (role) => ({ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', backgroundColor: role === 'admin' ? '#FEE2E2' : '#E0F2FE', color: role === 'admin' ? '#991B1B' : '#075985' });