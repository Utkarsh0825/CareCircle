// Donation receipt email template

interface DonationReceiptEmailProps {
  donorName: string
  amount: number
  donationId: string
  donationDate: string
}

export default function DonationReceiptEmail({
  donorName,
  amount,
  donationId,
  donationDate,
}: DonationReceiptEmailProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#f0fdf4", padding: "20px", textAlign: "center" }}>
        <h1 style={{ color: "#15803d", margin: "0", fontSize: "24px" }}>CareCircle</h1>
        <p style={{ color: "#374151", margin: "8px 0 0 0" }}>Donation Receipt</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: "30px 20px" }}>
        <h2 style={{ color: "#374151", fontSize: "20px", marginBottom: "16px" }}>
          Thank you for your generous donation!
        </h2>

        <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>Dear {donorName},</p>

        <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
          Your donation helps us keep CareCircle free for cancer patients and their families. Every contribution makes a
          real difference in supporting those who need it most.
        </p>

        {/* Donation Details */}
        <div
          style={{
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ color: "#15803d", fontSize: "18px", margin: "0 0 12px 0" }}>Donation Details</h3>
          <div style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6" }}>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>Amount:</strong> ${amount.toFixed(2)} USD
            </p>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>Date:</strong> {donationDate}
            </p>
            <p style={{ margin: "0 0 8px 0" }}>
              <strong>Transaction ID:</strong> {donationId}
            </p>
            <p style={{ margin: "0" }}>
              <strong>Method:</strong> Credit Card (Stripe)
            </p>
          </div>
        </div>

        <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
          This receipt serves as your record for tax purposes. CareCircle is a registered nonprofit organization, and
          your donation may be tax-deductible to the extent allowed by law.
        </p>

        {/* Impact Message */}
        <div
          style={{
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <h3 style={{ color: "#374151", fontSize: "16px", margin: "0 0 8px 0" }}>Your impact:</h3>
          <ul style={{ color: "#6b7280", fontSize: "14px", margin: "0", paddingLeft: "20px" }}>
            <li>Helps maintain secure, reliable platform infrastructure</li>
            <li>Supports development of new features requested by families</li>
            <li>Ensures CareCircle remains free for all cancer patients</li>
            <li>Contributes to our mission of strengthening support networks</li>
          </ul>
        </div>

        <p style={{ color: "#6b7280", fontSize: "16px", lineHeight: "1.5", marginBottom: "24px" }}>
          If you have any questions about your donation or need additional documentation, please don't hesitate to
          contact our support team.
        </p>

        <p style={{ color: "#374151", fontSize: "16px", lineHeight: "1.5", marginBottom: "0" }}>
          With heartfelt gratitude,
          <br />
          <strong>The CareCircle Team</strong>
        </p>
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
        <p style={{ color: "#9ca3af", fontSize: "12px", margin: "0 0 8px 0" }}>
          CareCircle - Supporting cancer patients and their families
        </p>
        <p style={{ color: "#9ca3af", fontSize: "12px", margin: "0" }}>
          Questions? Contact us at support@carecircle.org
        </p>
      </div>
    </div>
  )
}
