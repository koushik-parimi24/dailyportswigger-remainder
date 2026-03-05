/**
 * Cron job configuration helpers.
 * Reads student emails and reminder message from environment variables.
 */

const DEFAULT_REMINDER_MESSAGE =
  "This is a reminder that we have a lab session scheduled today. Please make sure to arrive on time and bring all necessary materials. See you there!"

/**
 * Parse the REMINDER_EMAILS env var into an array of { name, email } objects.
 * Format: "name1:email1,name2:email2" or just "email1,email2" (name defaults to "Student")
 */
export function getCronStudents(): { name: string; email: string }[] {
  const raw = process.env.REMINDER_EMAILS || ""
  if (!raw.trim()) return []

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      if (entry.includes(":")) {
        const [name, email] = entry.split(":")
        return { name: name.trim(), email: email.trim() }
      }
      return { name: "Student", email: entry.trim() }
    })
}

/**
 * Get the reminder message from env var or use default.
 */
export function getCronMessage(): string {
  return process.env.REMINDER_MESSAGE?.trim() || DEFAULT_REMINDER_MESSAGE
}
