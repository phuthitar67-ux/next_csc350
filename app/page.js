'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {

  const [shops, setShops] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState(null)

  const router = useRouter()
  const pathname = usePathname()

  const [latestBooking, setLatestBooking] = useState(null)
  const [favorites, setFavorites] = useState([])

  const [showProfileModal, setShowProfileModal] = useState(false)

  const [editData, setEditData] = useState({
    fullname: '',
    phone: '',
    email: '',
    password: ''
  })

  // โหลดข้อมูล
  useEffect(() => {

    const savedUser = localStorage.getItem('user')

    if (savedUser) {

      const userData = JSON.parse(savedUser)

      setUser(userData)

      setEditData({
        ...userData,
        password: ''
      })

      fetchLatestBooking()

    }

    const savedFavorites =
      JSON.parse(localStorage.getItem('favorites')) || []

    setFavorites(savedFavorites)

    fetch('/api/shops')
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {

          const processedShops = data.map(shop => ({

            ...shop,

            name: shop.name || '',
            description: shop.description || '',
            realRating: shop.rating || 0

          }))

          setShops(processedShops)

        }

      })
      .catch(err => console.error(err))

  }, [])

  // ร้านโปรด
  const toggleFavorite = (shopId) => {

    let updatedFavorites =
      favorites.includes(shopId)

        ? favorites.filter(id => id !== shopId) 

        : [...favorites, shopId]

    setFavorites(updatedFavorites)

    localStorage.setItem(
      'favorites',
      JSON.stringify(updatedFavorites)
    )

  }

  // ดึง booking ล่าสุด
  const fetchLatestBooking = async () => {

    const res = await fetch('/api/history')

    const data = await res.json()

    if (data && data.length > 0) {

      setLatestBooking(data[0])

    }

  }

  // อัปเดตโปรไฟล์
  const handleUpdateProfile = () => {

    const updatedUser = {
      ...user,
      ...editData
    }

    localStorage.setItem(
      'user',
      JSON.stringify(updatedUser)
    )

    setUser(updatedUser)

    setShowProfileModal(false)

    alert('อัปเดตข้อมูลเรียบร้อย!')

  }

  // ออกจากระบบ
  const handleLogout = () => {

    if (confirm('ต้องการออกจากระบบ?')) {

      localStorage.removeItem('user')

      setUser(null)

      router.push('/login')

    }

  }

  // ค้นหาร้าน
  const filteredShops = shops.filter(shop =>

    shop.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

  )

  return (

    <div style={{
      minHeight:'100vh',
      background:'#ffffff',
      fontFamily:'Inter,sans-serif'
    }}>

      {/* NAVBAR */}

      <nav style={navBarStyle}>

        <div style={navContent}>

          <div style={logoWrapper}>

            <span style={{
              color:'#3182ce',
              fontSize:'24px'
            }}>
              🍴
            </span>

            <span style={brandName}>
              Hyper-Local Marketplace
            </span>

          </div>

          <div style={navMenu}>

            {user && (

              <div
                style={userChip}
                onClick={() => setShowProfileModal(true)}
              >

                <div style={avatarSmall}>
                  {user.fullname?.charAt(0) || 'U'}
                </div>

                <span>{user.fullname}</span>

              </div>

            )}

            <Link
              href="/favorites"
              style={actionBtn('#fff5f5','#e53e3e')}
            >
              ❤️ ร้านโปรด
            </Link>

            <Link
              href="/history"
              style={actionBtn('#fffaf0','#dd6b20')}
            >
              📜 ประวัติการจอง
            </Link>

            <button
              onClick={handleLogout}
              style={logoutBtnStyle}
            >
              ออกจากระบบ
            </button>

          </div>

        </div>

      </nav>

      {/* MAIN */}

      <main style={mainContentWrapper}>

        {/* HERO */}

        <header style={heroSection}>

          <h1 style={mainTitle}>
            จองร้านอาหารที่ใช่ 🍕
          </h1>

          <p style={subTitle}>
            ค้นหาร้านค้าและจองโต๊ะพร้อมสั่งอาหารล่วงหน้าได้ทันที
          </p>

          {/* SEARCH */}

          <div style={{
            position:'relative',
            width:'650px',
            margin:'0 auto 50px'
          }}>

            <span style={{
              position:'absolute',
              left:'20px',
              top:'50%',
              transform:'translateY(-50%)',
              fontSize:'20px',
              color:'#999'
            }}>
              🔍
            </span>

            <input
              type="text"
              placeholder="ค้นหาชื่อร้านอาหารที่คุณต้องการ..."
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
              style={{
                width:'100%',
                padding:'18px 20px 18px 55px',
                borderRadius:'18px',
                border:'1px solid #ddd',
                fontSize:'16px',
                outline:'none'
              }}
            />

          </div>

        </header>

        {/* STATUS */}

        {user && latestBooking && (

          <div style={statusCard}>

            <div style={statusHeader}>

              <strong>
                📍 ติดตามสถานะล่าสุด:
                {' '}
                {latestBooking.shop_name}
              </strong>

              <span style={bookingId}>
                ID: {latestBooking.id}
              </span>

            </div>

            <div style={progressLine}>

              <span style={stepText(true)}>
                รอดำเนินการ
              </span>

              <div style={connector(latestBooking.payment_slip)}></div>

              <span style={stepText(latestBooking.payment_slip)}>
                ชำระมัดจำแล้ว
              </span>

              <div style={connector(
                latestBooking.booking_status === 'confirmed'
              )}></div>

              <span style={stepText(
                latestBooking.booking_status === 'confirmed'
              )}>
                อนุมัติแล้ว
              </span>

            </div>

          </div>

        )}

        {/* SHOPS */}

        <section style={{
          marginTop:'40px'
        }}>

          <div style={gridDisplay}>

            {filteredShops.map(shop => (

              <div
                key={shop.id}

                style={{
                  width:'320px',
                  background:'#fff',
                  borderRadius:'24px',
                  overflow:'hidden',
                  boxShadow:'0 4px 15px rgba(0,0,0,0.08)',
                  transition:'0.3s',
                  cursor:'pointer'
                }}

                onMouseEnter={(e)=>{

                  e.currentTarget.style.transform='translateY(-8px)'

                  e.currentTarget.style.boxShadow =
                    '0 10px 25px rgba(0,0,0,0.15)'

                }}

                onMouseLeave={(e)=>{

                  e.currentTarget.style.transform='translateY(0px)'

                  e.currentTarget.style.boxShadow =
                    '0 4px 15px rgba(0,0,0,0.08)'

                }}
              >

                <div style={imageContainer}>

                  <img
                    src={shop.cover_image}
                    alt={shop.name}

                    style={{
                      width:'100%',
                      height:'220px',
                      objectFit:'cover'
                    }}
                  />

                  {/* FAVORITE */}

                  <div
                    onClick={() => toggleFavorite(shop.id)}
                    style={favOverlay}
                  >

                    {favorites.includes(shop.id)
                      ? '❤️'
                      : '🤍'}

                  </div>

                  {/* STAR */}

                  <div style={starBadge}>
                    ⭐ {Number(shop.realRating).toFixed(1)}
                  </div>

                </div>

                <div style={cardDetails}>

                  <h3 style={cardTitle}>
                    {shop.name}
                  </h3>

                  <p style={cardDesc}>
                    {shop.description}
                  </p>

                  <Link
                    href={`/shops/${shop.id}`}
                    style={{
                      textDecoration:'none'
                    }}
                  >

                    <button

                      style={{
                        width:'100%',
                        background:'#2563eb',
                        color:'#fff',
                        border:'none',
                        padding:'14px',
                        borderRadius:'14px',
                        fontWeight:'bold',
                        fontSize:'16px',
                        cursor:'pointer',
                        transition:'0.3s'
                      }}

                      onMouseEnter={(e)=>{

                        e.currentTarget.style.background =
                          '#1d4ed8'

                      }}

                      onMouseLeave={(e)=>{

                        e.currentTarget.style.background =
                          '#2563eb'

                      }}
                    >
                      ดูรายละเอียดและจองโต๊ะ
                    </button>

                  </Link>

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

      {/* MODAL */}

      {showProfileModal && (

        <div style={overlay}>

          <div style={modalBox}>

            <h3 style={{
              marginBottom:'20px',
              textAlign:'center'
            }}>
              ตั้งค่าโปรไฟล์
            </h3>

            <div style={fieldGroup}>

              <label>ชื่อ-นามสกุล</label>

              <input
                style={formInput}
                value={editData.fullname}

                onChange={(e)=>

                  setEditData({
                    ...editData,
                    fullname:e.target.value
                  })

                }
              />

            </div>

            <div style={fieldGroup}>

              <label>เบอร์โทรศัพท์</label>

              <input
                style={formInput}
                value={editData.phone}

                onChange={(e)=>

                  setEditData({
                    ...editData,
                    phone:e.target.value
                  })

                }
              />

            </div>

            <div style={modalActions}>

              <button
                onClick={handleUpdateProfile}
                style={saveBtn}
              >
                บันทึกข้อมูล
              </button>

              <button
                onClick={() => setShowProfileModal(false)}
                style={cancelBtn}
              >
                ปิด
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}

/* ===========================
   STYLE
=========================== */

const navBarStyle = {
  height:'75px',
  background:'#fff',
  borderBottom:'1px solid #edf2f7',
  position:'sticky',
  top:0,
  zIndex:1000
}

const navContent = {
  maxWidth:'1200px',
  margin:'0 auto',
  height:'100%',
  display:'flex',
  alignItems:'center',
  justifyContent:'space-between',
  padding:'0 20px'
}

const logoWrapper = {
  display:'flex',
  alignItems:'center'
}

const brandName = {
  fontSize:'20px',
  fontWeight:'800',
  color:'#2b6cb0',
  marginLeft:'10px'
}

const navMenu = {
  display:'flex',
  gap:'12px',
  alignItems:'center'
}

const actionBtn = (bg,color) => ({
  backgroundColor:bg,
  color:color,
  padding:'8px 16px',
  borderRadius:'12px',
  textDecoration:'none',
  fontWeight:'700',
  fontSize:'14px'
})

const userChip = {
  display:'flex',
  alignItems:'center',
  gap:'8px',
  padding:'6px 12px',
  background:'#ebf8ff',
  borderRadius:'20px',
  cursor:'pointer',
  fontWeight:'600',
  color:'#2c5282'
}

const avatarSmall = {
  width:'28px',
  height:'28px',
  background:'#3182ce',
  color:'#fff',
  borderRadius:'50%',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  fontSize:'12px'
}

const logoutBtnStyle = {
  background:'#fff5f5',
  color:'#c53030',
  border:'1px solid #feb2b2',
  padding:'8px 16px',
  borderRadius:'12px',
  fontWeight:'700',
  cursor:'pointer'
}

const mainContentWrapper = {
  maxWidth:'1100px',
  margin:'0 auto',
  padding:'60px 20px'
}

const heroSection = {
  textAlign:'center',
  marginBottom:'60px'
}

const mainTitle = {
  fontSize:'42px',
  fontWeight:'900',
  color:'#1a202c',
  marginBottom:'10px'
}

const subTitle = {
  color:'#718096',
  fontSize:'18px',
  marginBottom:'30px'
}

const gridDisplay = {
  display:'grid',
  gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',
  gap:'35px'
}

const imageContainer = {
  position:'relative'
}

const favOverlay = {
  position:'absolute',
  top:'15px',
  left:'15px',
  background:'#fff',
  width:'38px',
  height:'38px',
  borderRadius:'50%',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  cursor:'pointer',
  boxShadow:'0 4px 10px rgba(0,0,0,0.1)'
}

const starBadge = {
  position:'absolute',
  top:'15px',
  right:'15px',
  background:'rgba(255,255,255,0.9)',
  padding:'5px 12px',
  borderRadius:'12px',
  fontWeight:'800',
  fontSize:'13px',
  color:'#d97706'
}

const cardDetails = {
  padding:'25px'
}

const cardTitle = {
  margin:'0 0 10px 0',
  fontSize:'20px',
  fontWeight:'800',
  color:'#2d3748'
}

const cardDesc = {
  color:'#718096',
  fontSize:'14px',
  lineHeight:'1.5',
  marginBottom:'25px',
  height:'42px',
  overflow:'hidden'
}

const statusCard = {
  background:'#fff',
  padding:'25px',
  borderRadius:'25px',
  border:'1px solid #e2e8f0',
  marginBottom:'30px'
}

const statusHeader = {
  display:'flex',
  justifyContent:'space-between',
  marginBottom:'20px'
}

const bookingId = {
  color:'#a0aec0',
  fontSize:'13px'
}

const progressLine = {
  display:'flex',
  alignItems:'center',
  justifyContent:'space-between'
}

const stepText = (active) => ({
  fontSize:'12px',
  fontWeight:'700',
  color:active ? '#3182ce' : '#cbd5e0'
})

const connector = (active) => ({
  flex:1,
  height:'3px',
  backgroundColor:active ? '#3182ce' : '#edf2f7',
  margin:'0 15px'
})

const overlay = {
  position:'fixed',
  inset:0,
  background:'rgba(0,0,0,0.5)',
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  zIndex:2000,
  backdropFilter:'blur(5px)'
}

const modalBox = {
  background:'#fff',
  padding:'40px',
  borderRadius:'30px',
  width:'450px'
}

const fieldGroup = {
  marginBottom:'20px'
}

const formInput = {
  width:'100%',
  padding:'12px 15px',
  borderRadius:'12px',
  border:'1px solid #e2e8f0',
  marginTop:'8px',
  boxSizing:'border-box'
}

const modalActions = {
  display:'flex',
  gap:'15px',
  marginTop:'30px'
}

const saveBtn = {
  flex:2,
  padding:'14px',
  borderRadius:'15px',
  border:'none',
  background:'#3182ce',
  color:'#fff',
  fontWeight:'700',
  cursor:'pointer'
}

const cancelBtn = {
  flex:1,
  padding:'14px',
  borderRadius:'15px',
  border:'none',
  background:'#f7fafc',
  color:'#4a5568',
  fontWeight:'700',
  cursor:'pointer'
}