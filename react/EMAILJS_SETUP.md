# EmailJS Setup Guide

## Step 1: Create EmailJS Account
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID** (e.g., `service_abc123`)

## Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Design your email template with these variables:
   - `{{user_name}}` - Sender's name
   - `{{user_email}}` - Sender's email
   - `{{message}}` - Sender's message
4. Save the template
5. Note down your **Template ID** (e.g., `template_xyz789`)

## Step 4: Get Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key** (e.g., `user_def456`)

## Step 5: Configure Environment Variables
1. Create a `.env` file in the `frontend/react/` directory
2. Add the following variables:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Replace the placeholder values with your actual IDs from steps 2-4.

## Step 6: Restart Development Server
After creating the `.env` file, restart your development server:
```bash
npm run dev
```

## Troubleshooting

### 400 Bad Request Error
This usually means:
- Missing or incorrect Service ID
- Missing or incorrect Template ID
- Missing or incorrect Public Key
- Template variables don't match form field names

### Common Issues
1. **Environment variables not loading**: Make sure the `.env` file is in the correct location
2. **Template variables**: Ensure your template uses `{{user_name}}`, `{{user_email}}`, and `{{message}}`
3. **CORS issues**: EmailJS handles this automatically, but check your browser console for errors

### Testing
1. Fill out the contact form
2. Submit the form
3. Check your email for the message
4. Check the browser console for any error messages

## Security Notes
- The Public Key is safe to expose in frontend code
- Never share your Private Key
- EmailJS has rate limiting on free accounts
- Consider upgrading for production use 