import { Clock, CheckCircle2 } from "lucide-react"

export function ScheduleInfo() {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Clock className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Scheduled Reminders
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Automatic reminders are configured to send every day at 8:00 AM
            UTC via Vercel Cron Jobs.
          </p>
          <div className="mt-3 flex items-start gap-2 rounded-md bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">
              Cron job is active. Student emails are read from the{" "}
              <code className="rounded bg-emerald-100 dark:bg-emerald-900/50 px-1 py-0.5 text-[10px] font-mono">REMINDER_EMAILS</code>{" "}
              environment variable. Set it in Vercel → Settings → Environment Variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

