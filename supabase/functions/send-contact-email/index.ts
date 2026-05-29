import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  _csrf?: string;
}

// Rate limiting store (in-memory, resets on function cold start)
const rateLimitStore = new Map<string, { count: number; firstRequest: number }>();
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in ms
const RATE_LIMIT_MAX = 5;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token, X-Client-Info, Apikey",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// Input sanitization
function sanitize(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 2000);
}

function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().replace(/[^a-z0-9@._+-]/g, '');
}

function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  return (forwarded?.split(',')[0]?.trim() || realIP || 'unknown');
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(clientId);

  if (!record) {
    rateLimitStore.set(clientId, { count: 1, firstRequest: now });
    return true;
  }

  if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(clientId, { count: 1, firstRequest: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

function validatePayload(payload: ContactPayload): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!payload.name || typeof payload.name !== 'string' || payload.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!payload.email || !isValidEmail(payload.email)) {
    errors.push('Valid email is required');
  }

  if (!payload.service || typeof payload.service !== 'string') {
    errors.push('Service selection is required');
  }

  if (!payload.message || typeof payload.message !== 'string' || payload.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const clientIP = getClientIP(req);

  // Check rate limit
  if (!checkRateLimit(clientIP)) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded",
        message: "Too many requests. Please wait before trying again."
      }),
      {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Parse JSON with size limit
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 10000) {
      return new Response(
        JSON.stringify({ error: "Request too large" }),
        {
          status: 413,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const payload: ContactPayload = await req.json();

    // Validate payload
    const validation = validatePayload(payload);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: validation.errors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Sanitize all inputs
    const sanitizedPayload = {
      name: sanitize(payload.name),
      email: sanitizeEmail(payload.email),
      phone: sanitize(payload.phone || ''),
      service: sanitize(payload.service),
      message: sanitize(payload.message),
    };

    // Build email body
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a2030; border-radius: 12px; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid rgba(31, 138, 138, 0.3);">
          <h1 style="margin: 0; color: #7EE7C8; font-size: 24px;">Wide Spectrum Productions</h1>
          <p style="margin: 5px 0 0 0; color: rgba(255,255,255,0.6); font-size: 14px;">New Contact Submission</p>
        </div>

        <div style="background: rgba(10, 32, 48, 0.6); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: rgba(126, 231, 200, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Name</td>
              <td style="padding: 10px 0; color: #ffffff; font-weight: 600;">${sanitizedPayload.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: rgba(126, 231, 200, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
              <td style="padding: 10px 0;"><a href="mailto:${sanitizedPayload.email}" style="color: #3ED6A0; text-decoration: none;">${sanitizedPayload.email}</a></td>
            </tr>
            ${sanitizedPayload.phone ? `
            <tr>
              <td style="padding: 10px 0; color: rgba(126, 231, 200, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Phone</td>
              <td style="padding: 10px 0; color: #ffffff;">${sanitizedPayload.phone}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px 0; color: rgba(126, 231, 200, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Service</td>
              <td style="padding: 10px 0; color: #ffffff;">${sanitizedPayload.service}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="margin: 0 0 15px 0; color: rgba(126, 231, 200, 0.6); font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</h3>
          <div style="background: rgba(10, 32, 48, 0.6); padding: 20px; border-radius: 8px; border-left: 3px solid #3ED6A0;">
            <p style="margin: 0; color: #ffffff; line-height: 1.6; white-space: pre-wrap;">${sanitizedPayload.message}</p>
          </div>
        </div>

        <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(31, 138, 138, 0.3); color: rgba(255,255,255,0.4); font-size: 12px;">
          <p style="margin: 0;">This message was sent from the Wide Spectrum Productions website contact form.</p>
          <p style="margin: 5px 0 0 0;">Reply to: <a href="mailto:${sanitizedPayload.email}" style="color: #3ED6A0;">${sanitizedPayload.email}</a></p>
        </div>
      </div>
    `.trim();

    const emailText = `
New Contact Submission from Wide Spectrum Productions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${sanitizedPayload.name}
Email: ${sanitizedPayload.email}
${sanitizedPayload.phone ? `Phone: ${sanitizedPayload.phone}` : ''}
Service: ${sanitizedPayload.service}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Message:
${sanitizedPayload.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reply to: ${sanitizedPayload.email}
    `.trim();

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "Wide Spectrum Productions <onboarding@resend.dev>",
        to: "WideSpectrumProductions@gmail.com",
        reply_to: sanitizedPayload.email,
        subject: `New Inquiry: ${sanitizedPayload.name} - ${sanitizedPayload.service}`,
        html: emailHtml,
        text: emailText,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Email sending failed:", error);

      // Don't expose internal errors to client
      return new Response(
        JSON.stringify({
          error: "Failed to send email",
          message: "An error occurred. Please try again later.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Unexpected error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "An unexpected error occurred. Please try again later.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
