import { supabase, TABLES, ContactSubmission } from '../lib/supabase';
import { ContactFormData } from '../types';

export const submitContactForm = async (data: ContactFormData): Promise<ContactSubmission> => {
  // If Supabase is configured, use it
  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    try {
      const { data: result, error } = await supabase
        .from(TABLES.CONTACT_SUBMISSIONS)
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          service: data.service || null,
          message: data.message,
          status: 'new',
        })
        .select()
        .single();

      if (error) throw error;

      // Additionally trigger edge function for email notification
      await sendNotificationEmail(data);

      return result;
    } catch (error) {
      console.error('Supabase submission error:', error);
      throw new Error('Failed to submit form. Please try again later.');
    }
  }

  // Fallback: Just send notification email
  try {
    await sendNotificationEmail(data);
    return {
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message,
    };
  } catch (error) {
    console.error('Email notification error:', error);
    throw new Error('Failed to submit form. Please try again later.');
  }
};

const sendNotificationEmail = async (data: ContactFormData) => {
  const functionName = 'send-contact-email';

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          service: data.service,
          message: data.message,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send notification');
    }

    return response.json();
  } catch (error) {
    console.error('Edge function error:', error);
    // Don't throw - we still want to succeed even if email fails
    // The data is already saved in Supabase
  }
};

// Fetch all contact submissions (admin use)
export const fetchContactSubmissions = async (): Promise<ContactSubmission[]> => {
  const { data, error } = await supabase
    .from(TABLES.CONTACT_SUBMISSIONS)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Update submission status (admin use)
export const updateSubmissionStatus = async (
  id: string,
  status: ContactSubmission['status']
): Promise<ContactSubmission> => {
  const { data, error } = await supabase
    .from(TABLES.CONTACT_SUBMISSIONS)
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
