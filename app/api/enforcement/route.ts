import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateEnforcementNumber } from '@/lib/utils/constants'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('enforcement_requests')
    .select('*, complaint:complaints(title, case_number)')
    .eq('complainant_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { data, error } = await supabase.from('enforcement_requests').insert({
    ...body,
    complainant_id: user.id,
    enforcement_number: generateEnforcementNumber(),
    status: 'submitted',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabase.from('complaints').update({ status: 'enforcement_requested' }).eq('id', body.complaint_id)

  return NextResponse.json(data, { status: 201 })
}
