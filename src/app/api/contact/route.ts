import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Temporary sender for Resend testing until quietdissent.com is verified.
const FROM_ADDRESS = "onboarding@resend.dev";
const FORWARD_TO = "quietdissentco@gmail.com";

const SOURCE_LABELS: Record<string, string> = {
  google: "Google Search",
  referral: "Referral",
  social: "Social Media",
  other: "Other",
};

const CONTACT_METHOD_LABELS: Record<string, string> = {
  email: "Email",
  phone: "Phone",
  either: "Either",
};

function forwardHtml(fields: {
  name: string;
  email: string;
  business: string;
  industry: string;
  headache: string;
  source: string;
  contactMethod: string;
  phone: string;
  submittedAt: string;
}): string {
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);
                 font-family:'Courier New',Courier,monospace;font-size:11px;
                 color:#6A6A68;letter-spacing:0.08em;text-transform:uppercase;
                 width:160px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0 10px 20px;border-bottom:1px solid rgba(255,255,255,0.06);
                 font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,
                 Arial,sans-serif;font-size:15px;color:#C8C8C3;line-height:1.6;
                 vertical-align:top;">${value || "<em style='color:#444'>—</em>"}</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>New Inquiry — ${fields.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#111111;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
         style="background:#111111;padding:48px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:600px;background:#1A1A1A;border-radius:8px;
                      border:1px solid rgba(255,255,255,0.07);overflow:hidden;">

          <tr>
            <td style="padding:28px 40px;border-bottom:1px solid rgba(255,255,255,0.06);
                       background:#141414;">
              <p style="margin:0 0 4px;font-family:'Courier New',Courier,monospace;
                         font-size:11px;color:#5F8575;letter-spacing:0.12em;
                         text-transform:uppercase;">New Inquiry</p>
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;
                         font-style:italic;font-size:22px;color:#FFFFF0;">
                ${fields.name}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                ${row("Name", fields.name)}
                ${row("Email", `<a href="mailto:${fields.email}" style="color:#5F8575;text-decoration:none;">${fields.email}</a>`)}
                ${row("Business", fields.business)}
                ${row("Industry", fields.industry)}
                ${row("Phone", fields.phone)}
                ${row("Found via", SOURCE_LABELS[fields.source] ?? fields.source)}
                ${row("Contact pref.", CONTACT_METHOD_LABELS[fields.contactMethod] ?? fields.contactMethod)}
                ${row("Submitted", fields.submittedAt)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 40px;">
              <p style="margin:0 0 12px;font-family:'Courier New',Courier,monospace;
                         font-size:11px;color:#6A6A68;letter-spacing:0.08em;
                         text-transform:uppercase;">Biggest Operational Headache</p>
              <div style="background:#111111;border-left:3px solid #5F8575;
                          border-radius:0 4px 4px 0;padding:16px 20px;">
                <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,
                           'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;
                           color:#C8C8C3;line-height:1.7;white-space:pre-wrap;">
                  ${fields.headache.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 40px;border-top:1px solid rgba(255,255,255,0.04);">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;
                         font-size:11px;color:#3A3A38;letter-spacing:0.04em;">
                Sent via quietdissent.com contact form
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, email, business, industry, headache, source, contactMethod, phone = "" } = body;

  if (!name || !email || !business || !industry || !headache || !source || !contactMethod) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const submittedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "full",
    timeStyle: "short",
  }) + " CT";

  try {
    const forward = await resend.emails.send({
      from: FROM_ADDRESS,
      to: FORWARD_TO,
      replyTo: email,
      subject: `New Inquiry — ${name}`,
      html: forwardHtml({ name, email, business, industry, headache, source, contactMethod, phone, submittedAt }),
      text: `New inquiry from ${name}\n\nName: ${name}\nEmail: ${email}\nBusiness: ${business}\nIndustry: ${industry}\nPhone: ${phone || "Not provided"}\nFound via: ${SOURCE_LABELS[source] ?? source}\nContact preference: ${CONTACT_METHOD_LABELS[contactMethod] ?? contactMethod}\nSubmitted: ${submittedAt}\n\nBiggest Operational Headache:\n${headache}`,
    });

    if (forward.error) {
      console.error("[contact] Resend error:", forward.error);
      return NextResponse.json({ error: forward.error.message ?? "Email send failed." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}