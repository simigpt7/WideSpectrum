/**
 * Sanitize user input to prevent XSS attacks
 * Removes potential HTML tags, javascript: protocol, and event handlers
 * Limits input length to prevent overflow
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 2000); // Limit length
}

/**
 * Sanitize email address
 * Converts to lowercase and removes invalid characters
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().replace(/[^a-z0-9@._+-]/g, '');
}

/**
 * Sanitize phone number
 * Removes all characters except digits, +, -, spaces, and parentheses
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9+\-\s()]/g, '').trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Generate CSRF token
 * Uses cryptographically secure random values
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}
