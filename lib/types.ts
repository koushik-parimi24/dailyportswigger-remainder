export interface Student {
  name: string
  email: string
  phone: string
}

export interface SendResult {
  student: string
  channel: "email" | "sms"
  success: boolean
  error?: string
}

export interface SendReminderRequest {
  students: Student[]
  message: string
  channels: ("email" | "sms")[]
}

export interface SendReminderResponse {
  total: number
  emailsSent: number
  emailsFailed: number
  smsSent: number
  smsFailed: number
  results: SendResult[]
}
