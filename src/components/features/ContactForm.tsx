import React, { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContactForm } from '../../services/contact';
import { SERVICES } from '../../constants/services';
import { ContactFormData } from '../../types';
import { sanitizeInput, sanitizeEmail } from '../../utils/sanitize';
import useRateLimit from '../../hooks/useRateLimit';

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { checkRateLimit, getRemainingTime } = useRateLimit({ maxRequests: 5, windowMs: 60000 });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkRateLimit()) {
      setStatus('error');
      return;
    }

    if (!validateForm()) return;

    setStatus('loading');

    try {
      const sanitizedData: ContactFormData = {
        name: sanitizeInput(formData.name),
        email: sanitizeEmail(formData.email) || formData.email,
        phone: formData.phone ? sanitizeInput(formData.phone) : undefined,
        service: formData.service || undefined,
        message: sanitizeInput(formData.message),
      };

      await submitContactForm(sanitizedData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      console.error('Form submission error:', error);
    }
  };

  const serviceOptions = SERVICES.map((service) => ({
    value: service.id,
    label: service.title,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your name"
        error={errors.name}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="your@email.com"
        error={errors.email}
        required
      />

      <Input
        label="Phone (Optional)"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        placeholder="+91 98765 43210"
        error={errors.phone}
      />

      <Select
        label="Service (Optional)"
        name="service"
        value={formData.service}
        onChange={handleChange}
        options={serviceOptions}
        placeholder="Select a service"
      />

      <Textarea
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Tell us about your project..."
        error={errors.message}
        required
        rows={5}
      />

      {status === 'success' && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p>Thank you! Your message has been sent successfully. We will get back to you soon.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          {getRemainingTime() > 0 ? (
            <p>Too many requests. Please wait {getRemainingTime()} seconds before trying again.</p>
          ) : (
            <p>Something went wrong. Please try again later.</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={status === 'loading'}
        disabled={status === 'loading'}
        rightIcon={<Send className="h-4 w-4" />}
      >
        Send Message
      </Button>
    </form>
  );
};

export default ContactForm;
