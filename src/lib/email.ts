import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface WelcomeEmailData {
  firstName: string
  lastName: string
  email: string
  roleType: string
  country: string
  educationLevel?: string
  fieldOfStudy?: string
  careerStage?: string
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const { firstName, lastName, email, roleType, country, educationLevel, fieldOfStudy, careerStage } = data
    
    const { data: emailData, error } = await resend.emails.send({
      from: 'Global Bridge Initiative <noreply@globalbridgeinitiative.org>',
      to: [email],
      subject: `Welcome to Global Bridge Initiative 2026, ${firstName}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Global Bridge Initiative</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background: white;
              border-radius: 10px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #4f46e5;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #4f46e5;
              margin-bottom: 10px;
            }
            .title {
              color: #1f2937;
              font-size: 28px;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #6b7280;
              font-size: 16px;
              margin-bottom: 20px;
            }
            .welcome-message {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 25px;
              border-radius: 8px;
              margin: 25px 0;
              text-align: center;
            }
            .user-info {
              background: #f3f4f6;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              padding: 5px 0;
            }
            .info-label {
              font-weight: 600;
              color: #4b5563;
            }
            .info-value {
              color: #1f2937;
            }
            .next-steps {
              margin: 30px 0;
            }
            .step {
              display: flex;
              align-items: flex-start;
              margin: 15px 0;
        }
            .step-number {
              background: #4f46e5;
              color: white;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              margin-right: 15px;
              flex-shrink: 0;
            }
            .step-content {
              flex: 1;
            }
            .cta-button {
              display: inline-block;
              background: #4f46e5;
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
              text-align: center;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .highlight {
              color: #4f46e5;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🌍 Global Bridge Initiative</div>
              <h1 class="title">Welcome to the 2026 Amsterdam Summit!</h1>
              <p class="subtitle">Your journey toward global impact starts now</p>
            </div>

            <div class="welcome-message">
              <h2>🎉 Congratulations, ${firstName}!</h2>
              <p>You've successfully registered for the Global Bridge Initiative 2026 Amsterdam Summit. We're thrilled to have you join our community of changemakers from ${country}!</p>
              ${fieldOfStudy ? `<p>Your background in ${fieldOfStudy} will bring valuable perspectives to our global discussions.</p>` : ''}
            </div>

            <div class="user-info">
              <h3>Registration Details</h3>
              <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="info-value">${firstName} ${lastName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Role:</span>
                <span class="info-value">${roleType === 'student' ? 'Student' : 'Entrepreneur'}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Country:</span>
                <span class="info-value">${country}</span>
              </div>
              ${educationLevel ? `
              <div class="info-row">
                <span class="info-label">Education Level:</span>
                <span class="info-value">${educationLevel}</span>
              </div>` : ''}
              ${fieldOfStudy ? `
              <div class="info-row">
                <span class="info-label">Field of Study:</span>
                <span class="info-value">${fieldOfStudy}</span>
              </div>` : ''}
              ${careerStage ? `
              <div class="info-row">
                <span class="info-label">Career Stage:</span>
                <span class="info-value">${careerStage}</span>
              </div>` : ''}
              <div class="info-row">
                <span class="info-label">Registration Fee:</span>
                <span class="info-value highlight">✅ Paid ($15 USD)</span>
              </div>
            </div>

            <div class="next-steps">
              <h3>What's Next?</h3>
              
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <strong>Upload Your Documents</strong>
                  <p>Complete your application by uploading the required documents through your dashboard.</p>
                </div>
              </div>

              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <strong>Application Review</strong>
                  <p>Our team will review your application and documents within 5-7 business days.</p>
                </div>
              </div>

              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <strong>Confirmation & Preparation</strong>
                  <p>Once approved, you'll receive detailed information about travel, accommodation, and summit preparation.</p>
                </div>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="https://globalbridgeinitiative.org/dashboard" class="cta-button">
                Go to Your Dashboard
              </a>
            </div>

            <div class="footer">
              <p><strong>Important Dates:</strong></p>
              <p>• Document Upload Deadline: March 15, 2026</p>
              <p>• Application Review Period: March 16 - April 15, 2026</p>
              <p>• Summit Dates: June 10-12, 2026</p>
              <p>• Location: Amsterdam, Netherlands</p>
              <br>
              <p>Have questions? Contact us at <a href="mailto:info@globalbridgeinitiative.org">info@globalbridgeinitiative.org</a></p>
              <p>© 2026 Global Bridge Initiative. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error: error.message }
    }

    console.log('Welcome email sent successfully:', emailData)
    return { success: true, data: emailData }
  } catch (error) {
    console.error('Email service error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    }
  }
}
