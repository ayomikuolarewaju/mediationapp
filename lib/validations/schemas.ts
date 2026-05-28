import { z } from 'zod'

export const registerSchema = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(11, 'Phone number must be 11 digits').max(14),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  lga: z.string().min(1, 'Please select your LGA'),
  address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const complaintSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  category: z.enum([
    'family_dispute', 'landlord_tenant', 'employment',
    'property_inheritance', 'financial_claim', 'other'
  ]),
  description: z.string().min(50, 'Please provide at least 50 characters describing the complaint'),
  respondent_name: z.string().min(2, 'Respondent name is required'),
  respondent_phone: z.string().optional(),
  respondent_address: z.string().optional(),
  lga: z.string().min(1, 'Please select the LGA where the dispute occurred'),
})

export const appointmentSchema = z.object({
  scheduled_date: z.string().min(1, 'Please select a date'),
  scheduled_time: z.string().min(1, 'Please select a time'),
  location: z.string().min(1, 'Please select a location'),
  lga: z.string().min(1, 'Please select the LGA'),
  notes: z.string().optional(),
})

export const enforcementSchema = z.object({
  reason: z.string().min(50, 'Please provide a detailed reason (at least 50 characters)'),
})

export const profileSchema = z.object({
  full_name: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z.string().min(11, 'Phone number must be 11 digits').max(14),
  address: z.string().optional(),
  lga: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ComplaintInput = z.infer<typeof complaintSchema>
export type AppointmentInput = z.infer<typeof appointmentSchema>
export type EnforcementInput = z.infer<typeof enforcementSchema>
export type ProfileInput = z.infer<typeof profileSchema>
