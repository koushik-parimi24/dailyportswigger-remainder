import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendReminderEmail(
  to: string,
  studentName: string,
  message: string
) {
  const { error } = await resend.emails.send({
    from: "Lab Reminder <reminders@bingenow.online>",
    to,
    subject: "⏰ Lab Reminder - Action Required",
    html: `
      <div style="font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4361ee 0%, #7c3aed 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: -0.3px;">📚 Lab Reminder</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 13px;">Automated reminder for ASM_2026</p>
        </div>
        <!-- Body -->
        <div style="padding: 28px 24px;">
          <p style="color: #1a1a2e; font-size: 15px; margin: 0 0 16px; line-height: 1.5;">Hi <strong>${studentName}</strong>,</p>
          <div style="background: #f8f9ff; border-left: 4px solid #4361ee; padding: 18px 20px; margin: 0 0 20px; border-radius: 0 8px 8px 0;">
            <p style="color: #1a1a2e; margin: 0; font-size: 15px; line-height: 1.7;">${message}</p>
          </div>
          <p style="color: #64748b; font-size: 13px; margin: 0; line-height: 1.6;">made by koushik(bingenow.online)</p>
        </div>
        <!-- Footer -->
        <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">This is an automated reminder for ASM_2026.</p>
          <p style="color: #cbd5e1; font-size: 10px; margin: 6px 0 0;">Sent via Lab Reminder • bingenow.online</p>
        </div>
      </div>
    `,
  })

  if (error) {
    throw new Error(error.message)
  }
}
