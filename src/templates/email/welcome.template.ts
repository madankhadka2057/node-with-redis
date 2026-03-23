export const getWelcomeTemplate = (name: string): string => {
  const primaryColor = '#6366f1'; // Indigo 500
  const secondaryColor = '#4f46e5'; // Indigo 600

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Platform</title>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); padding: 60px 40px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.025em; }
        .content { padding: 40px; line-height: 1.6; }
        .welcome-text { font-size: 18px; color: #334155; margin-bottom: 24px; }
        .feature-list { background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin: 32px 0; }
        .feature-item { display: flex; align-items: flex-start; margin-bottom: 16px; }
        .feature-icon { margin-right: 12px; font-size: 20px; }
        .footer { background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { margin: 0; font-size: 14px; color: #64748b; }
        .button { display: inline-block; background-color: ${primaryColor}; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px; transition: background-color 0.2s; }
        .button:hover { background-color: ${secondaryColor}; }
        @media (max-width: 600px) { .container { margin: 0; border-radius: 0; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome Home, ${name || 'Friend'}! 🚀</h1>
        </div>
        <div class="content">
          <p class="welcome-text">We're thrilled to have you join our community! Your account is now active and ready for exploration.</p>
          
          <div class="feature-list">
            <div class="feature-item">
              <span class="feature-icon">✨</span>
              <div><strong>Advanced Architecture</strong><br>Built with Clean Architecture and a robust service layer.</div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <div><strong>High Performance</strong><br>Powered by Redis caching and background job processing with BullMQ.</div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🛡️</span>
              <div><strong>Secure Access</strong><br>Protected by PASETO tokens and advanced rate limiting.</div>
            </div>
          </div>
          
          <p>Ready to get started? Dive into your dashboard and see the power of our real-time processing engine in action.</p>
        </div>
        <div class="footer">
          <p>&copy; 2026 NodePro Platform. All rights reserved.</p>
          <p style="margin-top: 8px;">If you have any questions, reply to this email or visit our <a href="#" style="color: ${primaryColor}; text-decoration: none;">support center</a>.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
