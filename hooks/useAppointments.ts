'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Appointment } from '@/types'

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchMyAppointments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('appointments')
        .select(`*, complaint:complaints(*)`)
        .eq('complainant_id', user.id)
        .order('scheduled_date', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAppointment = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`*, complaint:complaints(*), mediator:profiles!mediator_id(*)`)
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Appointment
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { appointments, loading, error, fetchMyAppointments, fetchAppointment }
}
