'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense, useEffect } from 'react'

function CheckoutContent() {

  const searchParams = useSearchParams()
  const router = useRouter()

  const deposit = searchParams.get('deposit') || '0'
  const bookingId = searchParams.get('bookingId')

  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {

    const savedUser = JSON.parse(localStorage.getItem('user'))

    if (savedUser) {
      setUser(savedUser)
    }

    if (!bookingId || bookingId === '#') {
      alert('❌ ไม่พบข้อมูลการจอง')
      router.push('/history')
    }

  }, [bookingId, router])

  const handleConfirmPayment = async () => {

    setUploading(true)

    try {

      const res = await fetch('/api/bookings/upload-slip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId,
          userId: user?.id
        })
      })

      if (res.ok) {

        alert('✅ ระบบบันทึกการชำระเงินเรียบร้อย')

        router.push(`/history/receipt/${bookingId}`)

      } else {

        throw new Error('บันทึกข้อมูลไม่สำเร็จ')

      }

    } catch (error) {

      alert(error.message)

    } finally {

      setUploading(false)

    }

  }

  return (

    <div style={pageStyle}>

      <div style={containerStyle}>

        <div style={headerIcon}>💰</div>

        <h1 style={titleStyle}>
          ชำระเงินมัดจำ
        </h1>

        <p style={subtitleStyle}>
          กรุณาชำระเงินเพื่อยืนยันการจองโต๊ะ
        </p>

        {/* SUMMARY */}

        <div style={summaryCard}>

          <p style={summaryLabel}>
            ยอดมัดจำที่ต้องชำระ (50%)
          </p>

          <h1 style={priceStyle}>
            ฿{Number(deposit).toLocaleString()}
          </h1>

          <div style={lineStyle}></div>

          <div style={bookingBox}>

            <div style={infoRow}>
              <span>รหัสการจอง</span>
              <strong>#{bookingId}</strong>
            </div>

            <div style={infoRow}>
              <span>ผู้จอง</span>
              <strong>{user?.fullname}</strong>
            </div>

          </div>

        </div>

        {/* QR */}

        <div style={qrContainer}>

          <div style={qrBadge}>
            PromptPay QR
          </div>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=PromptPay_Deposit_${deposit}_Ref_${bookingId}`}
            alt="QR Code"
            style={qrImage}
          />

          <p style={qrText}>
            สแกน QR เพื่อชำระเงินมัดจำ
          </p>

          <div style={statusBox}>
            ⏳ รอการตรวจสอบจากทางร้าน
          </div>

        </div>

        {/* BUTTON */}

        <button
          onClick={handleConfirmPayment}
          disabled={uploading}
          style={{
            ...confirmBtnStyle,
            opacity: uploading ? 0.7 : 1
          }}
        >

          {
            uploading
              ? '⏳ กำลังบันทึกข้อมูล...'
              : '✅ ยืนยันการชำระเงินแล้ว'
          }

        </button>

        <button
          onClick={() => router.back()}
          style={cancelBtnStyle}
        >
          ยกเลิกรายการนี้
        </button>

      </div>

    </div>

  )

}

export default function CheckoutPage() {

  return (

    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>

  )

}

/* ================= STYLE ================= */

const pageStyle = {
  minHeight: '100vh',
  background: '#f4f6f9',
  padding: '30px 15px',
  fontFamily: "'Prompt', sans-serif"
}

const containerStyle = {
  maxWidth: '460px',
  margin: '0 auto',
  background: '#ffffff',
  borderRadius: '30px',
  padding: '35px',
  boxShadow: '0 15px 40px rgba(0,0,0,0.08)',
  textAlign: 'center'
}

const headerIcon = {
  fontSize: '50px',
  marginBottom: '10px'
}

const titleStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  color: '#111827',
  marginBottom: '8px'
}

const subtitleStyle = {
  color: '#6b7280',
  fontSize: '14px',
  marginBottom: '30px'
}

const summaryCard = {
  background: '#fffaf0',
  border: '1.5px solid #ffd166',
  borderRadius: '24px',
  padding: '28px',
  marginBottom: '25px'
}

const summaryLabel = {
  color: '#f97316',
  fontWeight: '700',
  fontSize: '15px',
  marginBottom: '10px'
}

const priceStyle = {
  fontSize: '3.2rem',
  fontWeight: '900',
  color: '#ff5a1f',
  margin: '0'
}

const lineStyle = {
  height: '1px',
  background: '#ffd166',
  margin: '20px 0'
}

const bookingBox = {
  textAlign: 'left',
  color: '#444',
  fontSize: '15px'
}

const infoRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px'
}

const qrContainer = {
  background: '#fafafa',
  border: '1px solid #eee',
  borderRadius: '24px',
  padding: '30px',
  marginBottom: '25px'
}

const qrBadge = {
  display: 'inline-block',
  background: '#111827',
  color: '#fff',
  padding: '6px 14px',
  borderRadius: '30px',
  fontSize: '12px',
  marginBottom: '18px'
}

const qrImage = {
  width: '220px',
  borderRadius: '18px',
  marginBottom: '15px'
}

const qrText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '18px'
}

const statusBox = {
  background: '#fff7ed',
  color: '#ea580c',
  padding: '12px',
  borderRadius: '14px',
  fontSize: '14px',
  fontWeight: '600'
}

const confirmBtnStyle = {
  width: '100%',
  padding: '18px',
  background: '#22c55e',
  color: '#fff',
  border: 'none',
  borderRadius: '18px',
  fontSize: '1rem',
  fontWeight: '700',
  cursor: 'pointer',
  transition: '0.3s',
  boxShadow: '0 10px 25px rgba(34,197,94,0.25)'
}

const cancelBtnStyle = {
  marginTop: '18px',
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  textDecoration: 'underline',
  cursor: 'pointer',
  fontSize: '14px'
}