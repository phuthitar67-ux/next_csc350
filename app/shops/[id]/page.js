'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ShopDetail() {

  const { id } = useParams()
  const router = useRouter()

  const [shop, setShop] = useState(null)

  const [availability, setAvailability] = useState({
    available: null,
    total: null
  })

  const [loadingTables, setLoadingTables] = useState(false)

  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '1',
    note: ''
  })

  useEffect(() => {

    fetch(`/api/shops/${id}`)
      .then(res => res.json())
      .then(data => setShop(data))
      .catch(err => console.error(err))

  }, [id])

  useEffect(() => {

    if (booking.date && booking.time) {
      checkAvailability()
    }

  }, [booking.date, booking.time])

  const checkAvailability = async () => {

    setLoadingTables(true)

    try {

      const res = await fetch(
        `/api/bookings/available-tables?shopId=${id}&date=${booking.date}&time=${booking.time}`
      )

      const data = await res.json()

      setAvailability({
        available: data.available,
        total: data.total
      })

    } catch (err) {

      console.error(err)

    } finally {

      setLoadingTables(false)

    }

  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (availability.available === 0) {
      alert('เวลานี้โต๊ะเต็มแล้ว')
      return
    }

    const savedUser = JSON.parse(localStorage.getItem('user'))

    try {

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          shop_id: id,
          user_id: savedUser?.id || null,
          ...booking
        })
      })

      const result = await res.json()

      if (res.ok) {

        const wantFood = confirm(
          'จองโต๊ะสำเร็จ ต้องการสั่งอาหารล่วงหน้าหรือไม่?'
        )

        if (wantFood) {

          router.push(`/shops/${id}/menu?bookingId=${result.id}`)

        } else {

          router.push('/history')

        }

      } else {

        alert(result.error || 'เกิดข้อผิดพลาด')

      }

    } catch (error) {

      console.error(error)
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')

    }

  }

  if (!shop) {

    return (
      <div style={{
        padding:'60px',
        textAlign:'center',
        fontSize:'20px'
      }}>
        กำลังโหลดข้อมูลร้าน...
      </div>
    )

  }

  return (

    <div style={{
      maxWidth:'900px',
      margin:'auto',
      padding:'30px 20px',
      background:'#f4f6f9',
      minHeight:'100vh',
      fontFamily:'sans-serif'
    }}>

      <button
        onClick={() => router.back()}
        style={{
          background:'#fff',
          border:'none',
          padding:'12px 22px',
          borderRadius:'12px',
          cursor:'pointer',
          fontWeight:'bold',
          marginBottom:'20px',
          boxShadow:'0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        ⬅ กลับหน้าหลัก
      </button>

      <div style={{
        background:'#fff',
        borderRadius:'28px',
        overflow:'hidden',
        boxShadow:'0 12px 30px rgba(0,0,0,0.08)'
      }}>

        <img
          src={shop.cover_image}
          alt={shop.name}
          style={{
            width:'100%',
            height:'360px',
            objectFit:'cover'
          }}
        />

        <div style={{
          padding:'30px'
        }}>

          <h1 style={{
            fontSize:'42px',
            marginBottom:'8px',
            color:'#222',
            fontWeight:'800'
          }}>
            {shop.name}
          </h1>

          <div style={{
            display:'flex',
            flexWrap:'wrap',
            gap:'15px',
            marginBottom:'18px',
            color:'#666',
            fontSize:'15px'
          }}>
            <span>⭐ {shop.rating || '4.8'}</span>
            <span>📍 {shop.address}</span>
            <span>🍽 ร้านอาหาร</span>
          </div>

          <p style={{
            color:'#777',
            lineHeight:'1.7',
            marginBottom:'25px',
            fontSize:'17px'
          }}>
            {shop.description}
          </p>

          <div style={{
            background:'#fff',
            borderRadius:'24px',
            padding:'30px',
            boxShadow:'0 8px 20px rgba(0,0,0,0.06)',
            border:'1px solid #f1f1f1'
          }}>

            <h2 style={{
              color:'#ff6b35',
              marginBottom:'25px',
              fontSize:'28px'
            }}>
              📅 กรอกรายละเอียดการจอง
            </h2>

            <form
              onSubmit={handleSubmit}
              style={{
                display:'grid',
                gap:'20px'
              }}
            >

              {booking.date && booking.time && (

                <div style={{
                  padding:'15px',
                  borderRadius:'14px',
                  textAlign:'center',
                  fontWeight:'bold',
                  background:
                    availability.available > 0
                      ? '#e8fff1'
                      : '#fff0f0',
                  color:
                    availability.available > 0
                      ? '#16a34a'
                      : '#dc2626'
                }}>

                  {loadingTables
                    ? 'กำลังเช็คโต๊ะว่าง...'
                    : availability.available > 0
                    ? `✅ เหลือ ${availability.available} โต๊ะ`
                    : '❌ โต๊ะเต็มแล้ว'}

                </div>

              )}

              <div>
                <label style={labelStyle}>
                  ชื่อผู้จอง
                </label>

                <input
                  type="text"
                  placeholder="ชื่อ-นามสกุล"
                  required
                  style={inputStyle}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      name:e.target.value
                    })
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>
                  เบอร์โทรศัพท์
                </label>

                <input
                  type="tel"
                  placeholder="08x-xxx-xxxx"
                  required
                  style={inputStyle}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      phone:e.target.value
                    })
                  }
                />
              </div>

              <div>
                <label style={labelStyle}>
                  จำนวนลูกค้า
                </label>

                <input
                  type="number"
                  min="1"
                  max="20"
                  value={booking.guests}
                  style={inputStyle}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      guests:e.target.value
                    })
                  }
                />
              </div>

              <div style={{
                display:'flex',
                gap:'15px'
              }}>

                <div style={{ flex:1 }}>
                  <label style={labelStyle}>
                    วันที่
                  </label>

                  <input
                    type="date"
                    required
                    style={inputStyle}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) =>
                      setBooking({
                        ...booking,
                        date:e.target.value
                      })
                    }
                  />
                </div>

                <div style={{ flex:1 }}>
                  <label style={labelStyle}>
                    เวลา
                  </label>

                  <input
                    type="time"
                    required
                    style={inputStyle}
                    onChange={(e) =>
                      setBooking({
                        ...booking,
                        time:e.target.value
                      })
                    }
                  />
                </div>

              </div>

              <div>
                <label style={labelStyle}>
                  หมายเหตุเพิ่มเติม
                </label>

                <textarea
                  placeholder="เช่น ขอโต๊ะริมหน้าต่าง"
                  style={textareaStyle}
                  onChange={(e) =>
                    setBooking({
                      ...booking,
                      note:e.target.value
                    })
                  }
                />
              </div>

              <button
                type="submit"
                style={{
                  background:'#ff6b35',
                  color:'#fff',
                  border:'none',
                  padding:'18px',
                  borderRadius:'16px',
                  fontSize:'18px',
                  fontWeight:'bold',
                  cursor:'pointer',
                  transition:'0.3s',
                  boxShadow:'0 10px 20px rgba(255,107,53,0.25)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#ea580c'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#ff6b35'
                }}
              >
                ยืนยันการจองโต๊ะ
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>

  )

}

const labelStyle = {
  display:'block',
  marginBottom:'8px',
  fontWeight:'bold',
  color:'#444'
}

const inputStyle = {
  width:'100%',
  padding:'14px 16px',
  borderRadius:'14px',
  border:'1px solid #ddd',
  fontSize:'16px',
  outline:'none',
  transition:'0.3s',
  boxSizing:'border-box'
}

const textareaStyle = {
  width:'100%',
  padding:'14px 16px',
  borderRadius:'14px',
  border:'1px solid #ddd',
  minHeight:'120px',
  fontSize:'16px',
  outline:'none',
  transition:'0.3s',
  resize:'none',
  boxSizing:'border-box',
  fontFamily:'inherit'
}