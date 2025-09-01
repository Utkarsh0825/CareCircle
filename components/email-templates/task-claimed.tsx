// Task claimed notification email template

interface TaskClaimedEmailProps {
  taskTitle: string
  helperName: string
  taskUrl: string
}

export default function TaskClaimedEmail({ taskTitle, helperName, taskUrl }: TaskClaimedEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#f0fdf4", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#15803d", margin: "0", fontSize: "24px" }}>CareCircle</h1>
        <p style={{ color: "#374151", margin: "8px 0 0 0" }}>Help Request Update</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: "30px 20px" }}>
        <h2 style={{ color: "#374151", fontSize: "20px", marginBottom: "16px" }}>Great news! Someone is helping</h2>

        <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", marginBottom: "20px" }}>
          <strong>{helperName}</strong> has volunteered to help with your request:
        </p>

        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ color: "#15803d", fontSize: "18px", margin: "0 0 8px 0" }}>{taskTitle}</h3>
          <p style={{ color: "#374151", fontSize: "14px", margin: "0" }}>Helper: {helperName}</p>
        </div>

        <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
          You can now coordinate the details directly with {helperName} through the task discussion.
        </p>

        {/* Call to Action */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <a
            href={taskUrl}
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
            View Task & Coordinate
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
          <h3 style={{ color: "#374151", fontSize: "16px", margin: "0 0 8px 0" }}>Next steps:</h3>
          <ul style={{ color: "#6b7280", fontSize: "14px", margin: "0", paddingLeft: "20px" }}>
            <li>Use the task discussion to coordinate details</li>
            <li>Share any specific preferences or requirements</li>
            <li>Exchange contact information if needed</li>
            <li>Don't forget to say thank you!</li>
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
          You're receiving this because someone claimed your help request.
          <br />
          <a href="#" style={{ color: "#15803d" }}>
            Manage notification preferences
          </a>
        </p>
      </div>
    </div>
  )
}
