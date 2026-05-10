'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BookingHistory() {

  const [user, setUser] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const [isEditing, setIsEditing] = useState(false)

  const [editData, setEditData] = useState({
    fullname: '',
    phone: '',
    email: ''
  })

  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const fetchHistory = async (userId) => {

    try {

      const res = await fetch(
        `/api/bookings/history?userId=${userId}&t=${Date.now()}`
      )

      const data = await res.json()

      if (Array.isArray(data)) {
        setHistory(data)
      } else {
        setHistory([])
      }

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    const savedUser = JSON.parse(
      localStorage.getItem('user')
    )

    if (savedUser && savedUser.id) {

      setUser(savedUser)

      setEditData({
        fullname: savedUser.fullname || '',
        phone: savedUser.phone || '',
        email: savedUser.email || ''
      })

      fetchHistory(savedUser.id)

    } else {

      router.push('/login')

    }

  }, [router])

  const handleUpdateProfile = async () => {

    const updatedUser = {
      ...user,
      ...editData
    }

    localStorage.setItem(
      'user',
      JSON.stringify(updatedUser)
    )

    setUser(updatedUser)

    setIsEditing(false)

    alert('บันทึกข้อมูลเรียบร้อยแล้ว')

  }

  const handleReviewSubmit = async () => {

    if (!comment.trim()) {
      return alert('กรุณาพิมพ์ข้อความรีวิว')
    }

    setIsSubmitting(true)

    try {

      const res = await fetch('/api/reviews', {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          shop_id:selectedBooking.shop_id,
          user_id:user.id,
          booking_id:selectedBooking.id,
          rating,
          comment
        })
      })

      if (res.ok) {

        alert('ขอบคุณสำหรับรีวิว ❤️')

        setShowReviewModal(false)

        setComment('')

        setRating(5)

        fetchHistory(user.id)

      }

    } catch (err) {

      alert('เกิดข้อผิดพลาด')

    } finally {

      setIsSubmitting(false)

    }

  }

  const handleCancel = async (id) => {

    if (
      confirm('ต้องการยกเลิกการจองนี้ใช่ไหม?')
    ) {

      try {

        const res = await fetch(
          '/api/bookings/cancel',
          {
            method:'PATCH',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({
              bookingId:id
            })
          }
        )

        if (res.ok) {

          const newHistory = history.map(item =>
            item.id === id
              ? {
                  ...item,
                  booking_status:'rejected'
                }
              : item
          )

          setHistory(newHistory)

          alert('ยกเลิกเรียบร้อย')

        }

      } catch {

        alert('ไม่สามารถยกเลิกได้')

      }

    }

  }

  const checkStatus = (item) => {

    const status = item.booking_status

    if (
      status === 'completed' ||
      status === 'paid'
    ) {
      return 'PAID'
    }

    if (status === 'confirmed') {
      return 'CONFIRMED'
    }

    if (status === 'rejected') {
      return 'REJECTED'
    }

    return 'PENDING'

  }

  const hasActiveBooking = history.some(
    item =>
      item.booking_status === 'pending' ||
      item.booking_status === 'confirmed'
  )

  if (loading) {

    return (
      <div style={{
        textAlign:'center',
        padding:'100px',
        fontSize:'20px'
      }}>
        🕒 กำลังโหลด...
      </div>
    )

  }

  return (

    <div style={{
      maxWidth:'950px',
      margin:'auto',
      padding:'20px',
      minHeight:'100vh',
      fontFamily:'sans-serif',
      background:
      'linear-gradient(to bottom,#f8fafc,#eef2ff)'
    }}>

      <div style={{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:'25px'
      }}>

        <button
          onClick={() => router.push('/')}
          style={backBtn}
        >
          🏠 กลับหน้าหลัก
        </button>

        <button
          onClick={() => {

            localStorage.removeItem('user')

            router.push('/login')

          }}
          style={logoutBtn}
        >
          ออกจากระบบ
        </button>

      </div>

      <div style={profileCard}>

        {!isEditing ? (

          <div style={{
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center'
          }}>

            <div style={{
              display:'flex',
              alignItems:'center',
              gap:'18px'
            }}>

              <div style={{
                width:'70px',
                height:'70px',
                borderRadius:'50%',
                background:'#2563eb',
                color:'#fff',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontSize:'30px',
                fontWeight:'bold'
              }}>
                {user?.fullname?.charAt(0)}
              </div>

              <div>

                <h1 style={{
                  margin:0,
                  fontSize:'1.7rem',
                  color:'#222'
                }}>
                  {user?.fullname}
                </h1>

                <p style={{
                  marginTop:'8px',
                  color:'#666'
                }}>
                  📞 {user?.phone}
                </p>

                <p style={{
                  color:'#888',
                  marginTop:'5px'
                }}>
                  📧 {user?.email}
                </p>

              </div>

            </div>

            <button
              onClick={() => setIsEditing(true)}
              style={editBtn}
            >
              ⚙️ แก้ไขโปรไฟล์
            </button>

          </div>

        ) : (

          <div style={{
            display:'grid',
            gap:'15px'
          }}>

            <h3>📝 แก้ไขข้อมูล</h3>

            <input
              style={inputStyle}
              value={editData.fullname}
              onChange={(e)=>
                setEditData({
                  ...editData,
                  fullname:e.target.value
                })
              }
              placeholder="ชื่อ"
            />

            <input
              style={inputStyle}
              value={editData.phone}
              onChange={(e)=>
                setEditData({
                  ...editData,
                  phone:e.target.value
                })
              }
              placeholder="เบอร์"
            />

            <div style={{
              display:'flex',
              gap:'10px'
            }}>

              <button
                onClick={handleUpdateProfile}
                style={saveBtn}
              >
                💾 บันทึก
              </button>

              <button
                onClick={() =>
                  setIsEditing(false)
                }
                style={cancelBtn}
              >
                ยกเลิก
              </button>

            </div>

          </div>

        )}

      </div>

      <h2 style={{
        marginBottom:'25px',
        color:'#333',
        borderLeft:'6px solid #2563eb',
        paddingLeft:'15px'
      }}>
        📜 ประวัติการจอง
      </h2>

      {history.length === 0 ? (

        <div style={emptyState}>

          <div style={{
            fontSize:'4rem'
          }}>
            📭
          </div>

          <p>ยังไม่มีประวัติการจอง</p>

        </div>

      ) : (

        <div style={{
          display:'grid',
          gap:'22px'
        }}>

          {history.map((item) => {

            const currentStatus =
              checkStatus(item)

            const shopImage =
              item.cover_image
              ? item.cover_image
              : 'https://via.placeholder.com/500x300'

            return (

              <div
                key={item.id}
                style={cardStyle}
              >

                <img
                  src={shopImage}
                  style={imageStyle}
                  alt="shop"
                />

                <div style={{
                  padding:'20px',
                  flex:1
                }}>

                  <div style={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'center',
                    marginBottom:'15px'
                  }}>

                    <h2 style={{
                      margin:0,
                      color:'#222',
                      fontSize:'22px'
                    }}>
                      {item.shop_name}
                    </h2>

                    <span style={{
                      ...statusBadge,
                      backgroundColor:
                        currentStatus === 'PAID'
                        ? '#22c55e'
                        : currentStatus === 'CONFIRMED'
                        ? '#3b82f6'
                        : currentStatus === 'REJECTED'
                        ? '#ef4444'
                        : '#f59e0b'
                    }}>

                      {
                        currentStatus === 'PAID'
                        ? '✅ ชำระครบแล้ว'

                        : currentStatus === 'CONFIRMED'
                        ? '✔️ ยืนยันแล้ว'

                        : currentStatus === 'REJECTED'
                        ? '❌ ถูกยกเลิก'

                        : '🕒 รอตรวจสอบ'
                      }

                    </span>

                  </div>

                  <div style={detailGrid}>

                    <div>
                      📅 {new Date(
                        item.booking_date
                      ).toLocaleDateString('th-TH')}
                    </div>

                    <div>
                      ⏰ {
                        item.booking_time?.substring(0,5)
                      } น.
                    </div>

                    <div>
                      👥 {item.guest_count} ท่าน
                    </div>

                    <div>
                      💰 ฿{
                        Number(
                          item.deposit_amount
                        ).toLocaleString()
                      }
                    </div>

                  </div>

                  <hr style={{
                    border:'none',
                    borderTop:'1px solid #e2e8f0',
                    margin:'18px 0'
                  }} />

                  <div style={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'center'
                  }}>

                    <small style={{
                      color:'#94a3b8'
                    }}>
                      #{item.id}
                    </small>

                    <div style={{
                      display:'flex',
                      gap:'10px'
                    }}>

                      {currentStatus === 'PAID' && (

                        <button
                          style={reviewBtn}
                          onClick={()=>{
                            setSelectedBooking(item)
                            setShowReviewModal(true)
                          }}
                        >
                          ⭐ รีวิว
                        </button>

                      )}

                      {currentStatus === 'PENDING' && (

                        <button
                          style={cancelBookingBtn}
                          onClick={() =>
                            handleCancel(item.id)
                          }
                        >
                          🚫 ยกเลิก
                        </button>

                      )}

                      <button
                        style={receiptBtn}
                        onClick={() =>
                          router.push(
                            `/history/receipt/${item.id}`
                          )
                        }
                      >
                        🧾 ใบเสร็จ
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            )

          })}

          <button
            onClick={() => {

              if (hasActiveBooking) {

                alert(
                  '⚠️ คุณมีรายการที่กำลังดำเนินการอยู่'
                )

              } else {

                router.push('/')

              }

            }}
            style={bookNowBtn}
          >
            + จองร้านอาหารใหม่
          </button>

        </div>

      )}

      {showReviewModal && (

        <div style={modalOverlay}>

          <div style={modalBox}>

            <h2 style={{
              marginTop:0,
              marginBottom:'20px',
              color:'#222'
            }}>
              ⭐ รีวิวร้านอาหาร
            </h2>

            <p style={{
              color:'#666',
              marginBottom:'20px'
            }}>
              {selectedBooking?.shop_name}
            </p>

            <div style={{
              display:'flex',
              justifyContent:'center',
              gap:'10px',
              marginBottom:'25px'
            }}>

              {[1,2,3,4,5].map((star)=>(
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    fontSize:'32px',
                    border:'none',
                    background:'none',
                    cursor:'pointer',
                    color:
                      star <= rating
                      ? '#f59e0b'
                      : '#d1d5db'
                  }}
                >
                  ★
                </button>
              ))}

            </div>

            <textarea
              value={comment}
              onChange={(e)=>
                setComment(e.target.value)
              }
              placeholder="เขียนรีวิวของคุณ..."
              style={{
                width:'100%',
                height:'120px',
                borderRadius:'16px',
                border:'1px solid #dbe2ea',
                padding:'15px',
                resize:'none',
                outline:'none',
                fontSize:'15px',
                marginBottom:'20px'
              }}
            />

            <div style={{
              display:'flex',
              gap:'12px'
            }}>

              <button
                onClick={handleReviewSubmit}
                disabled={isSubmitting}
                style={{
                  flex:1,
                  padding:'14px',
                  background:'#22c55e',
                  color:'#fff',
                  border:'none',
                  borderRadius:'14px',
                  cursor:'pointer',
                  fontWeight:'700'
                }}
              >

                {
                  isSubmitting
                  ? '⏳ กำลังส่ง...'
                  : '✅ ส่งรีวิว'
                }

              </button>

              <button
                onClick={() => {

                  setShowReviewModal(false)

                  setComment('')

                  setRating(5)

                }}
                style={{
                  flex:1,
                  padding:'14px',
                  background:'#f1f5f9',
                  border:'none',
                  borderRadius:'14px',
                  cursor:'pointer',
                  fontWeight:'700'
                }}
              >
                ยกเลิก
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}

const modalOverlay = {
  position:'fixed',
  top:0,
  left:0,
  right:0,
  bottom:0,
  background:'rgba(0,0,0,0.45)',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  zIndex:9999,
  padding:'20px'
}

const modalBox = {
  background:'#fff',
  width:'100%',
  maxWidth:'500px',
  borderRadius:'28px',
  padding:'30px',
  boxShadow:'0 20px 50px rgba(0,0,0,0.2)'
}

const profileCard = {
  background:'#ffffff',
  padding:'30px',
  borderRadius:'30px',
  boxShadow:'0 10px 35px rgba(0,0,0,0.06)',
  marginBottom:'35px',
  border:'1px solid #eef2f7'
}

const inputStyle = {
  padding:'14px',
  borderRadius:'14px',
  border:'1px solid #dbe2ea',
  fontSize:'15px',
  outline:'none',
  transition:'0.3s',
  background:'#fff'
}

const editBtn = {
  padding:'12px 20px',
  background:'#f8fafc',
  border:'1px solid #e2e8f0',
  borderRadius:'14px',
  cursor:'pointer',
  fontWeight:'600'
}

const saveBtn = {
  padding:'13px',
  background:'#22c55e',
  color:'#fff',
  border:'none',
  borderRadius:'14px',
  cursor:'pointer',
  flex:1,
  fontWeight:'600'
}

const cancelBtn = {
  padding:'13px',
  background:'#f1f5f9',
  border:'none',
  borderRadius:'14px',
  cursor:'pointer',
  flex:1,
  fontWeight:'600'
}

const statusBadge = {
  padding:'10px 18px',
  borderRadius:'999px',
  fontSize:'13px',
  color:'#fff',
  fontWeight:'700',
  boxShadow:'0 4px 10px rgba(0,0,0,0.08)'
}

const backBtn = {
  padding:'11px 18px',
  border:'none',
  borderRadius:'14px',
  background:'#fff',
  cursor:'pointer',
  fontWeight:'700',
  boxShadow:'0 4px 14px rgba(0,0,0,0.06)'
}

const logoutBtn = {
  border:'none',
  background:'transparent',
  color:'#ef4444',
  cursor:'pointer',
  fontWeight:'600',
  fontSize:'15px'
}

const cardStyle = {
  display:'flex',
  background:'#ffffff',
  borderRadius:'30px',
  overflow:'hidden',
  boxShadow:'0 10px 30px rgba(0,0,0,0.06)',
  transition:'0.35s',
  border:'1px solid #edf2f7'
}

const imageStyle = {
  width:'230px',
  height:'180px',
  objectFit:'cover'
}

const detailGrid = {
  display:'grid',
  gridTemplateColumns:'1fr 1fr',
  gap:'14px',
  color:'#475569',
  fontSize:'16px',
  marginTop:'12px'
}

const cancelBookingBtn = {
  padding:'10px 18px',
  color:'#ef4444',
  border:'1.5px solid #ef4444',
  borderRadius:'12px',
  background:'#fff',
  cursor:'pointer',
  fontWeight:'600'
}

const receiptBtn = {
  padding:'10px 18px',
  color:'#2563eb',
  border:'1.5px solid #2563eb',
  borderRadius:'12px',
  background:'#fff',
  cursor:'pointer',
  fontWeight:'600'
}

const reviewBtn = {
  padding:'10px 18px',
  color:'#f59e0b',
  border:'1.5px solid #f59e0b',
  borderRadius:'12px',
  background:'#fffaf0',
  cursor:'pointer',
  fontWeight:'600'
}

const emptyState = {
  textAlign:'center',
  padding:'110px 20px',
  color:'#94a3b8',
  background:'#fff',
  borderRadius:'30px',
  boxShadow:'0 10px 30px rgba(0,0,0,0.05)'
}

const bookNowBtn = {
  marginTop:'10px',
  padding:'16px',
  background:'linear-gradient(to right,#ff5722,#ff7849)',
  color:'#fff',
  border:'none',
  borderRadius:'18px',
  cursor:'pointer',
  width:'100%',
  fontWeight:'700',
  fontSize:'16px',
  boxShadow:'0 8px 20px rgba(255,87,34,0.25)'
}