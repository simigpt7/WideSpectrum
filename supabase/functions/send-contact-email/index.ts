import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: ContactPayload = await req.json();

    const emailBody = `
New Contact Submission from Wide Spectrum Productions Website

Name: ${payload.name}
Email: ${payload.email}
Phone: ${payload.phone || "Not provided"}
Service: ${payload.service}

Message:
${payload.message}

---
This message was sent from the contact form on the Wide Spectrum Productions website.
Reply-to: ${payload.email}
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
        subject: `New Contact: ${payload.name} - ${payload.service}`,
        html: emailBody.replace(/\n/g, "<br>"),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: error }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
