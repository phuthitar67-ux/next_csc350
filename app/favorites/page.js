'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  // 📦 [STATE] เก็บรายการร้านค้าที่กรองแล้ว และสถานะการโหลด
  const [favoriteShops, setFavoriteShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ------------------------------------------------------------
  // ⚙️ [LOGIC] การดึงข้อมูลร้านโปรด
  // ------------------------------------------------------------
  useEffect(() => {
    // 1. ดึงรายการ ID ร้านโปรดที่ผู้ใช้เคยบันทึกไว้ในเครื่อง (LocalStorage)
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // 2. [API CALL] ดึงข้อมูลร้านค้าทั้งหมดเพื่อมาเปรียบเทียบ ID
    fetch('/api/shops')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // ✅ [FILTER] กรองเอาเฉพาะร้านที่มี ID ตรงกับในรายการโปรดของผู้ใช้
          const filtered = data.filter(shop => savedFavorites.includes(shop.id));
          setFavoriteShops(filtered);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  // ⚙️ [LOGIC] ฟังก์ชันลบร้านออกจากรายการโปรด (Remove Favorite)
  const removeFavorite = (id) => {
    // ดึงค่าปัจจุบันมา Filter ตัวที่ต้องการลบออก
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const newFavorites = savedFavorites.filter(favId => favId !== id);
    
    // อัปเดตทั้งใน LocalStorage (เพื่อให้ข้อมูลคงอยู่) และ State (เพื่อให้หน้าจอเปลี่ยนทันที)
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavoriteShops(favoriteShops.filter(shop => shop.id !== id));
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        
        {/* 🔙 [UI TOP] ปุ่มย้อนกลับ */}
        <button onClick={() => router.back()} style={backLinkStyle}>
          ← กลับหน้าหลัก
        </button>
        
        <h1 style={titleStyle}>❤️ ร้านโปรดของฉัน</h1>

        {/* --------------------------------------------------------
            🖼️ [UI SECTION] รายการร้านโปรด (GRID DISPLAY)
            -------------------------------------------------------- */}
        {loading ? (
          <p>กำลังโหลด...</p>
        ) : favoriteShops.length > 0 ? (
          <div style={gridStyle}>
            {favoriteShops.map(shop => (
              <div key={shop.id} style={shopCardStyle}>
                
                {/* ส่วนรูปภาพและปุ่มถอนการติดตั้งรายการโปรด */}
                <div style={{ position: 'relative' }}>
                  <img 
                    src={shop.cover_image} 
                    style={imageStyle} 
                    alt={shop.name} 
                  />
                  {/* ปุ่มหัวใจสำหรับ "ยกเลิก" การเป็นร้านโปรด */}
                  <button onClick={() => removeFavorite(shop.id)} style={heartBtnStyle}>
                    ❤️
                  </button>
                </div>

                {/* ส่วนรายละเอียดร้าน */}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{shop.name}</h3>
                  <Link href={`/shops/${shop.id}`} style={{ textDecoration: 'none' }}>
                    <button style={btnBooking}>จองตอนนี้</button>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* 😶 [UI SECTION] กรณีไม่มีร้านโปรด (Empty State) */
          <div style={emptyStateStyle}>
            <p style={{ fontSize: '4rem' }}>😶</p>
            <h3>ยังไม่มีร้านโปรดเลย</h3>
            <Link href="/" style={{ color: '#0070f3', fontWeight: 'bold' }}>
              ไปหาร้านที่ถูกใจกันเถอะ!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// 🎨 [STYLE SECTION] การกำหนดดีไซน์
// ------------------------------------------------------------
const containerStyle = { 
  backgroundColor: '#fcfcfc', 
  minHeight: '100vh', 
  padding: '30px 25px',
  fontFamily: "'Prompt', sans-serif"
};

const backLinkStyle = { 
  border: 'none', 
  background: 'none', 
  cursor: 'pointer', 
  marginBottom: '20px', 
  color: '#0070f3', 
  fontWeight: 'bold',
  fontSize: '16px'
};

const titleStyle = { fontSize: '2.2rem', marginBottom: '30px', fontWeight: '800', color: '#1a202c' };

const gridStyle = { 
  display: 'grid', 
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
  gap: '30px' 
};

const shopCardStyle = { 
  backgroundColor: '#fff', 
  borderRadius: '25px', 
  overflow: 'hidden', 
  boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
  transition: 'transform 0.2s ease'
};

const imageStyle = { width: '100%', height: '180px', objectFit: 'cover' };

const heartBtnStyle = { 
  position: 'absolute', 
  top: '15px', 
  right: '15px', // ย้ายมาขวาให้ดูเป็นสากลขึ้น
  backgroundColor: '#fff', 
  width: '35px', 
  height: '35px', 
  borderRadius: '50%', 
  border: 'none', 
  cursor: 'pointer', 
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)', 
  fontSize: '18px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const btnBooking = { 
  width: '100%', 
  padding: '12px', 
  backgroundColor: '#0070f3', 
  color: 'white', 
  border: 'none', 
  borderRadius: '12px', 
  fontWeight: 'bold', 
  cursor: 'pointer',
  transition: 'background 0.3s'
};

const emptyStateStyle = { 
  textAlign: 'center', 
  marginTop: '100px', 
  color: '#888' 
};