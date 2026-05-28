import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { complaint_id, preferred_date, preferred_time, lga_office } = body

  // Validate office location exists
  const validLGAs = ['Ikeja', 'Alimosho', 'Badagry', 'Ikorodu', 'Lagos Island', 'Onikan']
  if (!validLGAs.includes(lga_office)) {
    return NextResponse.json({ error: 'Invalid LGA office' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      complaint_id,
      user_id: user.id,
      preferred_date,
      preferred_time,
      lga_office,
      status: 'pending'
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}