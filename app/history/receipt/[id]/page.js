'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ReceiptPage() {

  const { id } = useParams()
  const router = useRouter()

  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    if (!id || id === '#') return

    fetch(`/api/bookings/${id}`)

      .then(res => res.json())

      .then(data => {

        const result =
          Array.isArray(data)
          ? data[0]
          : data

        if (result && !result.error) {
          setBooking(result)
        }

        setLoading(false)

      })

      .catch(err => {

        console.error(err)

        setLoading(false)

      })

  }, [id])

  if (loading) {

    return (

      <div style={{
        textAlign:'center',
        padding:'100px',
        fontSize:'20px'
      }}>
        🕒 กำลังโหลดข้อมูล...
      </div>

    )

  }

  if (!booking) {

    return (

      <div style={{
        textAlign:'center',
        padding:'100px'
      }}>

        <p style={{
          color:'#ff5252'
        }}>
          ❌ ไม่พบข้อมูลใบเสร็จ
        </p>

        <button
          onClick={() => router.push('/history')}
          style={backToHistoryBtn}
        >
          กลับไปหน้าประวัติ
        </button>

      </div>

    )

  }

  const isPaid =
    booking.booking_status === 'completed' ||
    booking.booking_status === 'paid'

  const remainAmount =
    Number(booking.total_amount) -
    Number(booking.deposit_amount)

  return (

    <div style={containerStyle}>

      <div style={receiptCard}>

        <div style={{
          ...headerSection,

          backgroundColor:
            isPaid
            ? '#16a34a'
            : '#f59e0b'
        }}>

          <div style={{
            fontSize:'60px'
          }}>
            {isPaid ? '✅' : '🕒'}
          </div>

          <h2 style={{
            margin:'10px 0 0 0'
          }}>

            {
              isPaid
              ? 'ชำระเงินสำเร็จ'
              : 'จองโต๊ะสำเร็จ'
            }

          </h2>

          <p style={{
            opacity:0.9,
            fontSize:'14px'
          }}>
            รหัสการจอง: #{id}
          </p>

        </div>

        <div style={{
          padding:'35px'
        }}>

          <div style={infoDivider}>

            <h3 style={{
              margin:'0 0 12px 0',
              color:'#222',
              fontSize:'30px'
            }}>
              {booking.shop_name || 'ร้านอาหาร'}
            </h3>

            <p style={detailText}>
              📅 วันที่:
              {' '}
              {
                new Date(
                  booking.booking_date
                ).toLocaleDateString(
                  'th-TH',
                  {
                    day:'numeric',
                    month:'long',
                    year:'numeric'
                  }
                )
              }
            </p>

            <p style={detailText}>
              ⏰ เวลา:
              {' '}
              {booking.booking_time?.substring(0,5)}
              {' '}
              น.
            </p>

            <p style={detailText}>
              👥 จำนวน:
              {' '}
              {booking.guest_count}
              {' '}
              ท่าน
            </p>

          </div>

          <div style={infoDivider}>

            <h4 style={sectionTitle}>
              รายการอาหาร
            </h4>

            {
              booking.items &&
              booking.items.length > 0

              ? (

                booking.items.map((item,index) => (

                  <div
                    key={index}
                    style={itemRow}
                  >

                    <span style={{
                      color:'#444'
                    }}>
                      {item.menu_name}

                      <small style={{
                        color:'#999'
                      }}>
                        {' '}
                        x{item.quantity}
                      </small>

                    </span>

                    <span style={{
                      fontWeight:'600'
                    }}>
                      ฿{
                        (
                          item.price_at_booking *
                          item.quantity
                        ).toLocaleString()
                      }
                    </span>

                  </div>

                ))

              )

              : (

                <p style={emptyText}>
                  ไม่มีรายการอาหาร
                </p>

              )
            }

          </div>

          <div style={{
            marginBottom:'20px'
          }}>

            <div style={priceRow}>

              <span>
                ยอดรวมค่าอาหาร
              </span>

              <span style={{
                fontWeight:'bold'
              }}>
                ฿{
                  Number(
                    booking.total_amount
                  ).toLocaleString()
                }
              </span>

            </div>

            <div style={{
              ...priceRow,
              color:'#16a34a'
            }}>

              <span>
                จ่ายมัดจำแล้ว (50%)
              </span>

              <span style={{
                fontWeight:'bold'
              }}>
                - ฿{
                  Number(
                    booking.deposit_amount
                  ).toLocaleString()
                }
              </span>

            </div>

            {
              isPaid ? (

                <>

                  <div style={{
                    ...priceRow,
                    color:'#2563eb'
                  }}>

                    <span>
                      ชำระเพิ่มที่ร้าน
                    </span>

                    <span style={{
                      fontWeight:'bold'
                    }}>
                      ฿{
                        remainAmount.toLocaleString()
                      }
                    </span>

                  </div>

                  <div style={{
                    marginTop:'25px',
                    padding:'22px',
                    borderRadius:'18px',
                    background:'#dcfce7',
                    border:'1px solid #86efac',
                    textAlign:'center'
                  }}>

                    <div style={{
                      fontSize:'42px',
                      marginBottom:'10px'
                    }}>
                      ✅
                    </div>

                    <div style={{
                      fontSize:'24px',
                      fontWeight:'bold',
                      color:'#15803d'
                    }}>
                      ชำระเงินเรียบร้อยแล้ว
                    </div>

                    <div style={{
                      marginTop:'10px',
                      color:'#166534',
                      fontSize:'15px'
                    }}>
                      ร้านได้รับชำระเงินครบทั้งหมดแล้ว
                    </div>

                    <div style={{
                      marginTop:'18px',
                      fontSize:'28px',
                      fontWeight:'bold',
                      color:'#166534'
                    }}>
                      ฿{
                        Number(
                          booking.total_amount
                        ).toLocaleString()
                      }
                    </div>

                  </div>

                </>

              ) : (

                <div style={balanceBox}>

                  <span style={{
                    fontWeight:'bold'
                  }}>
                    ยอดที่ต้องจ่ายเพิ่มที่ร้าน
                  </span>

                  <span style={{
                    fontWeight:'bold',
                    fontSize:'1.3rem'
                  }}>
                    ฿{
                      remainAmount.toLocaleString()
                    }
                  </span>

                </div>

              )
            }

          </div>

          <p style={noteText}>

            {
              isPaid

              ? 'ใบเสร็จนี้ชำระสมบูรณ์แล้ว'

              : '* กรุณาแสดงหน้านี้ต่อพนักงานเมื่อไปถึงร้านอาหาร'
            }

          </p>

        </div>

      </div>

      <button
        onClick={() =>
          router.push('/history')
        }
        style={fullWidthBtn}
      >
        🔙 กลับไปหน้าประวัติการจอง
      </button>

    </div>

  )

}

const containerStyle = {

  maxWidth:'520px',
  margin:'40px auto',
  padding:'20px',
  fontFamily:'sans-serif'

}

const receiptCard = {

  background:'#fff',
  borderRadius:'30px',
  overflow:'hidden',
  boxShadow:'0 15px 50px rgba(0,0,0,0.1)'

}

const headerSection = {

  color:'#fff',
  padding:'40px 20px',
  textAlign:'center'

}

const infoDivider = {

  borderBottom:'2px dashed #eee',
  marginBottom:'25px',
  paddingBottom:'20px'

}

const detailText = {

  margin:'8px 0',
  color:'#555',
  fontSize:'15px'

}

const sectionTitle = {

  margin:'0 0 15px 0',
  color:'#999',
  fontSize:'12px',
  textTransform:'uppercase',
  letterSpacing:'1px'

}

const itemRow = {

  display:'flex',
  justifyContent:'space-between',
  marginBottom:'12px',
  fontSize:'15px'

}

const priceRow = {

  display:'flex',
  justifyContent:'space-between',
  marginBottom:'12px',
  fontSize:'16px'

}

const emptyText = {

  color:'#bbb',
  fontSize:'14px',
  fontStyle:'italic'

}

const noteText = {

  textAlign:'center',
  fontSize:'12px',
  color:'#999',
  marginTop:'25px'

}

const backToHistoryBtn = {

  marginTop:'20px',
  padding:'12px 20px',
  border:'none',
  borderRadius:'10px',
  cursor:'pointer'

}

const balanceBox = {

  display:'flex',
  justifyContent:'space-between',
  marginTop:'25px',
  padding:'18px',
  background:'#fff3e0',
  borderRadius:'15px',
  color:'#e65100',
  border:'1px solid #fed7aa'

}

const fullWidthBtn = {

  width:'100%',
  marginTop:'25px',
  padding:'18px',
  border:'none',
  borderRadius:'16px',
  background:'#222',
  color:'#fff',
  fontWeight:'bold',
  cursor:'pointer',
  fontSize:'15px'

}