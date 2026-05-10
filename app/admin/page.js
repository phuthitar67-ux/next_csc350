'use client'
import { useState, useEffect } from 'react'

export default function AdminPage() {

  // =========================
  // STATE
  // =========================
  const [bookings, setBookings] = useState([])

 const [stats, setStats] = useState({
  totalBookings: 0,
  totalRevenue: 0,
  totalPaid: 0,
  totalGuests: 0,
  totalShops: 0
})

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [selectedBooking, setSelectedBooking] = useState(null)

  // =========================
  // โหลดข้อมูล
  // =========================
const refreshData = async () => {

  try {

    const res = await fetch(
      `/api/admin/bookings?t=${Date.now()}`
    )

    const data = await res.json()

    const bookingData = Array.isArray(data)
      ? data
      : []

    setBookings(bookingData)

    // =========================
    // ยอดมัดจำ
    // confirmed เท่านั้น
    // =========================
    const depositRevenue = bookingData
      .filter(item =>
        item.booking_status === 'confirmed'
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.deposit_amount || 0),
        0
      )

    // =========================
    // ยอดชำระครบ
    // completed เท่านั้น
    // =========================
    const paidRevenue = bookingData
      .filter(item =>
        item.booking_status === 'completed'
      )
      .reduce(
        (sum, item) =>
          sum + Number(item.total_amount || 0),
        0
      )

    // =========================
    // จำนวนลูกค้า
    // =========================
    const guests = new Set(
      bookingData.map(
        item => item.customer_phone
      )
    ).size

    // =========================
    // จำนวนร้าน
    // =========================
    const uniqueShops = new Set(
      bookingData
        .map(item => item.shop_name)
        .filter(Boolean)
    ).size

    setStats({

      totalBookings: bookingData.length,

      // ยอดมัดจำ
      totalRevenue: depositRevenue,

      // ยอดชำระครบ
      totalPaid: paidRevenue,

      totalGuests: guests,

      totalShops: uniqueShops

    })

  } catch (err) {

    console.error(err)

  }

}

  // =========================
  // โหลดครั้งแรก
  // =========================
  useEffect(() => {
    refreshData()
  }, [])

  // =========================
  // DASHBOARD EXTRA
  // =========================
  const pendingCount =
    bookings.filter(
      item => item.booking_status === 'pending'
    ).length

  const confirmedCount =
    bookings.filter(
      item => item.booking_status === 'confirmed'
    ).length

  const completedCount =
    bookings.filter(
      item => item.booking_status === 'completed'
    ).length

  const today = new Date().toDateString()

  const todayRevenue = bookings
    .filter(item =>
      item.booking_status === 'completed' &&
      new Date(item.booking_date)
        .toDateString() === today
    )
    .reduce(
      (sum, item) =>
        sum + Number(item.total_amount || 0),
      0
    )

  // =========================
  // FILTER
  // =========================
  const filteredBookings = bookings.filter(item => {

    const matchesSearch =
      item.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customer_phone?.includes(searchTerm) ||
      item.shop_name?.toLowerCase().includes(searchTerm.toLowerCase())

    const isItemConfirmed =
      item.booking_status === 'confirmed'

    const isItemRejected =
      item.booking_status === 'rejected'

    const isItemPaid =
      item.booking_status === 'completed'

    const isItemPending =
      !isItemConfirmed &&
      !isItemRejected &&
      !isItemPaid

    let matchesStatus = false

    if (statusFilter === 'all')
      matchesStatus = true

    else if (statusFilter === 'pending')
      matchesStatus = isItemPending

    else if (statusFilter === 'confirmed')
      matchesStatus = isItemConfirmed

    else if (statusFilter === 'rejected')
      matchesStatus = isItemRejected

    else if (statusFilter === 'paid')
      matchesStatus = isItemPaid

    return matchesSearch && matchesStatus
  })

  // =========================
  // อนุมัติ / ปฏิเสธ
  // =========================
  const updateStatus = async (id, status) => {

    let reason = ''

    if (status === 'rejected') {

      reason = prompt('ระบุเหตุผลการปฏิเสธ:')

      if (reason === null) return

      if (reason.trim() === '')
        return alert('กรุณาระบุเหตุผล')

    } else {

      if (!confirm('ยืนยันการอนุมัติใช่ไหม?'))
        return

    }

    try {

      const res = await fetch(
        '/api/admin/bookings/update-status',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id,
            status,
            reason
          })
        }
      )

      if (res.ok) {

        alert('ดำเนินการสำเร็จ')

        refreshData()
      }

    } catch (error) {

      alert('เกิดข้อผิดพลาด')

    }
  }

  // =========================
  // ยืนยันชำระเงิน
  // =========================
  const confirmPayment = async (id) => {

    if (!confirm('ยืนยันว่าชำระเงินแล้ว?'))
      return

    try {

      const res = await fetch(
        '/api/admin/bookings/update-status',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id,
            status: 'completed'
          })
        }
      )

      if (res.ok) {

        alert('ชำระเงินสำเร็จ')

        refreshData()
      }

    } catch (error) {

      alert('เกิดข้อผิดพลาด')

    }
  }

  return (

    <div style={{
      padding: '40px',
      background: '#f1f5f9',
      minHeight: '100vh',
      fontFamily: 'sans-serif'
    }}>

      {/* HEADER */}
      <div style={{
        marginBottom: '30px',
        borderLeft: '5px solid #2563eb',
        paddingLeft: '20px'
      }}>

        <h1 style={{
          fontSize: '32px',
          margin: 0,
          fontWeight: '800'
        }}>
          📊 ระบบจัดการข้อมูลการจอง
        </h1>

        <p style={{
          color: '#64748b'
        }}>
          จัดการยอดมัดจำและสถานะการจอง
        </p>

      </div>

      {/* DASHBOARD */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>

        <div style={cardStyle}>
          <div style={cardTitle}>
            รายการจองทั้งหมด
          </div>

          <div style={cardValue}>
            {stats.totalBookings}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>
            ลูกค้า
          </div>

          <div style={cardValue}>
            {stats.totalGuests}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>
            ร้านค้า
          </div>

          <div style={cardValue}>
            {stats.totalShops}
          </div>
        </div>

        <div style={cardStyle}>
  <div style={cardTitle}>
    ยอดมัดจำ
  </div>

  <div style={{
    ...cardValue,
    color: '#f59e0b'
  }}>
    ฿{stats.totalRevenue.toLocaleString()}
  </div>

  <div style={{
    fontSize: '13px',
    color: '#64748b',
    marginTop: '6px'
  }}>
    อนุมัติแล้วแต่ยังไม่จ่ายครบ
  </div>
</div>

<div style={cardStyle}>
  <div style={cardTitle}>
    ยอดชำระแล้ว
  </div>

  <div style={{
    ...cardValue,
    color: '#16a34a'
  }}>
    ฿{stats.totalPaid.toLocaleString()}
  </div>

  <div style={{
    fontSize: '13px',
    color: '#64748b',
    marginTop: '6px'
  }}>
    ชำระครบเรียบร้อยแล้ว
  </div>
</div>

        <div style={cardStyle}>
          <div style={cardTitle}>
            รออนุมัติ
          </div>

          <div style={{
            ...cardValue,
            color: '#f59e0b'
          }}>
            {pendingCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>
            อนุมัติแล้ว
          </div>

          <div style={{
            ...cardValue,
            color: '#2563eb'
          }}>
            {confirmedCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>
            สำเร็จแล้ว
          </div>

          <div style={{
            ...cardValue,
            color: '#16a34a'
          }}>
            {completedCount}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>
            รายได้วันนี้
          </div>

          <div style={{
            ...cardValue,
            color: '#16a34a'
          }}>
            ฿{todayRevenue.toLocaleString()}
          </div>
        </div>

      </div>

      {/* FILTER */}
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>

        <input
          type="text"
          placeholder="ค้นหาลูกค้า เบอร์ หรือร้าน"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={inputStyle}
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          style={selectStyle}
        >

          <option value="all">
            สถานะทั้งหมด
          </option>

          <option value="pending">
            รอการจัดการ
          </option>

          <option value="confirmed">
            อนุมัติแล้ว
          </option>

          <option value="paid">
            ชำระเงินสำเร็จ
          </option>

          <option value="rejected">
            ปฏิเสธแล้ว
          </option>

        </select>

      </div>

      {/* TABLE */}
      <div style={tableContainer}>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>

          <thead>

            <tr style={{
              background: '#1e293b',
              color: '#fff'
            }}>

              <th style={thStyle}>ร้าน</th>
              <th style={thStyle}>ลูกค้า</th>
              <th style={thStyle}>มัดจำ</th>
              <th style={thStyle}>สถานะ</th>
              <th style={thStyle}>จัดการ</th>

            </tr>

          </thead>

          <tbody>

            {filteredBookings.map(item => {

              const isConfirmed =
                item.booking_status === 'confirmed'

              const isRejected =
                item.booking_status === 'rejected'

              const isPaid =
                item.booking_status === 'completed'

              return (

                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #eee',
                    transition: '0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f8fafc'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#fff'
                  }}
                >

                  {/* ร้าน */}
                  <td style={p15}>

                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      alignItems: 'center'
                    }}>


                      <img
                        src={
                          item.shop_image || '/no-image.png'
                        }

                        alt="shop"
                        style={{
                         width: '70px',
height: '70px',
                          borderRadius: '14px',
                          objectFit: 'cover',
                          border: '2px solid #eee'
                        }}
                      />

                      <div>

                        <div style={{
                          fontWeight: '700',
                          fontSize: '18px'
                        }}>
                          🏪 {item.shop_name}
                        </div>

                        <div style={{
                          fontSize: '12px',
                          color: '#f59e0b',
                          marginTop: '5px'
                        }}>
                          ⭐ {item.avg_rating || 5}/5
                        </div>

                        <div style={{
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          📅 {
                            new Date(
                              item.booking_date
                            ).toLocaleDateString('th-TH')
                          }
                        </div>

                        <div style={{
                          fontSize: '12px',
                          color: '#64748b'
                        }}>
                          ⏰ {
                            item.booking_time?.slice(0, 5)
                          } น.
                        </div>

                      </div>

                    </div>

                  </td>

                  {/* ลูกค้า */}
                  <td style={p15}>

                    <div style={{
                      fontWeight: '600'
                    }}>
                      👤 {item.customer_name}
                    </div>

                    <div style={{
                      color: '#2563eb'
                    }}>
                      📞 {item.customer_phone}
                    </div>

                  </td>

                  {/* เงิน */}
                  <td style={p15}>

                    <div style={{
                      fontWeight: '800',
                      fontSize: '18px'
                    }}>
                      ฿{Number(
                        item.deposit_amount
                      ).toLocaleString()}
                    </div>

                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color:
                          item.booking_status === 'completed'
                            ? '#16a34a'
                            : '#ef4444'
                      }}
                    >
                      {
                        item.booking_status === 'completed'
                          ? 'ชำระเงินครบเรียบร้อยแล้ว'
                          : 'ยังไม่จ่ายเงินยอดเต็ม'
                      }
                    </div>

                  </td>

                  {/* STATUS */}
                  <td style={p15}>

                    {isPaid ? (

                      <span style={paidBadge}>
                        ✅ ชำระเงินสำเร็จ
                      </span>

                    ) : isConfirmed ? (

                      <span style={okBadge}>
                        อนุมัติแล้ว
                      </span>

                    ) : isRejected ? (

                      <span style={noBadge}>
                        ปฏิเสธแล้ว
                      </span>

                    ) : (

                      <span style={waitBadge}>
                        รอการจัดการ
                      </span>

                    )}

                  </td>

                  {/* ACTION */}
                  <td style={p15}>

                    {!isConfirmed &&
                      !isRejected &&
                      !isPaid && (

                        <div style={{
                          display: 'flex',
                          gap: '10px'
                        }}>

                          <button
                            onClick={() =>
                              updateStatus(
                                item.id,
                                'confirmed'
                              )
                            }
                            style={btnOk}
                          >
                            อนุมัติ
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(
                                item.id,
                                'rejected'
                              )
                            }
                            style={btnNo}
                          >
                            ปฏิเสธ
                          </button>

                        </div>

                      )}

                    {isConfirmed &&
                      !isPaid && (

                        <button
                          onClick={() =>
                            confirmPayment(item.id)
                          }
                          style={btnPayment}
                        >
                          💰 ยืนยันชำระเงิน
                        </button>

                      )}

                    {isPaid && (

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}>

                        <button
                          onClick={() =>
                            window.location.href =
                            `/admin/reviews?shop_id=${item.shop_id}`
                          }
                          style={{
                            background: '#f59e0b',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          ⭐ ดูรีวิว
                        </button>

                        <button
                          onClick={() =>
                            setSelectedBooking(item)
                          }
                          style={{
                            background: '#0f172a',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          👁 ดูรายละเอียด
                        </button>

                      </div>

                    )}

                  </td>

                </tr>

              )
            })}

          </tbody>

        </table>

      </div>

      {/* POPUP */}
      {
        selectedBooking && (

          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999
          }}>

            <div style={{
              background: '#fff',
              padding: '30px',
              borderRadius: '20px',
              width: '500px',
              maxWidth: '95%'
            }}>

              <h2>
                📋 รายละเอียดการจอง
              </h2>

              <p>
                👤 {selectedBooking.customer_name}
              </p>

              <p>
                📞 {selectedBooking.customer_phone}
              </p>

              <p>
                🏪 {selectedBooking.shop_name}
              </p>

              <p>
                📅 {
                  new Date(
                    selectedBooking.booking_date
                  ).toLocaleDateString('th-TH')
                }
              </p>

              <p>
                ⏰ {
                  selectedBooking.booking_time?.slice(0, 5)
                } น.
              </p>

              <p>
                🍽️ {selectedBooking.guest_count} คน
              </p>

              <p>
                💰 ฿{selectedBooking.total_amount}
              </p>

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                style={{
                  marginTop: '20px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 15px',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                ปิด
              </button>

            </div>

          </div>

        )
      }

    </div>
  )
}

// =========================
// STYLES
// =========================
const p15 = {
  padding: '10px'
}

const thStyle = {
  padding: '10px',
  textAlign: 'left'
}

const tableContainer = {
  background: '#fff',
  borderRadius: '16px',
  overflow: 'hidden'
}

const cardStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '16px'
}

const cardTitle = {
  color: '#64748b',
  marginBottom: '10px'
}

const cardValue = {
  fontSize: '28px',
  fontWeight: '800'
}

const inputStyle = {
  flex: 1,
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '10px'
}

const selectStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '10px'
}

const okBadge = {
  background: '#dbeafe',
  color: '#1d4ed8',
  padding: '6px 10px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 'bold'
}

const noBadge = {
  background: '#fee2e2',
  color: '#b91c1c',
  padding: '6px 10px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 'bold'
}

const waitBadge = {
  background: '#fef3c7',
  color: '#b45309',
  padding: '6px 10px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 'bold'
}

const paidBadge = {
  background: '#dcfce7',
  color: '#15803d',
  padding: '6px 10px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: 'bold'
}

const btnOk = {
  background: '#059669',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer'
}

const btnNo = {
  background: '#dc2626',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer'
}

const btnPayment = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '8px',
  cursor: 'pointer'
}