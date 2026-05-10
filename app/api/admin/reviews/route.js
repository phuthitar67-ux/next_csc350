import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req) {

  try {

    const { searchParams } = new URL(req.url)

    const shop_id = searchParams.get('shop_id')

    if (!shop_id) {

      return NextResponse.json([])

    }

    const [rows] = await db.execute(`

      SELECT
        reviews.*,

        shops.name AS shop_name,

        bookings.customer_name,
        bookings.customer_phone,
        bookings.booking_date,
        bookings.booking_time,
        bookings.guest_count,
        bookings.total_amount,
        bookings.payment_status

      FROM reviews

      LEFT JOIN shops
      ON reviews.shop_id = shops.id

      LEFT JOIN bookings
      ON reviews.booking_id = bookings.id

      WHERE reviews.shop_id = ?

      ORDER BY reviews.id DESC

    `, [shop_id])

    return NextResponse.json(rows)

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      { error:error.message },
      { status:500 }
    )

  }

}