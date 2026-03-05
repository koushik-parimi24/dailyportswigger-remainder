"use client"

import { useState } from "react"
import { GraduationCap, Download } from "lucide-react"
import { CsvUploader } from "@/components/csv-uploader"
import { StudentTable } from "@/components/student-table"
import { ReminderComposer } from "@/components/reminder-composer"
import { ScheduleInfo } from "@/components/schedule-info"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Student } from "@/lib/types"

const SAMPLE_CSV = `name,email,phone
John Doe,john@example.com,+11234567890
Jane Smith,jane@example.com,+10987654321`

export default function Home() {
  const [students, setStudents] = useState<Student[]>([])

  const handleStudentsLoaded = (loaded: Student[]) => {
    setStudents(loaded)
    toast.success(`${loaded.length} students loaded from CSV`)
  }

  const handleError = (message: string) => {
    toast.error(message)
  }

  const downloadSampleCsv = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample-students.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Lab Reminder
              </h1>
              <p className="text-sm text-muted-foreground">
                Send reminders to your students via email and SMS
              </p>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-8">
          {/* Step 1: Upload CSV */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  1
                </span>
                <h2 className="text-sm font-medium text-foreground">
                  Upload Student List
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={downloadSampleCsv}
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Sample CSV
              </Button>
            </div>
            <CsvUploader
              onStudentsLoaded={handleStudentsLoaded}
              onError={handleError}
              studentCount={students.length}
            />
          </section>

          {/* Student Table */}
          {students.length > 0 && (
            <section>
              <StudentTable students={students} />
            </section>
          )}

          {/* Step 2: Compose & Send */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                2
              </span>
              <h2 className="text-sm font-medium text-foreground">
                Compose & Send
              </h2>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <ReminderComposer students={students} />
            </div>
          </section>

          {/* Schedule Info */}
          <section>
            <ScheduleInfo />
          </section>
        </div>
      </div>
    </main>
  )
}
