import twilio from "twilio"

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function sendReminderSMS(to: string, message: string) {
  await client.messages.create({
    body: `[Lab Reminder] ${message}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  })
}
