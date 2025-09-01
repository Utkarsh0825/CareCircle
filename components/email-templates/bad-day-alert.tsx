// Email template component for bad day alerts
// This would be used with an email service like React Email

interface BadDayAlertProps {
  patientName: string
  updateContent: string
  supportUrl: string
}

export default function BadDayAlertEmail({ patientName, updateContent, supportUrl }: BadDayAlertProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#f0fdf4", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#15803d", margin: "0", fontSize: "24px" }}>CareCircle</h1>
        <p style={{ color: "#374151", margin: "8px 0 0 0" }}>Support Network Alert</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: "30px 20px" }}>
        <h2 style={{ color: "#374151", fontSize: "20px", marginBottom: "16px" }}>
          {patientName} needs extra support today
        </h2>

        <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", marginBottom: "20px" }}>
          {patientName} has shared that they're having a tough day. Here's their update:
        </p>

        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.5", margin: "0" }}>"{updateContent}"</p>
        </div>

        <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
          Consider reaching out with a call, text, or offer to help. Even small gestures can make a big difference.
        </p>

        {/* Call to Action */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <a
            href={supportUrl}
            style={{
              backgroundColor: "#15803d",
              color: "white",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            View Full Update & Respond
          </a>
        </div>

        <div
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            padding: "16px",
            marginTop: "24px",
          }}
        >
          <h3 style={{ color: "#374151", fontSize: "16px", margin: "0 0 8px 0" }}>Ways to show support:</h3>
          <ul style={{ color: "#6b7280", fontSize: "14px", margin: "0", paddingLeft: "20px" }}>
            <li>Send a caring text or make a phone call</li>
            <li>Offer to bring a meal or favorite treat</li>
            <li>Suggest watching a movie together (in person or virtually)</li>
            <li>Help with errands or household tasks</li>
            <li>Simply let them know you're thinking of them</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: "20px",
          textAlign: "center",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <p style={{ color: "#9ca3af", fontSize: "12px", margin: "0" }}>
          You're receiving this because you're part of {patientName}'s support circle.
          <br />
          <a href="#" style={{ color: "#15803d" }}>
            Manage notification preferences
          </a>
        </p>
      </div>
    </div>
  )
}
