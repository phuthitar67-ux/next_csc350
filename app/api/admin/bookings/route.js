// app/api/admin/bookings/route.js

import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {

  try {

    const query = `
      SELECT 
        b.*,

        s.name AS shop_name,
        s.cover_image AS shop_image,
        s.rating

      FROM bookings b

      LEFT JOIN shops s
      ON b.shop_id = s.id

      ORDER BY b.id DESC
    `

    const [rows] = await db.execute(query)

    return NextResponse.json(rows)

  } catch (error) {

    console.log(error)

    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: 500
      }
    )

  }

}