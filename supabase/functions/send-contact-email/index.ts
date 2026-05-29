import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailPayload {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const body: EmailPayload = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get Resend API key from environment
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare email content
    const emailContent = {
      from: "noreply@widespectrumproductions.com",
      to: "WideSpectrumProductions@gmail.com",
      reply_to: body.email,
      subject: `New Contact Form Submission from ${body.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #a855f7, #0ea5e9); padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold; width: 120px;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${escapeHtml(body.name)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">
                  <a href="mailto:${escapeHtml(body.email)}" style="color: #a855f7;">${escapeHtml(body.email)}</a>
                </td>
              </tr>
              ${body.phone ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Phone:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${escapeHtml(body.phone)}</td>
                </tr>
              ` : ''}
              ${body.service ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #dee2e6; font-weight: bold;">Service:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${escapeHtml(body.service)}</td>
                </tr>
              ` : ''}
            </table>
            <div style="margin-top: 20px;">
              <h3 style="margin-bottom: 10px; color: #a855f7;">Message:</h3>
              <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 5px; border: 1px solid #dee2e6;">${escapeHtml(body.message)}</p>
            </div>
          </div>
          <div style="background: #0f172a; padding: 15px; border-radius: 0 0 10px 10px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
              This email was sent from the contact form on Wide Spectrum Productions website
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${body.name}
Email: ${body.email}
${body.phone ? `Phone: ${body.phone}` : ""}
${body.service ? `Service: ${body.service}` : ""}

Message:
${body.message}

---
This email was sent from the contact form on Wide Spectrum Productions website
      `.trim(),
    };

    // Send email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailContent),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Resend API error:", error);
      throw new Error("Failed to send email");
    }

    const result = await response.json();
    console.log("Email sent successfully:", result.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        messageId: result.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Helper function to escape HTML for security
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
