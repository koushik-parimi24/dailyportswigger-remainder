import { NextResponse } from "next/server"
import { sendReminderEmail } from "@/lib/send-email"
import { sendReminderSMS } from "@/lib/send-sms"
import type { SendReminderRequest, SendResult, SendReminderResponse } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body: SendReminderRequest = await request.json()
    const { students, message, channels } = body
    console.log("[v0] send-reminders called:", { studentCount: students?.length, channels })

    if (!students || students.length === 0) {
      return NextResponse.json(
        { error: "No students provided" },
        { status: 400 }
      )
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    if (!channels || channels.length === 0) {
      return NextResponse.json(
        { error: "At least one channel (email or sms) is required" },
        { status: 400 }
      )
    }

    const results: SendResult[] = []

    const promises = students.flatMap((student) => {
      const tasks: Promise<void>[] = []

      if (channels.includes("email") && student.email) {
        tasks.push(
          sendReminderEmail(student.email, student.name, message)
            .then(() => {
              results.push({
                student: student.name,
                channel: "email",
                success: true,
              })
            })
            .catch((err: Error) => {
              results.push({
                student: student.name,
                channel: "email",
                success: false,
                error: err.message,
              })
            })
        )
      }

      if (channels.includes("sms") && student.phone) {
        tasks.push(
          sendReminderSMS(student.phone, message)
            .then(() => {
              results.push({
                student: student.name,
                channel: "sms",
                success: true,
              })
            })
            .catch((err: Error) => {
              results.push({
                student: student.name,
                channel: "sms",
                success: false,
                error: err.message,
              })
            })
        )
      }

      return tasks
    })

    await Promise.allSettled(promises)

    const response: SendReminderResponse = {
      total: students.length,
      emailsSent: results.filter(
        (r) => r.channel === "email" && r.success
      ).length,
      emailsFailed: results.filter(
        (r) => r.channel === "email" && !r.success
      ).length,
      smsSent: results.filter(
        (r) => r.channel === "sms" && r.success
      ).length,
      smsFailed: results.filter(
        (r) => r.channel === "sms" && !r.success
      ).length,
      results,
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error("[v0] send-reminders error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    )
  }
}
