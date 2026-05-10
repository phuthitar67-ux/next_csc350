'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

function MenuContent() {

  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const bookingId = searchParams.get('bookingId')

  const [menus, setMenus] = useState([])
  const [cart, setCart] = useState({})
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {

    fetch(`/api/shops/${id}/menu`)
      .then(res => res.json())
      .then(data => setMenus(data))
      .catch(err => console.error(err))

  }, [id])

  // ===============================
  // UPDATE CART
  // ===============================
  const updateCart = (menuId, delta) => {

    setCart(prev => {

      const currentQty = prev[menuId] || 0

      let newQty = currentQty + delta

      if (newQty > 10) {
        alert('เลือกได้สูงสุด 10 รายการ')
        newQty = 10
      }

      newQty = Math.max(0, newQty)

      return {
        ...prev,
        [menuId]: newQty
      }

    })

  }

  // ===============================
  // TOTAL
  // ===============================
  const totalPrice = menus.reduce((sum, menu) => {
    return sum + (menu.price * (cart[menu.id] || 0))
  }, 0)

  const depositPrice = totalPrice * 0.5

  // ===============================
  // CONFIRM ORDER
  // ===============================
  const handleConfirmOrder = () => {

    if (totalPrice === 0) {
      alert('กรุณาเลือกอาหารอย่างน้อย 1 รายการ')
      return
    }

    setShowSummary(true)

  }

  // ===============================
  // SAVE ORDER
  // ===============================
  const saveOrder = async () => {

    try {

      const itemsToSave = Object.keys(cart)
        .filter(menuId => cart[menuId] > 0)
        .map(menuId => {

          const menuInfo = menus.find(
            m => m.id === parseInt(menuId)
          )

          return {
            menu_id: menuId,
            quantity: cart[menuId],
            price_at_booking: menuInfo.price
          }

        })

      const res = await fetch('/api/bookings/update-amount', {

        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          booking_id: bookingId,
          total_amount: totalPrice,
          deposit_amount: depositPrice,
          items: itemsToSave
        })

      })

      if (res.ok) {

        router.push(
          `/checkout?deposit=${depositPrice}&shopId=${id}&bookingId=${bookingId}`
        )

      } else {

        alert('ไม่สามารถบันทึกข้อมูลได้')

      }

    } catch (error) {

      console.log(error)
      alert('เกิดข้อผิดพลาด')

    }

  }

  return (

    <div
      style={{
        maxWidth: '920px',
        margin: 'auto',
        padding: '30px',
        fontFamily: 'sans-serif',
        minHeight: '100vh',
        background: '#fafafa'
      }}
    >

      {/* BACK BUTTON */}
      <button
        onClick={() => router.back()}
        style={{
          marginBottom: '20px',
          padding: '10px 18px',
          border: 'none',
          background: '#f1f5f9',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        ⬅️ ย้อนกลับ
      </button>

      {/* TITLE */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '35px'
        }}
      >

        <h1
          style={{
            fontSize: '2.5rem',
            marginBottom: '10px',
            color: '#222'
          }}
        >
          📋 เมนูอาหารสั่งล่วงหน้า
        </h1>

        <p
          style={{
            color: '#666',
            fontSize: '1rem'
          }}
        >
          *เงื่อนไข: ชำระมัดจำ 50% เพื่อยืนยันการจองโต๊ะ
        </p>

      </div>

      {/* MENU LIST */}
      <div
        style={{
          display: 'grid',
          gap: '18px',
          marginBottom: '140px'
        }}
      >

        {menus.length > 0 ? (

          menus.map(menu => {

            const qty = cart[menu.id] || 0
            const subtotal = menu.price * qty

            return (

              <div
                key={menu.id}
                style={{
                  display: 'flex',
                  background: '#fff',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  border: '1px solid #f1f1f1'
                }}
              >

                {/* IMAGE */}
                <img
                  src={menu.image_url || 'https://via.placeholder.com/150'}
                  alt={menu.name}
                  style={{
                    width: '140px',
                    height: '140px',
                    objectFit: 'cover'
                  }}
                />

                {/* CONTENT */}
                <div
                  style={{
                    flex: 1,
                    padding: '18px 22px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >

                  <div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: '1.7rem',
                        fontWeight: '700',
                        color: '#222'
                      }}
                    >
                      {menu.name}
                    </h2>

                    <p
                      style={{
                        marginTop: '8px',
                        color: '#ff6b35',
                        fontSize: '1.2rem',
                        fontWeight: '600'
                      }}
                    >
                      ฿{Number(menu.price).toLocaleString()}
                    </p>

                    {qty > 0 && (
                      <p
                        style={{
                          marginTop: '10px',
                          color: '#666',
                          fontSize: '0.95rem'
                        }}
                      >
                        ฿{menu.price.toLocaleString()} × {qty}
                        {' = '}
                        <b>
                          ฿{subtotal.toLocaleString()}
                        </b>
                      </p>
                    )}

                  </div>

                  {/* QTY */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px'
                    }}
                  >

                    <button
                      onClick={() => updateCart(menu.id, -1)}
                      style={qtyBtn}
                    >
                      -
                    </button>

                    <span
                      style={{
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        minWidth: '25px',
                        textAlign: 'center'
                      }}
                    >
                      {qty}
                    </span>

                    <button
                      onClick={() => updateCart(menu.id, 1)}
                      style={qtyBtn}
                    >
                      +
                    </button>

                  </div>

                </div>

              </div>

            )

          })

        ) : (

          <p style={{ textAlign: 'center' }}>
            กำลังโหลดเมนู...
          </p>

        )}

      </div>

      {/* FOOTER */}
      <div style={footerStyle}>

        <div>

          <p
            style={{
              margin: 0,
              opacity: 0.9,
              fontSize: '0.95rem'
            }}
          >
            ยอดรวมทั้งหมด
          </p>

          <h2
            style={{
              margin: '5px 0',
              fontSize: '2rem'
            }}
          >
            ฿{totalPrice.toLocaleString()}
          </h2>

          <p
            style={{
              margin: 0,
              color: '#ffe0d5',
              fontSize: '0.95rem'
            }}
          >
            มัดจำที่ต้องชำระตอนนี้ 50%
          </p>

          <h3
            style={{
              margin: '6px 0 0',
              fontSize: '1.5rem'
            }}
          >
            ฿{depositPrice.toLocaleString()}
          </h3>

        </div>

        <button
          onClick={handleConfirmOrder}
          style={confirmBtnStyle}
        >
          ไปที่หน้าชำระเงิน ➜
        </button>

      </div>

      {/* MODAL SUMMARY */}
      {showSummary && (

        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >

          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#fff',
              borderRadius: '28px',
              padding: '34px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.15)'
            }}
          >

            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: '#fff7ed',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '32px',
                margin: '0 auto 20px'
              }}
            >
              📋
            </div>

            <h2
              style={{
                textAlign: 'center',
                marginBottom: '25px',
                fontSize: '2rem',
                color: '#111'
              }}
            >
              สรุปรายการสั่งซื้อ
            </h2>

            <div
              style={{
                background: '#f9fafb',
                borderRadius: '18px',
                padding: '22px',
                marginBottom: '25px'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}
              >
                <span style={{ color: '#666' }}>
                  จำนวนเมนู
                </span>

                <strong>
                  {Object.keys(cart).filter(id => cart[id] > 0).length} รายการ
                </strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}
              >
                <span style={{ color: '#666' }}>
                  ยอดรวมทั้งหมด
                </span>

                <strong>
                  ฿{totalPrice.toLocaleString()}
                </strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  color: '#ff5722'
                }}
              >
                <span>
                  มัดจำ 50%
                </span>

                <span>
                  ฿{depositPrice.toLocaleString()}
                </span>
              </div>

            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px'
              }}
            >

              <button
                onClick={() => setShowSummary(false)}
                style={{
                  flex: 1,
                  padding: '15px',
                  borderRadius: '14px',
                  border: '1px solid #ddd',
                  background: '#fff',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ยกเลิก
              </button>

              <button
                onClick={saveOrder}
                style={{
                  flex: 1,
                  padding: '15px',
                  borderRadius: '14px',
                  border: 'none',
                  background: '#ff5722',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: '700',
                  boxShadow: '0 8px 20px rgba(255,87,34,0.25)'
                }}
              >
                ยืนยันชำระเงิน
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}

export default function MenuPage() {

  return (
    <Suspense fallback={<div>กำลังโหลด...</div>}>
      <MenuContent />
    </Suspense>
  )

}

// ===============================
// STYLES
// ===============================

const qtyBtn = {

  width: '42px',
  height: '42px',
  borderRadius: '50%',
  border: '1px solid #eee',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '1.3rem',
  fontWeight: '700',
  transition: '0.3s',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'

}

const footerStyle = {

  position: 'fixed',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '90%',
  maxWidth: '860px',
  padding: '22px 30px',
  borderRadius: '24px',
  background: 'rgba(255,87,34,0.96)',
  backdropFilter: 'blur(12px)',
  color: '#fff',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 12px 40px rgba(255,87,34,0.35)',
  zIndex: 1000

}

const confirmBtnStyle = {

  padding: '18px 34px',
  background: '#fff',
  border: 'none',
  borderRadius: '16px',
  color: '#ff5722',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: '0.3s',
  boxShadow: '0 6px 20px rgba(0,0,0,0.12)'

}