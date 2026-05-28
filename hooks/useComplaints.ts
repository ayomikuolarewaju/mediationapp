'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Complaint, ComplaintStatus } from '@/types'

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchMyComplaints = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('complainant_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComplaints(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchComplaint = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select(`*, profile:profiles!complainant_id(*)`)
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Complaint
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateComplaintStatus = useCallback(async (id: string, status: ComplaintStatus) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }, [])

  return { complaints, loading, error, fetchMyComplaints, fetchComplaint, updateComplaintStatus }
}
