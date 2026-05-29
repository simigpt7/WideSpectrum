export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s'-]+$/,
    messages: {
      required: 'Name is required',
      minLength: 'Name must be at least 2 characters',
      maxLength: 'Name cannot exceed 100 characters',
      pattern: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    },
  },
  email: {
    required: true,
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: 'Email is required',
      maxLength: 'Email cannot exceed 254 characters',
      pattern: 'Please enter a valid email address',
    },
  },
  phone: {
    required: false,
    minLength: 10,
    maxLength: 15,
    pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
    messages: {
      minLength: 'Phone number must be at least 10 digits',
      maxLength: 'Phone number cannot exceed 15 digits',
      pattern: 'Please enter a valid phone number',
    },
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 5000,
    messages: {
      required: 'Message is required',
      minLength: 'Message must be at least 10 characters',
      maxLength: 'Message cannot exceed 5000 characters',
    },
  },
} as const;

type ValidationRuleKey = keyof typeof VALIDATION_RULES;

export const validateField = (
  name: ValidationRuleKey,
  value: string
): { isValid: boolean; error?: string } => {
  const rules = VALIDATION_RULES[name];
  if (!rules) return { isValid: true };

  const trimmedValue = value.trim();

  // Required check
  if (rules.required && !trimmedValue) {
    return { isValid: false, error: rules.messages.required };
  }

  // Skip further validation if field is optional and empty
  if (!rules.required && !trimmedValue) {
    return { isValid: true };
  }

  // Min length check
  if ('minLength' in rules && rules.minLength && trimmedValue.length < rules.minLength) {
    return { isValid: false, error: rules.messages.minLength };
  }

  // Max length check
  if ('maxLength' in rules && rules.maxLength && trimmedValue.length > rules.maxLength) {
    return { isValid: false, error: rules.messages.maxLength };
  }

  // Pattern check
  if ('pattern' in rules && rules.pattern && !rules.pattern.test(trimmedValue)) {
    return { isValid: false, error: rules.messages.pattern };
  }

  return { isValid: true };
};

export const sanitizeFormData = <T extends Record<string, string>>(
  data: T
): T => {
  const sanitized: Record<string, string> = {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Basic sanitization - remove script tags and limit to allowed characters
      sanitized[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
};
