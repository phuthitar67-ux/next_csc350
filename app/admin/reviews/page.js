'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ReviewsPage() {

  const searchParams = useSearchParams()

  const shop_id = searchParams.get('shop_id')

  const [reviews, setReviews] = useState([])

  useEffect(() => {

    if (shop_id) {
      fetchReviews()
    }

  }, [shop_id])

  const fetchReviews = async () => {

    try {

     const res = await fetch(
  `/api/admin/reviews?shop_id=${shop_id}`

      )

      // ✅ เช็คก่อนว่า API error ไหม
      if (!res.ok) {

        console.log('โหลดข้อมูลไม่สำเร็จ')

        return
      }

      // ✅ แปลงเป็น text ก่อน
      const text = await res.text()

      // ✅ ถ้าไม่มีข้อมูล
      if (!text) {

        setReviews([])

        return
      }

      // ✅ แปลง JSON
      const data = JSON.parse(text)

      setReviews(data)

    } catch (error) {

      console.error(error)

    }

  }

  return (

    <div style={{
      padding:'40px',
      background:'#f1f5f9',
      minHeight:'100vh'
    }}>

      <h1 style={{
        fontSize:'36px',
        fontWeight:'bold',
        marginBottom:'30px'
      }}>
        ⭐ รีวิวร้านอาหาร
      </h1>

      {/* ปุ่มกลับ */}
      <button
        onClick={() => window.location.href = '/admin'}
        style={{
          background:'#2563eb',
          color:'#fff',
          border:'none',
          padding:'12px 20px',
          borderRadius:'12px',
          cursor:'pointer',
          fontWeight:'bold',
          marginBottom:'25px',
          fontSize:'16px'
        }}
      >
        ⬅ กลับหน้าหลัก
      </button>

      {reviews.length === 0 ? (

        <div style={{
          background:'#fff',
          padding:'30px',
          borderRadius:'20px'
        }}>
          ยังไม่มีรีวิว
        </div>

      ) : (

        reviews.map((item) => (

          <div
            key={item.id}
            style={{
              background:'#fff',
              padding:'25px',
              borderRadius:'20px',
              marginBottom:'25px',
              boxShadow:'0 2px 10px rgba(0,0,0,0.05)'
            }}
          >

            {/* HEADER */}
            <div style={{
              display:'flex',
              justifyContent:'space-between',
              alignItems:'center',
              marginBottom:'20px'
            }}>

              <div>

                <div style={{
                  fontSize:'26px',
                  fontWeight:'bold'
                }}>
                  🏪 {item.shop_name}
                </div>

                <div style={{
                  color:'#666',
                  marginTop:'5px'
                }}>
                  รีวิว ID : #{item.id}
                </div>

              </div>

              <div style={{
                fontSize:'28px',
                fontWeight:'bold',
                color:'#f59e0b'
              }}>
                ⭐ {item.rating}/5
              </div>

            </div>

            {/* DETAIL */}
            <div style={{
              display:'grid',
              gridTemplateColumns:'repeat(2,1fr)',
              gap:'15px',
              marginBottom:'20px'
            }}>

              <div>
                👤 <b>ลูกค้า:</b> {item.customer_name}
              </div>

              <div>
                📞 <b>เบอร์:</b> {item.customer_phone}
              </div>

              <div>
                📅 <b>วันที่จอง:</b> {
                  item.booking_date
                    ? new Date(item.booking_date)
                        .toLocaleDateString('th-TH')
                    : '-'
                }
              </div>

              <div>
                ⏰ <b>เวลา:</b> {item.booking_time}
              </div>

              <div>
                🍽️ <b>จำนวนคน:</b> {item.guest_count} คน
              </div>

              <div>
                💰 <b>ยอดรวม:</b> ฿{
                  Number(item.total_amount || 0)
                    .toLocaleString()
                }
              </div>

              {/* ✅ เปลี่ยนใหม่ */}
              <div>
                💳 <b>สถานะ:</b>

                <span style={{
                  color:'green',
                  fontWeight:'bold',
                  marginLeft:'8px'
                }}>
                  ชำระเงินและใช้บริการเรียบร้อยแล้ว
                </span>

              </div>

            </div>

            {/* COMMENT */}
            <div style={{
              background:'#f8fafc',
              padding:'20px',
              borderRadius:'15px',
              lineHeight:'1.8',
              fontSize:'18px'
            }}>
              📝 {item.comment}
            </div>

          </div>

        ))

      )}

    </div>

  )
}