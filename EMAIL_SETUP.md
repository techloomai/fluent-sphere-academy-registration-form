# Email Service Setup Guide

## Recommended: Resend (Primary Method)

Resend is a modern email API that's specifically designed for developers and has excellent Next.js integration.

### Setup Steps:

1. **Create Resend Account**
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account (100 emails/day free tier)

2. **Get API Key**
   - Navigate to API Keys in your Resend dashboard
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Add Environment Variables**
   \`\`\`env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   FROM_EMAIL=noreply@yourdomain.com
   TO_EMAIL=admin@fluentsphereacdemy.com
   \`\`\`

4. **Domain Verification (Production)**
   - Add your domain in Resend dashboard
   - Add DNS records as instructed
   - Verify domain ownership

### Benefits:
- ✅ 99.9% deliverability
- ✅ Built for developers
- ✅ Excellent error handling
- ✅ Real-time analytics
- ✅ No SMTP configuration needed

## Fallback: SMTP Configuration

If Resend is not available, the system automatically falls back to SMTP.

### Gmail SMTP Setup:

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2FA for your Gmail account

2. **Generate App Password**
   - Go to Google Account > Security > App passwords
   - Generate password for "Mail"
   - Use this password (not your regular Gmail password)

3. **Environment Variables**
   \`\`\`env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   FROM_EMAIL=your-email@gmail.com
   TO_EMAIL=admin@fluentsphereacdemy.com
   \`\`\`

### Other SMTP Providers:

**Outlook/Hotmail:**
\`\`\`env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
\`\`\`

**Yahoo:**
\`\`\`env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
\`\`\`

## Error Handling & Monitoring

The implementation includes:
- Automatic fallback from Resend to SMTP
- Detailed error logging
- Environment variable validation
- Connection testing
- Retry mechanisms

## Best Practices

1. **Use Resend for production** - Better deliverability and reliability
2. **Keep SMTP as backup** - Ensures email delivery even if Resend fails
3. **Monitor logs** - Check console for email delivery status
4. **Test thoroughly** - Send test registrations to verify setup
5. **Use proper FROM addresses** - Avoid spam filters with verified domains

## Troubleshooting

**Common Issues:**
- `Invalid API key`: Check RESEND_API_KEY format
- `SMTP authentication failed`: Verify app password for Gmail
- `Connection timeout`: Check SMTP host and port
- `Spam folder`: Verify sender domain and reputation

**Debug Mode:**
Check browser console and server logs for detailed error messages with `[v0]` prefix.
