import { sanitizeInput, sanitizeEmail, sanitizePhone, generateCSRFToken } from '@/utils/sanitize';
import type { FormState } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Send contact form data to the Supabase Edge Function
 */
export async function sendContactEmail(formData: FormState): Promise<ContactResponse> {
  const csrfToken = generateCSRFToken();

  // Sanitize all inputs before sending
  const sanitizedData: FormState = {
    name: sanitizeInput(formData.name),
    email: sanitizeEmail(formData.email),
    phone: sanitizePhone(formData.phone),
    service: sanitizeInput(formData.service),
    message: sanitizeInput(formData.message),
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-contact-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        ...sanitizedData,
        _csrf: csrfToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Failed to send message',
      };
    }

    return {
      success: true,
      message: data.message || 'Message sent successfully',
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
