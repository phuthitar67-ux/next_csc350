'use client'
import { useState, useEffect } from 'react'

export default function ManageShops() {

  const [shops, setShops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [selectedShop, setSelectedShop] = useState(null);

  const [menus, setMenus] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    cover_image: '',
    category_id: '',
    total_tables: 10,
    rating: 0
  });

  const [menuFormData, setMenuFormData] = useState({
    name: '',
    price: '',
    image_url: ''
  });

  const [editingMenuId, setEditingMenuId] = useState(null);

  // โหลดร้าน
  const refreshData = async () => {

    try {

      const res = await fetch('/api/admin/shops');

      if (res.ok) {

        const data = await res.json();

        setShops(data);
      }

    } catch (err) {

      console.error(err);

    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // เปิดแก้ไขร้าน
  const handleEdit = (shop) => {

    setIsEditing(true);

    setCurrentId(shop.id);

    setFormData({
      name: shop.name || '',
      description: shop.description || '',
      address: shop.address || '',
      phone: shop.phone || '',
      cover_image: shop.cover_image || '',
      category_id: shop.category_id || '',
      total_tables: shop.total_tables || 10,
      rating: shop.rating || 0
    });

    setShowModal(true);
  };

  // บันทึกร้าน
  const handleSubmit = async (e) => {

    e.preventDefault();

    const url = isEditing
      ? `/api/admin/shops/${currentId}`
      : '/api/admin/shops';

    const method = isEditing
      ? 'PUT'
      : 'POST';

    try {

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {

        alert(
          isEditing
            ? '✅ แก้ไขร้านสำเร็จ'
            : '✅ เพิ่มร้านสำเร็จ'
        );

        closeModal();

        refreshData();
      }

    } catch (err) {

      alert('❌ เกิดข้อผิดพลาด');

    }
  };

  // ลบร้าน
  const deleteShop = async (id) => {

    if (!confirm('⚠️ ยืนยันการลบร้าน?'))
      return;

    try {

      const res = await fetch(
        `/api/admin/shops/${id}`,
        {
          method: 'DELETE'
        }
      );

      if (res.ok) {

        alert('🗑️ ลบร้านสำเร็จ');

        refreshData();
      }

    } catch (err) {

      alert('❌ ลบไม่สำเร็จ');

    }
  };

  // ปิด modal ร้าน
  const closeModal = () => {

    setShowModal(false);

    setIsEditing(false);

    setCurrentId(null);

    setFormData({
      name: '',
      description: '',
      address: '',
      phone: '',
      cover_image: '',
      category_id: '',
      total_tables: 10,
      rating: 0
    });
  };

  // เปิดเมนู
  const openMenuModal = async (shop) => {

    setSelectedShop(shop);

    setShowMenuModal(true);

    setEditingMenuId(null);

    setMenuFormData({
      name: '',
      price: '',
      image_url: ''
    });

    fetchMenus(shop.id);
  };

  // โหลดเมนู
  const fetchMenus = async (shopId) => {

    try {

      const res = await fetch(
        `/api/admin/menus?shop_id=${shopId}`
      );

      if (res.ok) {

        const data = await res.json();

        setMenus(data);
      }

    } catch (err) {

      console.error(err);

    }
  };

  // เพิ่ม/แก้เมนู
  const handleMenuSubmit = async (e) => {

    e.preventDefault();

    const url = editingMenuId
      ? `/api/admin/menus/${editingMenuId}`
      : '/api/admin/menus';

    const method = editingMenuId
      ? 'PUT'
      : 'POST';

    try {

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...menuFormData,
          shop_id: selectedShop.id
        })
      });

      if (res.ok) {

        alert('✅ บันทึกเมนูสำเร็จ');

        setMenuFormData({
          name: '',
          price: '',
          image_url: ''
        });

        setEditingMenuId(null);

        fetchMenus(selectedShop.id);
      }

    } catch (err) {

      alert('❌ เกิดข้อผิดพลาด');

    }
  };

  // ลบเมนู
  const deleteMenu = async (id) => {

    if (!confirm('⚠️ ยืนยันการลบเมนู?'))
      return;

    try {

      const res = await fetch(
        `/api/admin/menus/${id}`,
        {
          method: 'DELETE'
        }
      );

      if (res.ok) {

        alert('🗑️ ลบเมนูสำเร็จ');

        fetchMenus(selectedShop.id);
      }

    } catch (err) {

      alert('❌ ลบไม่สำเร็จ');

    }
  };

  return (

    <div style={{
      padding: '30px',
      background: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'sans-serif'
    }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>

        <h1>🏪 จัดการร้านค้า</h1>

        <button
          onClick={() => {
            setIsEditing(false);
            setShowModal(true);
          }}
          style={btnPrimary}
        >
          + เพิ่มร้าน
        </button>

      </div>

      {/* ตารางร้าน */}
      <div style={tableContainer}>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>

          <thead>

            <tr style={{
              background: '#1a202c',
              color: '#fff'
            }}>

              <th style={p15}>ร้าน</th>
              <th style={p15}>เมนู</th>
              <th style={p15}>จัดการ</th>

            </tr>

          </thead>

          <tbody>

            {shops.map(shop => (

              <tr
                key={shop.id}
                style={{
                  borderBottom: '1px solid #eee'
                }}
              >

                <td style={p15}>

                  <div style={{
                    display: 'flex',
                    gap: '22px',
                    alignItems: 'center'
                  }}>

                    <img
                      src={
                        shop.cover_image ||
                        'https://via.placeholder.com/120'
                      }
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '22px',
                        objectFit: 'cover',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        border: '4px solid #fff'
                      }}

                    />

                    <div>

                      <div style={{
                        fontWeight: '800',
                        fontSize: '24px',
                        marginBottom: '8px',
                        color: '#0f172a'
                      }}>
                        {shop.name}
                      </div>

                      <div style={{
                        fontSize: '16px',
                        color: '#64748b',
                        marginTop: '4px'
                      }}>
                        📍 {shop.address}
                      </div>

                    </div>

                  </div>

                </td>

                <td style={p15}>

                  <button
                    onClick={() => openMenuModal(shop)}
                    style={btnEdit}
                  >
                    🍔 ดูเมนู
                  </button>

                </td>

                <td style={p15}>

                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>

                    <button
                      onClick={() => handleEdit(shop)}
                      style={btnEdit}
                    >
                      แก้ไข
                    </button>

                    <button
                      onClick={() => deleteShop(shop.id)}
                      style={btnDelete}
                    >
                      ลบ
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Modal ร้าน */}
      {showModal && (

        <div style={modalOverlay}>

          <div style={{
            ...modalContent,
            width: '600px'
          }}>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>

              <h2>
                {isEditing
                  ? '✏️ แก้ไขร้าน'
                  : '🏪 เพิ่มร้าน'}
              </h2>

              <button
                onClick={closeModal}
                style={closeBtn}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >

              <input
                value={formData.name}
                placeholder="ชื่อร้าน"
                onChange={e =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                }
                style={inputStyle}
                required
              />

              <textarea
                value={formData.description}
                placeholder="รายละเอียดร้าน"
                onChange={e =>
                  setFormData({
                    ...formData,
                    description: e.target.value
                  })
                }
                style={{
                  ...inputStyle,
                  minHeight: '100px'
                }}
              />

              <input
                value={formData.address}
                placeholder="ที่อยู่"
                onChange={e =>
                  setFormData({
                    ...formData,
                    address: e.target.value
                  })
                }
                style={inputStyle}
              />

              <input
                value={formData.phone}
                placeholder="เบอร์โทร"
                onChange={e =>
                  setFormData({
                    ...formData,
                    phone: e.target.value
                  })
                }
                style={inputStyle}
              />

              <input
                value={formData.cover_image}
                placeholder="/images/menu/shop.jpg"
                onChange={e =>
                  setFormData({
                    ...formData,
                    cover_image: e.target.value
                  })
                }
                style={inputStyle}
              />

              {formData.cover_image && (

                <img
                  src={formData.cover_image}
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                />

              )}

              <button
                type="submit"
                style={btnSuccess}
              >
                {isEditing
                  ? '💾 บันทึกการแก้ไข'
                  : '🚀 เพิ่มร้าน'}
              </button>

            </form>

          </div>

        </div>

      )}

      {/* Modal เมนู */}
      {showMenuModal && (

        <div style={modalOverlay}>

          <div style={{
            ...modalContent,
            width: '900px'
          }}>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>

              <h2>
                🍴 เมนูร้าน: {selectedShop?.name}
              </h2>

              <button
                onClick={() => setShowMenuModal(false)}
                style={closeBtn}
              >
                ×
              </button>

            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '20px'
            }}>

              {/* รายการเมนู */}
              <div style={{
                maxHeight: '500px',
                overflowY: 'auto',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '10px'
              }}>

                {menus.map(menu => (

                  <div
                    key={menu.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px',
                      borderBottom: '1px solid #eee',
                      alignItems: 'center'
                    }}
                  >

                    <img
                      src={
                        menu.image_url ||
                        'https://via.placeholder.com/60'
                      }
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '10px',
                        objectFit: 'cover'
                      }}
                    />

                    <div style={{ flex: 1 }}>

                      <div style={{
                        fontWeight: 'bold'
                      }}>
                        {menu.name}
                      </div>

                      <div style={{
                        color: '#38a169',
                        fontWeight: 'bold'
                      }}>
                        ฿{menu.price}
                      </div>

                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '5px'
                    }}>

                      <button
                        onClick={() => {

                          setEditingMenuId(menu.id);

                          setMenuFormData({
                            name: menu.name,
                            price: menu.price,
                            image_url: menu.image_url
                          });

                        }}
                        style={btnEdit}
                      >
                        แก้
                      </button>

                      <button
                        onClick={() => deleteMenu(menu.id)}
                        style={btnDelete}
                      >
                        ลบ
                      </button>

                    </div>

                  </div>

                ))}

              </div>

              {/* ฟอร์มเมนู */}
              <div style={{
                background: '#f7fafc',
                padding: '20px',
                borderRadius: '12px'
              }}>

                <h3>
                  {editingMenuId
                    ? '📝 แก้ไขเมนู'
                    : '🚀 เพิ่มเมนู'}
                </h3>

                <form
                  onSubmit={handleMenuSubmit}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >

                  <input
                    value={menuFormData.name}
                    placeholder="ชื่ออาหาร"
                    onChange={e =>
                      setMenuFormData({
                        ...menuFormData,
                        name: e.target.value
                      })
                    }
                    style={inputStyle}
                    required
                  />

                  <input
                    value={menuFormData.price}
                    placeholder="ราคา"
                    type="number"
                    onChange={e =>
                      setMenuFormData({
                        ...menuFormData,
                        price: e.target.value
                      })
                    }
                    style={inputStyle}
                    required
                  />

                  <input
                    value={menuFormData.image_url}
                    placeholder="/images/menu/shrimp.jpg"
                    onChange={e =>
                      setMenuFormData({
                        ...menuFormData,
                        image_url: e.target.value
                      })
                    }
                    style={inputStyle}
                  />

                  {menuFormData.image_url && (

                    <img
                      src={menuFormData.image_url}
                      style={{
                        width: '100%',
                        maxHeight: '180px',
                        objectFit: 'cover',
                        borderRadius: '12px'
                      }}
                    />

                  )}

                  <button
                    type="submit"
                    style={btnSuccess}
                  >
                    {editingMenuId
                      ? '💾 อัปเดตเมนู'
                      : '🚀 เพิ่มเมนู'}
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// styles
const p15 = {
  padding: '20px 24px',
  fontSize: '15px'
};

const tableContainer = {
  background: '#ffffff',
  borderRadius: '24px',
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  border: '1px solid #edf2f7'
};

const btnPrimary = {
  background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
  color: '#fff',
  border: 'none',
  padding: '14px 22px',
  borderRadius: '14px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '15px',
  boxShadow: '0 8px 20px rgba(37,99,235,0.25)',
  transition: '0.3s'
};

const btnSuccess = {
  background: '#111827',
  color: '#fff',
  border: 'none',
  padding: '14px',
  borderRadius: '14px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '15px',
  transition: '0.3s'
};

const btnEdit = {
  background: '#facc15',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '14px',
  transition: '0.3s',
  boxShadow: '0 4px 12px rgba(250,204,21,0.25)'
};

const btnDelete = {
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '14px',
  transition: '0.3s',
  boxShadow: '0 4px 12px rgba(239,68,68,0.25)'
};

const closeBtn = {
  background: '#f1f5f9',
  border: 'none',
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  fontSize: '22px',
  cursor: 'pointer',
  color: '#334155',
  transition: '0.3s'
};

const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(15,23,42,0.65)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalContent = {
  background: '#fff',
  padding: '32px',
  borderRadius: '28px',
  boxShadow: '0 25px 50px rgba(0,0,0,0.18)'
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '14px',
  border: '1px solid #dbe2ea',
  boxSizing: 'border-box',
  fontSize: '15px',
  outline: 'none',
  transition: '0.3s',
  background: '#fff'
};