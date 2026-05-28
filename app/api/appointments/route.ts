import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('appointments')
    .select('*, complaint:complaints(title, case_number)')
    .eq('complainant_id', user.id)
    .order('scheduled_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase.from('appointments').insert({
    ...body,
    complainant_id: user.id,
    status: 'pending',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update complaint status
  await supabase.from('complaints').update({ status: 'mediation_scheduled' }).eq('id', body.complaint_id)

  return NextResponse.json(data, { status: 201 })
}
