import { NextResponse } from "next/server"
import { sendReminderEmail } from "@/lib/send-email"
import { getCronStudents, getCronMessage } from "@/lib/cron-config"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const students = getCronStudents()

  if (students.length === 0) {
    return NextResponse.json({
      message: "No students configured. Set the REMINDER_EMAILS environment variable.",
      timestamp: new Date().toISOString(),
    })
  }

  const message = getCronMessage()
  const results: { email: string; success: boolean; error?: string }[] = []

  // Send emails to all students in parallel
  await Promise.allSettled(
    students.map(async (student) => {
      try {
        await sendReminderEmail(student.email, student.name, message)
        results.push({ email: student.email, success: true })
      } catch (err) {
        results.push({
          email: student.email,
          success: false,
          error: err instanceof Error ? err.message : "Unknown error",
        })
      }
    })
  )

  const sent = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  return NextResponse.json({
    message: `Daily reminder cron completed: ${sent} sent, ${failed} failed`,
    timestamp: new Date().toISOString(),
    total: students.length,
    sent,
    failed,
    results,
  })
}
