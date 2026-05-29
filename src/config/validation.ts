import type { FormState, FormErrors } from '@/types';

/**
 * Validation rules for contact form
 */
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  email: {
    required: true,
    maxLength: 254,
  },
  phone: {
    required: false,
    maxLength: 20,
  },
  service: {
    required: true,
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 2000,
  },
} as const;

/**
 * Validate form data
 * Returns validation result with errors if any
 */
export function validateForm(formData: FormState): { valid: boolean; errors: FormErrors } {
  const errors: FormErrors = {};

  // Name validation
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.length < VALIDATION_RULES.name.minLength) {
    errors.name = `Name must be at least ${VALIDATION_RULES.name.minLength} characters`;
  } else if (formData.name.length > VALIDATION_RULES.name.maxLength) {
    errors.name = `Name must be less than ${VALIDATION_RULES.name.maxLength} characters`;
  }

  // Email validation
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email';
  } else if (formData.email.length > VALIDATION_RULES.email.maxLength) {
    errors.email = 'Email is too long';
  }

  // Service validation
  if (!formData.service) {
    errors.service = 'Please select a service';
  }

  // Message validation
  if (!formData.message.trim()) {
    errors.message = 'Message is required';
  } else if (formData.message.length < VALIDATION_RULES.message.minLength) {
    errors.message = `Message must be at least ${VALIDATION_RULES.message.minLength} characters`;
  } else if (formData.message.length > VALIDATION_RULES.message.maxLength) {
    errors.message = 'Message is too long';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
