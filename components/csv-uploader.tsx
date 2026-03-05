"use client"

import { useCallback, useRef } from "react"
import Papa from "papaparse"
import { Upload, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Student } from "@/lib/types"

interface CsvUploaderProps {
  onStudentsLoaded: (students: Student[]) => void
  onError: (message: string) => void
  studentCount: number
}

export function CsvUploader({ onStudentsLoaded, onError, studentCount }: CsvUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        onError("Please upload a .csv file")
        return
      }

      Papa.parse<Record<string, string>>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields?.map((f) => f.toLowerCase().trim()) || []

          if (!headers.includes("name") || !headers.includes("email") || !headers.includes("phone")) {
            onError(
              "CSV must have columns: name, email, phone. Found: " +
                (results.meta.fields?.join(", ") || "none")
            )
            return
          }

          const students: Student[] = results.data
            .map((row) => {
              const normalized: Record<string, string> = {}
              for (const key of Object.keys(row)) {
                normalized[key.toLowerCase().trim()] = row[key]?.trim() || ""
              }
              return {
                name: normalized["name"] || "",
                email: normalized["email"] || "",
                phone: normalized["phone"] || "",
              }
            })
            .filter((s) => s.name && (s.email || s.phone))

          if (students.length === 0) {
            onError("No valid student rows found in CSV")
            return
          }

          onStudentsLoaded(students)
        },
        error: () => {
          onError("Failed to parse CSV file")
        },
      })
    },
    [onStudentsLoaded, onError]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-border bg-secondary/30 p-8 text-center transition-colors hover:border-primary/40 hover:bg-secondary/50"
    >
      {studentCount > 0 ? (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <FileSpreadsheet className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {studentCount} student{studentCount !== 1 ? "s" : ""} loaded
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload a new CSV to replace the current list
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              Drop your CSV file here
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Required columns: name, email, phone
            </p>
          </div>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        {studentCount > 0 ? "Replace CSV" : "Browse files"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />
    </div>
  )
}
