"use client"

import { useState } from "react"
import { Send, Loader2, Mail, Smartphone, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { Student, SendReminderResponse } from "@/lib/types"

interface ReminderComposerProps {
  students: Student[]
}

const DEFAULT_MESSAGE =
  "the PortSwigger lab isn't going to hack itself — let's finish it before EOD! 😄"

export function ReminderComposer({ students }: ReminderComposerProps) {
  const [message, setMessage] = useState(DEFAULT_MESSAGE)
  const [sendEmail, setSendEmail] = useState(true)
  const [sendSms, setSendSms] = useState(true)
  const [sending, setSending] = useState(false)
  const [lastResult, setLastResult] = useState<SendReminderResponse | null>(null)

  const channels: ("email" | "sms")[] = []
  if (sendEmail) channels.push("email")
  if (sendSms) channels.push("sms")

  const canSend = students.length > 0 && message.trim().length > 0 && channels.length > 0

  const handleSend = async () => {
    if (!canSend) return

    setSending(true)
    setLastResult(null)

    try {
      console.log("[v0] Sending reminders to", students.length, "students via", channels)
      const res = await fetch("/api/send-reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students, message, channels }),
      })

      console.log("[v0] Response status:", res.status, "content-type:", res.headers.get("content-type"))

      const text = await res.text()
      console.log("[v0] Response body (first 500 chars):", text.substring(0, 500))

      let data: SendReminderResponse
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(`Server returned invalid response (status ${res.status}). Check your API keys and try again.`)
      }

      if (!res.ok) {
        throw new Error((data as unknown as { error: string }).error || "Failed to send reminders")
      }
      setLastResult(data)

      const totalSent = data.emailsSent + data.smsSent
      const totalFailed = data.emailsFailed + data.smsFailed

      if (totalFailed === 0) {
        toast.success(`All ${totalSent} reminders sent successfully!`)
      } else if (totalSent > 0) {
        toast.warning(
          `${totalSent} sent, ${totalFailed} failed. Check the results below.`
        )
      } else {
        toast.error("All reminders failed to send. Check your API keys.")
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred"
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="reminder-message"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Reminder Message
        </label>
        <Textarea
          id="reminder-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reminder message here..."
          className="min-h-28 resize-none"
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium text-foreground">
          Send via
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setSendEmail(!sendEmail)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
              sendEmail
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
            }`}
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setSendSms(!sendSms)}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
              sendSms
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            SMS
          </button>
        </div>
      </div>

      <Button
        onClick={handleSend}
        disabled={!canSend || sending}
        className="w-full"
        size="lg"
      >
        {sending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending to {students.length} students...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Send Reminder to {students.length} Student{students.length !== 1 ? "s" : ""}
          </>
        )}
      </Button>

      {!canSend && students.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Upload a CSV file first to send reminders
        </p>
      )}

      {lastResult && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="mb-3 text-sm font-medium text-foreground">
            Send Results
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {lastResult.emailsSent + lastResult.emailsFailed > 0 && (
              <>
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  {lastResult.emailsSent} emails sent
                </div>
                {lastResult.emailsFailed > 0 && (
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-4 w-4" />
                    {lastResult.emailsFailed} emails failed
                  </div>
                )}
              </>
            )}
            {lastResult.smsSent + lastResult.smsFailed > 0 && (
              <>
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  {lastResult.smsSent} SMS sent
                </div>
                {lastResult.smsFailed > 0 && (
                  <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="h-4 w-4" />
                    {lastResult.smsFailed} SMS failed
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
