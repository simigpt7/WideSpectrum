import { useState, useCallback } from 'react';
import { Send, Check, AlertCircle, Loader2, Shield } from 'lucide-react';
import { Button, Input, Textarea, Select } from '@/components/ui';
import { useRateLimit } from '@/hooks';
import { sanitizeInput, sanitizeEmail, sanitizePhone, generateCSRFToken } from '@/utils/sanitize';
import type { FormState, FormErrors } from '@/types';

interface ContactFormProps {
  onSubmit?: (data: FormState) => Promise<void>;
  services: { value: string; label: string }[];
}

export function ContactForm({ onSubmit, services }: ContactFormProps) {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [csrfToken] = useState(() => generateCSRFToken());

  const { check: checkRateLimit, record: recordSubmission } = useRateLimit({
    maxRequests: 5,
    windowMs: 3600000, // 1 hour
  });

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle input change with sanitization
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      let sanitizedValue: string;

      switch (name) {
        case 'email':
          sanitizedValue = sanitizeEmail(value);
          break;
        case 'phone':
          sanitizedValue = sanitizePhone(value);
          break;
        default:
          sanitizedValue = sanitizeInput(value);
      }

      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
      // Clear error when user types
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  // Handle form submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      // Check rate limit
      if (!checkRateLimit()) {
        setSubmitStatus('error');
        alert('Too many submissions. Please wait before trying again.');
        return;
      }

      setIsSubmitting(true);

      try {
        if (onSubmit) {
          await onSubmit(formData);
        } else {
          // Default behavior - call Supabase Edge Function
          const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify({
              ...formData,
              _csrf: csrfToken,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to send message');
          }
        }

        recordSubmission();
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 6000);
      } catch {
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, csrfToken, validateForm, checkRateLimit, recordSubmission, onSubmit]
  );

  return (
    <div className="glass-card p-8 rounded-2xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="name"
            name="name"
            label="Your Name *"
            type="text"
            required
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <Input
            id="email"
            name="email"
            label="Email Address *"
            type="email"
            required
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>

        {/* Phone & Service Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="phone"
            name="phone"
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange}
          />
          <Select
            id="service"
            name="service"
            label="Service Interested In *"
            required
            options={services}
            value={formData.service}
            onChange={handleChange}
            error={errors.service}
          />
        </div>

        {/* Message */}
        <Textarea
          id="message"
          name="message"
          label="Tell Us About Your Project *"
          required
          rows={5}
          placeholder="Project details..."
          value={formData.message}
          onChange={handleChange}
          error={errors.message}
        />

        {/* Hidden CSRF Field */}
        <input type="hidden" name="_csrf" value={csrfToken} />

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 rounded-lg bg-teal-900/40 border border-teal-700/40 text-teal-300 text-sm flex items-center gap-2">
            <Check size={16} className="text-green-400" />
            Message sent successfully! We'll get back to you shortly.
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 rounded-lg bg-red-900/40 border border-red-700/40 text-red-300 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            Failed to send message. Please try again.
          </div>
        )}

        {/* Security Badge */}
        <div className="flex items-center gap-2 text-teal-400/50 text-xs">
          <Shield size={14} />
          <span>Secure form with CSRF protection & rate limiting</span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          leftIcon={!isSubmitting ? <Send size={18} /> : undefined}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
}
