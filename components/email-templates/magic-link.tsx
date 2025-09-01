// Magic link email template

interface MagicLinkEmailProps {
  magicLink: string
  isNewUser: boolean
  appName: string
}

export default function MagicLinkEmail({ magicLink, isNewUser, appName }: MagicLinkEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#f0fdf4", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#15803d", margin: "0", fontSize: "24px" }}>{appName}</h1>
        <p style={{ color: "#374151", margin: "8px 0 0 0" }}>
          {isNewUser ? "Welcome to your support circle" : "Sign in to your account"}
        </p>
      </div>

      {/* Main Content */}
      <div style={{ padding: "30px 20px" }}>
        {isNewUser ? (
          <>
            <h2 style={{ color: "#374151", fontSize: "20px", marginBottom: "16px" }}>Welcome to CareCircle!</h2>
            <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", marginBottom: "20px" }}>
              You're taking an important step in building your support network. Click the button below to complete your
              account setup and start connecting with your circle.
            </p>
          </>
        ) : (
          <>
            <h2 style={{ color: "#374151", fontSize: "20px", marginBottom: "16px" }}>Sign in to CareCircle</h2>
            <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", marginBottom: "20px" }}>
              Click the button below to securely sign in to your account. This link will expire in 10 minutes for your
              security.
            </p>
          </>
        )}

        {/* Call to Action */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <a
            href={magicLink}
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
            {isNewUser ? "Complete Setup" : "Sign In"}
          </a>
        </div>

        <p style={{ color: "#9ca3af", fontSize: "14px", textAlign: "center", marginBottom: "20px" }}>
          If the button doesn't work, copy and paste this link into your browser:
          <br />
          <a href={magicLink} style={{ color: "#15803d", wordBreak: "break-all" }}>
            {magicLink}
          </a>
        </p>

        {isNewUser && (
          <div
            style={{
              backgroundColor: "#f0fdf4",
              borderRadius: "8px",
              padding: "16px",
              marginTop: "24px",
            }}
          >
            <h3 style={{ color: "#15803d", fontSize: "16px", margin: "0 0 8px 0" }}>What's next?</h3>
            <ul style={{ color: "#374151", fontSize: "14px", margin: "0", paddingLeft: "20px" }}>
              <li>Complete your profile setup</li>
              <li>Invite family and friends to your circle</li>
              <li>Share your first daily update</li>
              <li>Set up your help calendar</li>
            </ul>
          </div>
        )}
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
          If you didn't request this email, you can safely ignore it.
          <br />
          This link will expire in 10 minutes for your security.
        </p>
      </div>
    </div>
  )
}
