import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    if (req.method === 'POST' && path === 'contact') {
      const payload: ContactPayload = await req.json();

      // Validate input
      if (!payload.name || !payload.email || !payload.message) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Sanitize input
      const sanitize = (str: string) => str.replace(/[<>]/g, '').trim().slice(0, 2000);
      const sanitizeEmail = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9@._+-]/g, '');

      const sanitizedData = {
        name: sanitize(payload.name),
        email: sanitizeEmail(payload.email),
        phone: payload.phone ? payload.phone.replace(/[^0-9+\-\s()]/g, '').trim() : null,
        service: payload.service ? sanitize(payload.service) : null,
        message: sanitize(payload.message),
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
        user_agent: req.headers.get('user-agent') || null,
        status: 'new',
      };

      // Insert into database
      const { data, error } = await supabaseClient
        .from('contact_submissions')
        .insert([sanitizedData])
        .select()
        .single();

      if (error) {
        console.error('Error inserting contact:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to save contact submission' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Send email notification (optional - using Resend)
      // const resendApiKey = Deno.env.get('RESEND_API_KEY');
      // if (resendApiKey) {
      //   await fetch('https://api.resend.com/emails', {
      //     method: 'POST',
      //     headers: {
      //       'Authorization': `Bearer ${resendApiKey}`,
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       from: 'noreply@widespectrumproductions.com',
      //       to: 'WideSpectrumProductions@gmail.com',
      //       subject: `New Contact: ${sanitizedData.name}`,
      //       html: `
      //         <h2>New Contact Submission</h2>
      //         <p><strong>Name:</strong> ${sanitizedData.name}</p>
      //         <p><strong>Email:</strong> ${sanitizedData.email}</p>
      //         <p><strong>Phone:</strong> ${sanitizedData.phone || 'N/A'}</p>
      //         <p><strong>Service:</strong> ${sanitizedData.service || 'N/A'}</p>
      //         <p><strong>Message:</strong></p>
      //         <p>${sanitizedData.message}</p>
      //       `,
      //     }),
      //   });
      // }

      return new Response(
        JSON.stringify({ success: true, data }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get contacts (admin)
    if (req.method === 'GET' && path === 'contacts') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabaseClient
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch contacts' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
