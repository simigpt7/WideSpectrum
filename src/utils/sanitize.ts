/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Sanitize HTML content
 */
export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Sanitize email address
 */
export const sanitizeEmail = (email: string): string => {
  const sanitized = email.toLowerCase().trim();
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }
  return sanitized;
};

/**
 * Sanitize phone number
 */
export const sanitizePhone = (phone: string): string => {
  // Remove all non-numeric characters except + and spaces
  return phone.replace(/[^0-9+\s]/g, '').trim();
};

/**
 * Sanitize URL
 */
export const sanitizeURL = (url: string): string => {
  try {
    const parsedURL = new URL(url);
    // Only allow http and https protocols
    if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
      return '';
    }
    return parsedURL.toString();
  } catch {
    return '';
  }
};

/**
 * Escape special characters for regex
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
