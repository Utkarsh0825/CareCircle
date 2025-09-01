// Email service utility functions

export interface EmailTemplate {
  subject: string
  template: string
  data: Record<string, any>
}

export class EmailService {
  static async sendBadDayAlert(patientName: string, circleMembers: string[], updateContent: string) {
    const emailData: EmailTemplate = {
      subject: `${patientName} needs extra support today`,
      template: "bad-day-alert",
      data: {
        patientName,
        updateContent,
        supportUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    }

    return this.sendEmail(circleMembers, emailData)
  }

  static async sendTaskClaimedNotification(
    taskTitle: string,
    helperName: string,
    patientEmail: string,
    taskUrl: string,
  ) {
    const emailData: EmailTemplate = {
      subject: `${helperName} will help with: ${taskTitle}`,
      template: "task-claimed",
      data: {
        taskTitle,
        helperName,
        taskUrl,
      },
    }

    return this.sendEmail([patientEmail], emailData)
  }

  static async sendMagicLink(email: string, magicLink: string, isNewUser = false) {
    const emailData: EmailTemplate = {
      subject: isNewUser ? "Welcome to CareCircle - Complete your setup" : "Sign in to CareCircle",
      template: "magic-link",
      data: {
        magicLink,
        isNewUser,
        appName: "CareCircle",
      },
    }

    return this.sendEmail([email], emailData)
  }

  static async sendInviteToCircle(inviteEmail: string, circleName: string, inviterName: string, inviteCode: string) {
    const emailData: EmailTemplate = {
      subject: `${inviterName} invited you to join ${circleName}`,
      template: "circle-invite",
      data: {
        circleName,
        inviterName,
        inviteCode,
        joinUrl: `${process.env.NEXT_PUBLIC_APP_URL}/auth/join?code=${inviteCode}`,
      },
    }

    return this.sendEmail([inviteEmail], emailData)
  }

  static async sendDailyUpdateReminder(patientEmail: string, patientName: string) {
    const emailData: EmailTemplate = {
      subject: "Gentle reminder: Share your daily update",
      template: "daily-reminder",
      data: {
        patientName,
        updateUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/post`,
      },
    }

    return this.sendEmail([patientEmail], emailData)
  }

  static async sendDonationReceipt(donorEmail: string, donorName: string, amount: number, donationId: string) {
    const emailData: EmailTemplate = {
      subject: `Thank you for your donation to CareCircle - Receipt #${donationId}`,
      template: "donation-receipt",
      data: {
        donorName,
        amount,
        donationId,
        donationDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    }

    return this.sendEmail([donorEmail], emailData)
  }

  private static async sendEmail(recipients: string[], emailData: EmailTemplate) {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: recipients,
          subject: emailData.subject,
          template: emailData.template,
          data: emailData.data,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to send email")
      }

      return result
    } catch (error) {
      console.error("Email service error:", error)
      throw error
    }
  }
}
